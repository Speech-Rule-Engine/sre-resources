process.chdir('/home/sorge/git/sre/speech-rule-engine');

function rewriteNumbers(locale) {
  let loc = require(`./js/l10n/numbers/numbers_${locale}.js`).default;
  delete loc.wordOrdinal;
  delete loc.simpleOrdinal;
  delete loc.numberToWords;
  delete loc.numberToOrdinal;
  let newObj = {
    "kind": "numbers",
    "locale": locale,
    "messages": loc
  };
  fs.mkdirSync(`./src/mathmaps/${locale}/messages`, {recursive: true});  
  fs.writeFileSync(`./src/mathmaps/${locale}/messages/numbers.js`, JSON.stringify(newObj, null, 2));  
}

function rewriteAlphabets(locale) {
  let loc = require(`./js/l10n/locales/locale_${locale}.js`)[locale];
  let msg = Object.assign({}, loc.ALPHABETS, loc.ALPHABET_PREFIXES);
  let newObj = {
    "kind": "alphabets",
    "locale": locale,
    "messages": msg
  };
  fs.mkdirSync(`./src/mathmaps/${locale}/messages`, {recursive: true});  
  fs.writeFileSync(`./src/mathmaps/${locale}/messages/alphabets.js`, JSON.stringify(newObj, null, 2));  
}

function rewriteMessages(locale) {
  let loc = require(`./js/l10n/locales/locale_${locale}.js`)[locale];
  let msg = {};
  msg.MS = Object.assign({}, loc.MS);
  msg.MSroots = Object.assign({}, loc.MS_ROOT_INDEX);
  msg.font = loc.FONT;
  msg.embellish = loc.EMBELLISH;
  msg.role = loc.ROLE;
  msg.enclose = loc.ENCLOSE;
  msg.navigate = loc.NAVIGATE;
  msg.regexp = loc.REGEXP;
  msg.unitTimes = loc.UNIT_TIMES;
  let newObj = {
    "kind": "messages",
    "locale": locale,
    "messages": msg
  };
  fs.mkdirSync(`./src/mathmaps/${locale}/messages`, {recursive: true});  
  fs.writeFileSync(`./src/mathmaps/${locale}/messages/messages.js`, JSON.stringify(newObj, null, 2));  
}


function allLocales(func) {
  let {Variables} = require('./js/common/variables.js');
  Variables.LOCALES.forEach(func);
}
