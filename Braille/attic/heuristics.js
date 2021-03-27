

/**
 *  Rewrites space separated lists of simple elements into row vectors.
 *  (Currently only used in Nemeth.)
 */
sre.SemanticHeuristics.add(
  'list2vector',
  new sre.SemanticTreeHeuristic({
    predicate: function(node) {
      return sre.Engine.getInstance().modality === 'braille' &&
        node.type === sre.SemanticAttr.Type.FENCED &&
        node.childNodes[0].type === sre.SemanticAttr.Type.INFIXOP &&
        node.childNodes[0].role === sre.SemanticAttr.Role.IMPLICIT &&
        node.childNodes[0].contentNodes.some(function(x) {
          return x.role === sre.SemanticAttr.Role.SPACE;
        })
        ;
    },
    method: function(node) {
      // TODO: Test for simple elements?
      node.type = sre.SemanticAttr.Type.MATRIX;
      node.role = sre.SemanticAttr.Role.ROWVECTOR;
      var row = node.childNodes[0];
      row.type = sre.SemanticAttr.Type.ROW;
      row.role = sre.SemanticAttr.Role.ROWVECTOR;
      var content = row.contentNodes;
      var children = row.childNodes;
      row.contentNodes = [];
      row.childNodes = [];
      // TODO: Work out text spaces!
      var toCell = function(op, elem) {
        op.type = sre.SemanticAttr.Type.CELL;
        op.role = sre.SemanticAttr.Role.ROWVECTOR;
        op.childNodes = [elem];
        elem.parent = op;
      };
      var getInfix = function(factors, juxtas, elements, operators) {
        factors.push(elements.shift());
        if (!operators.length || operators[0].role === sre.SemanticAttr.Role.SPACE) {
          var cell = sre.SemanticHeuristics.getInstance().factory.makeBranchNode(
            sre.SemanticAttr.Type.INFIXOP, factors, juxtas, juxtas[0].textContent);
          cell.role = sre.SemanticAttr.Role.IMPLICIT;
          elements.unshift(cell);
          return elements;
        }
        juxtas.push(operators.shift());
        return getInfix(factors, juxtas, elements, operators);
      };
      while (content.length) {
        var fop = content.shift();
        var felem = children.shift();
        if (fop.role !== sre.SemanticAttr.Role.SPACE) {
          children = getInfix([felem], [fop], children, content);
          continue;
        }
        toCell(fop, felem);
        row.childNodes.push(fop);
        fop.parent = row;
      }
      if (children.length) {
        var cell = sre.SemanticHeuristics.getInstance().
            factory.makeBranchNode(
              sre.SemanticAttr.Type.CELL, [children[0]], []);
        row.childNodes.push(cell);
        cell.parent = row;
      }
      return node;
    }})
);
