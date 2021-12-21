sre.Messages.ALPHABETS.greekSmall.forEach(x => console.log(x))

function outputMapping(map) {
  for (let [k, v] of Object.entries(map)) {
    console.log(v instanceof Array ? v[0] : v);
  }
}




[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[20, 21, 22, 23, 24, 25, 26, 27, 28, 29].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[30, 31].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[40, 50, 60, 70, 80, 90].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[100, 101].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[200, 300, 400, 500, 600, 700, 800, 900].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[1000, 2000].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[1000000, 2000000].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[1000000000, 2000000000].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))
[Math.pow(10, 12), Math.pow(10, 15), Math.pow(10, 18), Math.pow(10, 21), Math.pow(10, 24), Math.pow(10, 27), Math.pow(10, 30), Math.pow(10, 33)].forEach(x => console.log(sre.Messages.NUMBERS.numberToWords(x)))


[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 0, 30, 0, 40, 0, 50, 0, 60, 0, 70, 0, 80, 0, 90, 0, 100, 0, 200, 0, 300, 0, 400, 0, 500, 0, 600, 0, 700, 0, 800, 0, 900, 0, 1000].forEach(x => console.log(x ? sre.Messages.NUMBERS.numberToOrdinal(x) : ' '));


function getTextString(text) {
  if (text.match(/^\".*\"$/)) {
    return text.slice(1, text.length - 1);
  }
  return null;
};

function getAllText(constraints) {
  let rules = sre.Trie.collectRules_(
    sre.SpeechRuleEngine.getInstance().activeStore_.trie.byConstraint(constraints));
  let mapping = {};
  for (let rule of rules) {
    for (let component of rule.action.components) {
      if (component.type === 'TEXT') {
      let text = SplitJson.getTextString(component.content);
        if (text) {
          mapping[text] = true;
        }
      }
    }
  }
  return Object.keys(mapping).sort();
}
