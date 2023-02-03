function code(chars) {
  return chars.map(x => x.codePointAt(0));
}

function hexCode(chars) {
  return chars.map(x => {
    return Array.isArray(x) ?
      [x[0].toString(16), x[1].toString(16)] :
      x.toString(16);
  });
}

function ints(chars) {
  return chars.map(x => String.fromCodePoint(parseInt(x, 16)));
}

function cleanup(int) {
  let result = [];
  for (let [x, y] of int) {
    if (x === y) {
      result.push(x);
      continue;
    }
    if (x + 1 === y) {
      result.push(x, y);
      continue;
    }
    result.push([x, y]);
  }
  return result;
}

function intervals(chars) {
  let codes = code(chars).sort((x, y) => x - y);
  let start = codes.shift();
  let last = start;
  let result = [];
  while (codes.length) {
    let current = codes.shift();
    if (current - 1 === last) {
      last = current;
      continue;
    }
    result.push([start, last]);
    start = current;
    last = current;
  }
  result.push([start, last]);
  return hexCode(cleanup(result));
}

///
// [
//   [ '2190', '21ff' ], [ '2301', '2301' ],
//   [ '2303', '2304' ], [ '2324', '2324' ],
//   [ '238b', '238b' ], [ '2794', '2794' ],
//   [ '2798', '27af' ], [ '27b1', '27be' ],
//   [ '27f0', '27ff' ], [ '2900', '292a' ],
//   [ '292d', '297f' ], [ '29b3', '29b4' ],
//   [ '29bd', '29bd' ], [ '29ea', '29ea' ],
//   [ '29ec', '29ed' ], [ '2a17', '2a17' ],
//   [ '2b00', '2b11' ], [ '2b30', '2b4c' ],
//   [ 'ffe9', 'ffec' ]
// ] 


// extract keys from mathmaps files
// grep key $FILE | awk '{print $2}'


function prefixLists(chars) {
  let codes = hexCode(code(chars).sort((x, y) => x - y));
  return prefixLists_(codes);
}

function prefixIntervals(chars) {
  let int = intervals(chars);
  return prefixLists_(int);
}

function prefixPostfix(code) {
  const length = code.length - 2;
  return (length <= 1) ?
    ['', code] : [code.slice(0, length), code.slice(length)];
}

function prefixLists_(codes) {
  let result = {'': []};
  let addResult = (pre, post) => {
    const list = result[pre];
    if (list) {
      list.push(post);
    } else {
      result[pre] = [post];
    }
  };
  for (let code of codes) {
    if (!Array.isArray(code)) {
      const [prefix, postfix] = prefixPostfix(code);
      addResult(prefix, postfix);
      continue;
    }
    let [beg, end] = code;
    let [begPre, begPost] = prefixPostfix(beg);
    let [endPre, endPost] = prefixPostfix(end);
    if (begPre !== endPre) {
      throw 'Something went wrong with prefixes!';
    }
    addResult(begPre, [begPost, endPost]);
  }
  for (let [key, value] of Object.entries(result)) {
    if (!key) continue;
    if (value.length === 1 && !Array.isArray(value)) {
      result[''].push(value[0]);
      continue;
    }
    // let length = key.length;
    // result[key] = intervals(ints(value.map(x => key + x))).map(x => x.slice(length));
  }
  return result;
};


function compareLength(lists) {
  return lists.map(x => {
    let a = JSON.stringify(x).length;
    let b = JSON.stringify(intervals(x)).length;
    let c = JSON.stringify(prefixLists(x)).length;
    let d = JSON.stringify(prefixIntervals(x)).length;
    return (a < b) && (a < c) && (a < d) ? 1 :
      ((b < c) && (b < d)? 2 :
       ((c < d) ? 3 : 4));
  });
};

function getLength(lists) {
  return lists.map(x => {
    let a = JSON.stringify(x).length;
    let b = JSON.stringify(intervals(x)).length;
    let c = JSON.stringify(prefixLists(x)).length;
    let d = JSON.stringify(prefixIntervals(x)).length;
    return (a < b) && (a < c) && (a < d) ? a :
      ((b < c) && (b < d)? b :
       ((c < d) ? c : d));
  });
};

// Get all constants
// echo "let lists = [" > /tmp/constants;  grep "export const" ts/semantic_tree/semantic_attr.ts  | grep "string\[\]" | grep -v Object | grep -v // | grep -v Functions | awk '{print $3}' | awk -F: '{print "SemanticAttr."$1","}' >> /tmp/constants; echo "]" >> /tmp/constants


// [
//   299, 118,  79,  62,   45,  67,  62,
//    67,  45, 186, 109,   65,  11, 104,
//    54, 121,  74, 377,  504, 190, 121,
//   368, 761, 395, 102,   23,  49,  23,
//    55,  62,  98, 148, 1754, 197, 221,
//   147, 156, 199,  59
// ]
