let fs = require('fs');
let shell = require('shelljs');
let xmldom = require('xmldom-sre');
let path = require('path');
let SplitJson = {};


/**
 *  Reference Locale settings.
 *  These need to reset an will take effect on reload.
 */
SplitJson.REF_LANGUAGE = 'English';
SplitJson.REF_ISO = 'en';
SplitJson.TARGET_LANGUAGE = 'Nynorsk';


SplitJson.BASE_PATH_ = '/home/sorge/git/sre/';
// Mathmaps path
SplitJson.L10N_PATH_ = SplitJson.BASE_PATH_ + 'sre-resources/l10n';

SplitJson.PATH_ = SplitJson.BASE_PATH_ + 'speech-rule-engine/mathmaps';

SplitJson.OUTPUT_PATH_ = SplitJson.L10N_PATH_ + '/transform/split-forms';

SplitJson.HTML_PATH_ = '/tmp/html';

SplitJson.TEMPLATE_PATH_ = '/tmp/ods';

SplitJson.ODS_PATH_ = SplitJson.L10N_PATH_ + '/locales';

SplitJson.ALPHANUM_TEMPLATE_ = SplitJson.L10N_PATH_ + '/templates/AlphaNumerics.ods';

SplitJson.ODS_TEMPLATE_ = SplitJson.L10N_PATH_ + '/templates/ods';

SplitJson.INPUT_PATH_ = SplitJson.L10N_PATH_ + '/transform/int-forms';

SplitJson.WWW_BASE_PATH = SplitJson.BASE_PATH_ + 'sre-webpages/resources/www';

SplitJson.UNICODE_PATH = SplitJson.BASE_PATH_ + 'others/unicode-table-data/loc';

SplitJson.CLDR_PATH = SplitJson.BASE_PATH_ + 'others/cldr/common/annotations';

/**
 * Subpath to dir containing ChromeVox JSON definitions for symbols.
 * @type {string}
 * @const
 * @private
 */
SplitJson.SYMBOLS_ = 'symbols';


/**
 * Name of functions file/directory.
 * @type {string}
 * @const
 * @private
 */
SplitJson.FUNCTIONS_ = 'functions';


/**
 * Name of units file/directory.
 * @type {string}
 * @const
 * @private
 */
SplitJson.UNITS_ = 'units';


/**
 * Name of currency file/directory.
 * @type {string}
 * @const
 * @private
 */
SplitJson.CURRENCY_ = 'currency';


/**
 * Name of prefix for prefix file.
 * @type {string}
 * @const
 * @private
 */
SplitJson.PREFIX_ = 'prefix';


/**
 * Subpath to dir containing ChromeVox JSON definitions for unused.
 * @type {string}
 * @const
 * @private
 */
SplitJson.UNUSED_PATH_ = 'unused';

/**
 * Array of JSON filenames containing symbol definitions for math speak.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.SYMBOLS_FILES_ = [
  // Greek
  'greek-scripts.json', 'greek-symbols.json',
  'greek-rest.json',

  // Hebrew
  'hebrew_letters.json',

  // Latin
  'latin-lower-double-accent.json', 'latin-lower-phonetic.json',
  'latin-lower-single-accent.json', 'latin-rest.json',
  'latin-upper-double-accent.json', 'latin-upper-single-accent.json',

  // Math Symbols
  'math_angles.json', 'math_arrows.json', 'math_characters.json',
  'math_delimiters.json', 'math_geometry.json',
  'math_harpoons.json', 'math_non_characters.json', 'math_symbols.json',
  'math_whitespace.json', 'other_stars.json',

  // Digits
  'digits_rest.json'

];


/**
 * Array of JSON filenames containing symbol definitions for math speak.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.FUNCTIONS_FILES_ = [
  'algebra.json', 'elementary.json', 'hyperbolic.json', 'trigonometry.json'
];


/**
 * Array of JSON filenames containing unit definitions for math speak.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.UNITS_FILES_ = [
  'area.json', 'energy.json', 'length.json', 'memory.json', 'other.json', 'speed.json',
  'temperature.json', 'time.json', 'volume.json', 'weight.json'// , 'currency.json' // ???
];


SplitJson.CURRENCY_FILE_ = 'currency.json';

SplitJson.PREFIX_FILE_ = 'prefix.json';

/**
 * Array of JSON filenames containing unit unused unicode translations.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.UNUSED_FILES_ = [
  'accented_characters.json', 'currencies_music.json', 'greek_accented.json',
  'private_area.json', 'special_symbols.json'
];


SplitJson.FILES_MAP_ = new Map([
  [SplitJson.SYMBOLS_, SplitJson.SYMBOLS_FILES_],
  [SplitJson.FUNCTIONS_, SplitJson.FUNCTIONS_FILES_],
  [SplitJson.UNITS_, SplitJson.UNITS_FILES_],
  [SplitJson.CURRENCY_, [SplitJson.CURRENCY_FILE_]]
]);

//  'units_spanish.js'
// TODO: Sort this similar to the above.
// Localisation
// 'spanish.js', 'spanish_mathfonts.js'
//  'functions_spanish.js'



SplitJson.loadLocale = function(files, path) {
  path = path || '';
  let currentLocale = {};
  for (let file of files) {
    let content = fs.readFileSync(path + file);
    if (content) {
      JSON.parse(content).forEach(function(x) {
        let key = x['key'];
        if (key && key.match(/^0x/)) {
          key = SplitJson.numberToUnicode(parseInt(key, 16));
          x['key'] = key;
        } else if (key && key.length === 5 && key[0] === '0') {
          key = key.slice(1);
          x['key'] = key;
        }
        currentLocale[key] = x;
      }); 
    }
  }
  return currentLocale;
};


// Loads a (src) source file for the model.
// 
// Looks up as much as possible translations in locale
//
// Needs the iso variable prefix with locale.
// 
// Writes the split file to dest.
// 
// Outputs missing translations into appropriate file in miss directory if
// provided.
SplitJson.intoFile = function(src, dest, locale, iso, addempty, miss = null) {
  let content = fs.readFileSync(src);
  if (!content) return;
  let list = JSON.parse(content);
  let [result, missing] = SplitJson.splitContent(list, locale, addempty, !miss);
  result.unshift({"locale": iso});
  if (miss) {
    let base = path.basename(src);
    fs.writeFileSync(miss + '/' + base, JSON.stringify(missing, null, 2));
    for (let ms of missing) {
      if (!ms.key) continue;
      fs.appendFileSync(miss + '.csv', `"${base}","${ms.key}","${ms.mappings.default.default}"\n`);
    }
  }
  fs.writeFileSync(dest, JSON.stringify(result, null, 2));
};


// That's the actual splitting method.
// List is the model to work with. Locale the potential translations.
// Returns the list of translations and the list of missing elements.
// Optionally add non-existent elements as empties.
SplitJson.splitContent = function(list, locale, addempty = false, symbol = false) {
  let result = [];
  let missing = [];
  for (let element of list) {
    let loc = SplitJson.findContent(element, locale);
    if (loc) {
      if (element.category) {
        loc.category = element.category;
      }
      if (element.names) {
        loc.names = element.names;
      }
      if (element.si) {
        loc.si = element.si;
      }
      result.push(loc);
      delete locale[element['key']];
    } else {
      if (addempty && element && element.key) {
        loc = {key: element['key']};
        if (element.category) {
          loc.category = element.category;
        }
        if (element.names) {
          loc.names = element.names.slice();
        }
        if (element.si) {
          loc.si = element.si;
        }
        // TODO: Rewrite to reflect: default, plural, dual!
        loc.mappings = symbol ? {default: { default: ''}} :
        {default: { default: '', plural: '', dual: '' }};
        result.push(loc);
      }
      missing.push(element);
    }
  }
  return [result, missing];
};


/**
 * Finds the content element. Tries to take names into account.
 * @param {json} element From the model locale.
 * @param {json} locale The locale list.
 * @return {jons} The element in the locale, if found.
 */
SplitJson.findContent = function(element, locale) {
  let key = element['key'];
  let loc = locale[key];
  if (loc) {
    return loc;
  }
  if (element.names) {
    for (let name of element.names) {
      if (locale[name]) {
        return locale[name];
      }
    }
  }
  return null;
};


SplitJson.makePath = function(base, iso, kind) {
  let outputPath = `${base}/${iso}/${kind}/`;
  fs.mkdirSync(outputPath, {recursive: true});
  return outputPath;
};


/**
 * Splits a single locale mapping into the appropriate single files given by the
 * model (normally 'en').
 * @param {string} kind Type of json mapping (e.g., symbols).
 * @param {Array.<string>} files List of filenames.
 * @param {Object.<json>} locale The locale of json mappings.
 * @param {string} iso The iso code of the locale.
 * @param {string} model The iso code of the model locale (usually 'en').
 * @param {boolean} addempty Add non-existent elements as empty (in unit or function).
 */
SplitJson.splitFile = function(kind, files, locale, iso, model, addempty) {
  kind = kind === 'currency' ? 'units' : kind;
  let inputPath = `${SplitJson.PATH_}/${model}/${kind}/`;
  let outputPath = SplitJson.makePath(SplitJson.OUTPUT_PATH_, iso, kind);
  fs.mkdirSync(`${SplitJson.OUTPUT_PATH_}/${iso}-missing`, {recursive: true});
  files.forEach(function(x) {
    SplitJson.intoFile(inputPath + x, outputPath + x, locale, iso,
                       addempty,
                       kind === 'symbols' ? null :
                       `${SplitJson.OUTPUT_PATH_}/${iso}-missing`);
  });
};


// Splits all files of a particular kind for a given iso locale.
SplitJson.splitFiles = function(kind, iso, model, addempty) {
  let files = SplitJson.FILES_MAP_.get(kind);
  let locale = SplitJson.loadLocale(
    [`${kind}.json`], `${SplitJson.INPUT_PATH_}/${iso}/`);
  SplitJson.splitFile(kind, files, locale, iso, model, addempty);
  let values = [];
  for(var key in locale) {
    values.push(locale[key]);
  }
  // Here we do the unused ones.
  fs.mkdirSync(`${SplitJson.OUTPUT_PATH_}/${iso}-rest`, {recursive: true});
  fs.writeFileSync(`${SplitJson.OUTPUT_PATH_}/${iso}-rest/${kind}.json`,
                   JSON.stringify(values, null, 2));
};


/**
 * Generates empty files for a new locale from scratch.
 * @param iso The iso of the locale.
 */
SplitJson.generateFiles = function(iso) {
  let base = JSON.stringify([{"locale": iso}], null, 2);
  fs.mkdirSync(`${SplitJson.INPUT_PATH_}/${iso}`, {recursive: true});
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.SYMBOLS_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.FUNCTIONS_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.UNITS_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.CURRENCY_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.PREFIX_}.json`, base);
  SplitJson.allFiles(iso, true);
};


SplitJson.generateRules = function(iso, domain, name, inherits = 'base') {
  let def = {locale: iso, domain: domain, modality: 'speech', rules: []};
  let actions = Object.assign({kind: 'actions'}, def);
  let base = Object.assign({inherits: inherits}, def);
  fs.writeFileSync(`${SplitJson.PATH_}/${iso}/rules/${domain}_${name}.json`, JSON.stringify(base, null, 2));
  fs.writeFileSync(`${SplitJson.PATH_}/${iso}/rules/${domain}_${name}_actions.json`, JSON.stringify(actions, null, 2));
};


SplitJson.allFiles = function(iso, force = false) {
  fs.writeFileSync(`${SplitJson.OUTPUT_PATH_}/${iso}-missing.csv`, '');
  SplitJson.splitFiles(SplitJson.SYMBOLS_, iso, 'en', force);
  SplitJson.splitFiles(SplitJson.FUNCTIONS_, iso, 'en', true);
  SplitJson.splitFiles(SplitJson.UNITS_, iso, 'en', true);
  SplitJson.splitFiles(SplitJson.CURRENCY_, iso, 'en', true);
  SplitJson.rewritePrefix(iso);
};


SplitJson.rewritePrefix = function(iso) {
  let locale = SplitJson.loadLocale(
    ['prefix.json'], `${SplitJson.INPUT_PATH_}/${iso}/`);
  let result = [];
  for (let key of Object.keys(locale)) {
    if (!key || !locale[key].key) continue;
    let mappings = locale[key].mappings;
    let map = {};
    map[key] = mappings.default.default;
    result.push(map);
    if (key === 'µ') {
      result.push({'μ': mappings.default.default});
    }
  }
  fs.mkdirSync(`${SplitJson.OUTPUT_PATH_}/${iso}/si`, {recursive: true});
  fs.writeFileSync(`${SplitJson.OUTPUT_PATH_}/${iso}/si/prefixes.json`,
                   JSON.stringify(result, null, 2));
};


SplitJson.getFromMapping = function(mappings) {
  return (mappings.mathspeak && mappings.mathspeak.default) ?
    mappings.mathspeak.default :
    (mappings.clearspeak ? Object.values(mappings.clearspeak)[0] :
     (mappings.default ? mappings.default.default :
      Object.values(mappings.default)[0]));
};

SplitJson.localeToTable = function(content, kind) {
  let table = [];
  let header = kind === SplitJson.UNITS_ ?
      SplitJson.HTML_CAPTIONS_.get('unitsen') :
      SplitJson.HTML_CAPTIONS_.get(kind).slice(0, -1);
  table.push(SplitJson.htmlRow(...header).replace(/td/g, 'th'));
  let keys = SplitJson.sortKeys(Object.keys(content));
  for (let key of keys) {
    let mappings = content[key].mappings;
    if (!mappings) {
      console.log('Missing: ' + key);
      continue;
    }
    // TODO: Sort this out for kind!
    let text = SplitJson.getFromMapping(mappings);
    let names = '';
    switch (kind) {
    case 'units':
      names = content[key].names.join(', ');
      let singular = mappings.default.singular || '';
      let dual = mappings.default.dual || '';
      table.push(SplitJson.htmlRow(key, names, text, singular, dual));
      break;
    case 'functions':
      names = content[key].names.join(', ');
      table.push(SplitJson.htmlRow(key, names, text));
      break;
    default:
      table.push(SplitJson.htmlRow(`&#x${key};`, key, text));
    }
  }
  return table;
};

SplitJson.htmlRow = function(...row) {
  return '<tr><td>' + row.join('</td><td>') + '</td></tr';
};


/**
 * @type {Map.<string, string[]>} Maps the type of symbol files into HTML
 *     columns.
 */
SplitJson.HTML_CAPTIONS_ = new Map([
  [SplitJson.SYMBOLS_, ['Char', 'Unicode', SplitJson.REF_LANGUAGE, 'Locale']],
  [SplitJson.FUNCTIONS_, ['Function', 'Alt. Names', SplitJson.REF_LANGUAGE, 'Locale']],
  [SplitJson.UNITS_, ['Unit', 'Alt. Names', SplitJson.REF_LANGUAGE, 'Plural', 'Singular', 'Dual']],
  [SplitJson.CURRENCY_, ['Unit', 'Alt. Names', SplitJson.REF_LANGUAGE, 'Plural', 'Singular', 'Dual']],
  ['unitsen', ['Unit', 'Alt. Names', 'Plural', 'Singular', 'Dual']]
]);

SplitJson.compareLocaleToTable = function(english, locale, kind) {
  let table = [];
  table.push(SplitJson.htmlRow(...SplitJson.HTML_CAPTIONS_.get(kind)).replace(/td/g, 'th'));
  let keys = SplitJson.sortKeys(Object.keys(english));
  for (let key of keys) {
    let mappings = english[key].mappings;
    if (!mappings) {
      console.log('Missing: ' + key);
      continue;
    }
    let eng_text = SplitJson.getFromMapping(mappings);
    let loc_map = SplitJson.findContent(english[key], locale);
    let loc_text = '';
    if (loc_map) {
      loc_map = loc_map.mappings;
      loc_text = SplitJson.getFromMapping(loc_map);
    }
    let names = '';
    switch (kind) {
    case 'units':
      names = english[key].names.join(', ');
      let singular = loc_map ? loc_map.default.singular : '';
      let dual = loc_map ? loc_map.default.dual : '';
      table.push(SplitJson.htmlRow(key, names, eng_text, loc_text, singular, dual));
      break;
    case 'functions':
      names = english[key].names.join(', ');
      table.push(SplitJson.htmlRow(key, names, eng_text, loc_text));
      break;
    default:
      table.push(SplitJson.htmlRow(`&#x${key};`, key, eng_text, loc_text));
    }
  }
  return table;
};

SplitJson.tableToHTML = function(file, table, path = '/tmp/') {
  let filename = path + file + '.html';
  let style = '\n<style>\n' +
      'table, th, td {\n' +
      '  border: 1px solid black;' +
      '}\n</style>\n';
  let output = '<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">';
  output += '\n<html><head>';
  output += '\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>';
  output += '\n<title>' + file + '</title>\n';
  output += style;
  output += '\n<body>';
  output += '\n<h2>' + file + '</h2>';
  output += '\n<table>\n';
  output += table.join('\n');
  output += '</body></html>';
  fs.writeFileSync(filename, output);
};

SplitJson.localeToHTML = function(locale = 'en',
                                  kind = SplitJson.SYMBOLS_,
                                  compare = true) {
  let fileList = SplitJson.FILES_MAP_.get(kind);
  let files = [];
  let localeContent = null;
  let path = SplitJson.makePath(SplitJson.HTML_PATH_, locale, kind);
  for (let file of fileList) {
    console.log(file);
    let content = SplitJson.loadLocale([file], `${SplitJson.PATH_}/${locale}/${kind === 'currency' ? 'units' : kind}/`);
    if (compare) {
      localeContent = SplitJson.loadLocale([file], `${SplitJson.PATH_}/${SplitJson.REF_ISO}/${kind === 'currency' ? 'units' : kind}/`);
    }
    let name = file.split('.')[0];
    files.push(name);
    let table = compare ?
        SplitJson.compareLocaleToTable(localeContent, content, kind) :
        SplitJson.localeToTable(content, kind);
    SplitJson.tableToHTML(name, table, path);
  }
  let index = `<html><head><title>${kind}</title></head>`;
  index += '\n<body><ul>';
  for (let file of files) {
    index += '\n<li><a href="' + file + '.html">'  + file + '</a></li>';
  }
  index += '\n</ul></body></html>';
  fs.writeFileSync(`${path}/index.html`, index);
};


SplitJson.toHTML = function(iso = 'en', compare = true) {
  SplitJson.localeToHTML(iso, SplitJson.SYMBOLS_, compare);
  SplitJson.localeToHTML(iso, SplitJson.FUNCTIONS_, compare);
  SplitJson.localeToHTML(iso, SplitJson.UNITS_, compare);
  SplitJson.localeToHTML(iso, SplitJson.CURRENCY_, compare);
  // SplitJson.localeToHTML(iso, SplitJson.PREFIX_, compare);
};

/************************************************************
/*   Create ods files directly 
/*********************************************/


SplitJson.toOds = function(iso = 'en') {
  shell.cp('-R', SplitJson.ODS_TEMPLATE_, '/tmp/');
  SplitJson.odsCreate(iso, SplitJson.SYMBOLS_);
  SplitJson.odsCreate(iso, SplitJson.FUNCTIONS_);
  SplitJson.odsCreate(iso, SplitJson.UNITS_);
  SplitJson.odsCreate(iso, SplitJson.CURRENCY_);
  // SplitJson.localeToHTML(iso, SplitJson.PREFIX_, compare);
};

SplitJson.odsCreate = function(iso, kind) {
  SplitJson.localeToOds(iso, SplitJson.TEMPLATE_PATH_, kind);
  let outputPath = `${SplitJson.ODS_PATH_}/${iso}/`;
  shell.mkdir('-p', outputPath);
  let file = `${kind}-${iso}.ods`;
  shell.cd(SplitJson.TEMPLATE_PATH_);
  shell.exec(`zip -r ../${file} .`);
  shell.mv(`/tmp/${file}`, outputPath);
};


SplitJson.localeToOds = function(locale = 'en',
                                 path = '/tmp/ods',
                                 kind = SplitJson.SYMBOLS_) {
  let tables = [];
  let fileList = SplitJson.FILES_MAP_.get(kind);
  kind = kind === 'currency' ? 'units' : kind;
  for (let file of fileList) {
    let content = SplitJson.loadLocale([file], `${SplitJson.PATH_}/${locale}/${kind}/`);
    let english = SplitJson.loadLocale([file], `${SplitJson.PATH_}/${SplitJson.REF_ISO}/${kind}/`);
    let name = file.split('.')[0];
    tables.push(SplitJson.odsTable(name, english, content, kind));
  }
  SplitJson.odsFile(tables.join(''), path);
};


SplitJson.odsRow = function(...row) {
  let cellStart = '<table:table-cell office:value-type="string" calcext:value-type="string"><text:p>';
  let cellEnd = '</text:p></table:table-cell>';
  return '<table:table-row table:style-name="ro1">' +
    cellStart +
    row.join(cellEnd + cellStart) +
    cellEnd +
    '</table:table-row>';
};


SplitJson.odsTable = function(name, english, locale, kind) {
  let start = `<table:table table:name="${name}" table:style-name="ta1">` +
      '<table:table-column table:style-name="co1"' +
      ' table:number-columns-repeated="3"' +
      ' table:default-cell-style-name="Default"/>';
  start += SplitJson.odsRow(...SplitJson.HTML_CAPTIONS_.get(kind))
    .replace('Locale', SplitJson.TARGET_LANGUAGE)
    .replace(/table-cell\ /g, 'table-cell table:style-name="ce1" ');
  let secure = {
    '003C': '&lt;',
    '003E': '&gt;',
    '0026': '&amp;'
  };
  let table = [];
  for (let key in english) {
    let mappings = english[key].mappings;
    if (!mappings) {
      console.log('Missing: ' + key);
      continue;
    }
    // Not sure what that does.
    let eng_text = SplitJson.getFromMapping(mappings);
    let loc_map = SplitJson.findContent(english[key], locale);
    let loc_text = '';
    if (loc_map) {
      loc_map = loc_map.mappings;
      loc_text = SplitJson.getFromMapping(loc_map);
    }
    let names = '';
    let row = '';
    switch (kind) {
    case 'units':
      names = english[key].names.join(', ');
      let singular = loc_map ? loc_map.default.singular : '';
      let dual = loc_map ? loc_map.default.dual : '';
      table.push(SplitJson.odsRow(key, names, eng_text, loc_text, singular, dual));
      break;
    case 'functions':
      names = english[key].names.join(', ');
      table.push(SplitJson.odsRow(key, names, eng_text, loc_text));
      break;
    default:
      table.push(SplitJson.odsRow(
        secure[key] || SplitJson.numberToUnicode(parseInt(key, 16)),
        key, eng_text, loc_text));
    }
  }
  return start + table.join('') + '</table:table>';
};

SplitJson.odsFile = function(table, path = '/tmp/ods') {
  let content = '<?xml version="1.0" encoding="UTF-8"?>\n';
  content += '<office:document-content' +
    ' xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0"' +
    ' xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0"' +
    ' xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0"' +
    ' xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0"' +
    ' xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0"' +
    ' xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0"' +
    ' xmlns:xlink="http://www.w3.org/1999/xlink"' +
    ' xmlns:dc="http://purl.org/dc/elements/1.1/"' +
    ' xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0"' +
    ' xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0"' +
    ' xmlns:presentation="urn:oasis:names:tc:opendocument:xmlns:presentation:1.0"' +
    ' xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0"' +
    ' xmlns:chart="urn:oasis:names:tc:opendocument:xmlns:chart:1.0"' +
    ' xmlns:dr3d="urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0"' +
    ' xmlns:math="http://www.w3.org/1998/Math/MathML"' +
    ' xmlns:form="urn:oasis:names:tc:opendocument:xmlns:form:1.0"' +
    ' xmlns:script="urn:oasis:names:tc:opendocument:xmlns:script:1.0"' +
    ' xmlns:ooo="http://openoffice.org/2004/office"' +
    ' xmlns:ooow="http://openoffice.org/2004/writer"' +
    ' xmlns:oooc="http://openoffice.org/2004/calc"' +
    ' xmlns:dom="http://www.w3.org/2001/xml-events"' +
    ' xmlns:xforms="http://www.w3.org/2002/xforms"' +
    ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
    ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
    ' xmlns:rpt="http://openoffice.org/2005/report"' +
    ' xmlns:of="urn:oasis:names:tc:opendocument:xmlns:of:1.2"' +
    ' xmlns:xhtml="http://www.w3.org/1999/xhtml"' +
    ' xmlns:grddl="http://www.w3.org/2003/g/data-view#"' +
    ' xmlns:tableooo="http://openoffice.org/2009/table"' +
    ' xmlns:drawooo="http://openoffice.org/2010/draw"' +
    ' xmlns:calcext="urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0"' +
    ' xmlns:loext="urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0"' +
    ' xmlns:field="urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0"' +
    ' xmlns:formx="urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0"' +
    ' xmlns:css3t="http://www.w3.org/TR/css3-text/"' +
    ' office:version="1.2"><office:scripts/><office:font-face-decls>' +
    '<style:font-face style:name="Liberation Sans"' +
    ' svg:font-family="&apos;Liberation Sans&apos;"' +
    ' style:font-family-generic="swiss" style:font-pitch="variable"/>' +
    '<style:font-face style:name="AR PL SungtiL GB"' +
    ' svg:font-family="&apos;AR PL SungtiL GB&apos;"' +
    ' style:font-family-generic="system" style:font-pitch="variable"/>' +
    '<style:font-face style:name="DejaVu Sans"' +
    ' svg:font-family="&apos;DejaVu Sans&apos;"' +
    ' style:font-family-generic="system" style:font-pitch="variable"/>' +
    '<style:font-face style:name="Lohit Devanagari"' +
    ' svg:font-family="&apos;Lohit Devanagari&apos;"' +
    ' style:font-family-generic="system" style:font-pitch="variable"/>' +
    '</office:font-face-decls><office:automatic-styles><style:style' +
    ' style:name="co1" style:family="table-column">' +
    '<style:table-column-properties fo:break-before="auto"' +
    ' style:column-width="64.01pt"/></style:style><style:style' +
    ' style:name="co2" style:family="table-column">' +
    '<style:table-column-properties fo:break-before="auto"' +
    ' style:column-width="299.51pt"/></style:style><style:style' +
    ' style:name="co3" style:family="table-column">' +
    '<style:table-column-properties fo:break-before="auto"' +
    ' style:column-width="341.94pt"/></style:style><style:style' +
    ' style:name="co4" style:family="table-column">' +
    '<style:table-column-properties fo:break-before="auto"' +
    ' style:column-width="279.41pt"/></style:style><style:style' +
    ' style:name="ro1" style:family="table-row"><style:table-row-properties' +
    ' style:row-height="12.81pt" fo:break-before="auto"' +
    ' style:use-optimal-row-height="true"/></style:style><style:style' +
    ' style:name="ta1" style:family="table"' +
    ' style:master-page-name="Default"><style:table-properties' +
    ' table:display="true" style:writing-mode="lr-tb"/>' +
    '</style:style>' +
    '<style:style style:name="ce1" style:family="table-cell" style:parent-style-name="Default">' +
    '<style:text-properties fo:font-weight="bold" style:font-weight-asian="bold" style:font-weight-complex="bold"/>' +
    '</style:style>' +
    '</office:automatic-styles><office:body><office:spreadsheet>' +
    '<table:calculation-settings table:automatic-find-labels="false"' +
    ' table:use-regular-expressions="false" table:use-wildcards="true"/>';
  content += table;
  content += '<table:named-expressions/></office:spreadsheet></office:body>' +
    '</office:document-content>';
  fs.writeFileSync(`${path}/content.xml`, content);
};


SplitJson.numberToUnicode = function(number) {
  if (number < 0x10000) {
    return String.fromCharCode(number);
  }
  var hi = (number - 0x10000) / 0x0400 + 0xD800;
  var lo = (number - 0x10000) % 0x0400 + 0xDC00;
  return String.fromCharCode(hi, lo);
};


SplitJson.moveFiles = function(locale) {
  let wwwLocale = SplitJson.WWW_BASE_PATH + '/localisation/' + locale + '/';
  shell.mkdir('-p', wwwLocale + 'sheets/');
  shell.cp('-f', SplitJson.ODS_PATH_ + '/' + locale + '/*.ods', wwwLocale + 'sheets/');
  shell.cp('-Rf', SplitJson.HTML_PATH_ + '/' + locale + '/*', wwwLocale);
};


SplitJson.compareKeys_ = function(x, y) {
  let xn = parseInt(x, 16);
  let yn = parseInt(y, 16);
  if (isNaN(xn)) {
    return 1;
  }
  if (isNaN(yn)) {
    return -1;
  }
  if (xn < yn) {
    return -1;
  }
  if (xn > yn) {
    return 1;
  }
  return 0;
};


/**
 * Sort keys wrt. hex codes.
 * @param {Array.<string>} keys The keys.
 * @return {Array.<string>} The sorted keys.
 */
SplitJson.sortKeys = function(keys) {
  return keys.sort(SplitJson.compareKeys_);
};


/**
 * Removes the undefined key from the locale (this is usually the )
 * @param {Object.<json>} locale The mapping.
 * @return {Object.<json>} The cleaned locale.
 */
SplitJson.cleanLocale = function(locale) {
  delete locale[undefined];
  return locale;
};

SplitJson.compareKeys = function(loc1, loc2) {
  SplitJson.cleanLocale(loc1);
  SplitJson.cleanLocale(loc2);
  let keys1 = SplitJson.sortKeys(Object.keys(loc1));
  let keys2 = SplitJson.sortKeys(Object.keys(loc2));
  let only1 = [];
  let only2 = [];
  while (keys1.length && keys2.length) {
    let key1 = keys1.shift();
    let key2 = keys2.shift();
    switch (SplitJson.compareKeys_(key1, key2)) {
    case 0: continue;
    case -1:
      only1.push(key1);
      keys2.unshift(key2);
      break;
    case 1:
      only2.push(key2);
      keys1.unshift(key1);
      break;
    }
  }
  if (keys1.length) {
    only1 = only1.concat(keys1);
  } else {
    only2 = only2.concat(keys2);
  }
  return [only1, only2];
};


/**
 * Gets all default mappings from Json elements.
 * @param {Array.<json>} json A json list.
 * @return {Array.<string>} A list of string for the default.default mapping.
 */
SplitJson.getDefaultDefault = function(json) {
  let result = [];
  for (let obj of json) {
    if (!obj.mappings || !obj.mappings.default ||
        !obj.mappings.default.default) continue;
    result.push(obj.mappings.default.default);
  }
  return result;
};



/**
 *  
 * Handling and looking up unicode characters in the localised Unicode Tables.
 *
 */
SplitJson.UNICODE_MAPPINGS = {};

SplitJson.loadUnicodeFile = function(file, dir, iso) {
  file = dir ? `${dir}/${file}` : file;
  let content = fs.readFileSync(`${SplitJson.UNICODE_PATH}/${iso}/symbols/${file}`, 'utf8');
  let lines = content.split('\n');
  let result = {};
  for (let line of lines) {
    if (!line.length) continue;
    let [key, str, ...rest] = line.split(':');
    if (rest.length) {
      str = [str, ...rest].join(': ');
    }
    str = str.trim();
    if (str) {
      str = str[0].toLowerCase() + str.substring(1); 
    }
    result[key.trim()] = str;
  }
  return result;
};


SplitJson.baseFileName = function(hex) {
  let base = hex.slice(0, -2) + '00';
  let dir = (base.length > 4) ? 'plane' + base[0] : '';
  return [base, dir];
};


SplitJson.getUnicodeString = function(hex, iso = 'en') {
  let [base, dir] = SplitJson.baseFileName(hex);
  let mapping = SplitJson.UNICODE_MAPPINGS[base];
  if (mapping) {
    return mapping[hex];
  }
  try {
    mapping = SplitJson.loadUnicodeFile(base + '.txt', dir, iso);
    SplitJson.UNICODE_MAPPINGS[base] = mapping;
    return mapping[hex];
  } catch (e) {
    return '';
  }
};

SplitJson.lookupMissingUnicode = function(list, ref, iso) {
  SplitJson.UNICODE_MAPPINGS = {};
  let result = {};
  for (let code of list) {
    result[code] = {
      category: ref[code].category,
      key: code,
      mappings: {default: {default: SplitJson.getUnicodeString(code, iso)}}
    };
  }
  return result;
};


SplitJson.cleanCurrency = function(locale, name = true) {
  let keys = Object.keys(locale);
  let result = [];
  for (let key of keys) {
    let rest = locale[key];
    result.push(rest);
    if (typeof key === 'undefined') continue;
    if (name) {
      rest.names = [rest.key];
    }
  }
  return result;
};


SplitJson.initialCurrency = function(iso) {
  let locale = SplitJson.loadLocale( ['currency.json'], `${SplitJson.INPUT_PATH_}/${iso}/`);
  let result = SplitJson.cleanCurrency(locale, true);
  fs.writeFileSync(`${SplitJson.PATH_}/${iso}/units/currency.json`,
                   JSON.stringify(result, null, 2));
};

/**
 * Completes a locale from the unicode mappings.
 * @param {string} iso The locale.
 */
SplitJson.completeLocale = function(iso) {
  let locale = SplitJson.loadLocale(SplitJson.SYMBOLS_FILES_, `${SplitJson.PATH_}/${iso}/symbols/`);
  let english = SplitJson.loadLocale(SplitJson.SYMBOLS_FILES_, `${SplitJson.PATH_}/${SplitJson.REF_ISO}/symbols/`);
  let [left, right] = SplitJson.compareKeys(english, locale);
  if (right.length) {
    console.log('Warning: There are superfluous symbols in locale: ' + iso);
  }
  console.log(Object.keys(locale).length);
  console.log(Object.keys(english).length);
  let addition = SplitJson.lookupMissingUnicode(left, english, iso);
  console.log(Object.keys(addition).length);
  Object.assign(locale, addition);
  console.log(Object.keys(locale).length);
  SplitJson.splitFile(SplitJson.SYMBOLS_, SplitJson.FILES_MAP_.get(SplitJson.SYMBOLS_),
                      locale, iso, 'en');
  SplitJson.splitFile(SplitJson.SYMBOLS_, SplitJson.FILES_MAP_.get(SplitJson.SYMBOLS_),
                      addition, iso + '-new', 'en');
};


// SplitJson.defaultFiles = function() {
//   SplitJson.allFiles(SplitJson.SYMBOLS_FILES_, SplitJson.FUNCTIONS_FILES_)
// };

module.exports = SplitJson;

// SplitJson.splitFiles(SplitJson.SYMBOLS_PATH_,
//                       SplitJson.SYMBOLS_FILES_, french, 'fr', 'symbols');
// where french contained the locale.

// Combine and minimise json!
// jq -c -s add *.js


/**
 * 
 * Processing CSV to fill locale files.
 * 
 */

// For the following we need `npm install csv-parser`
const csv = require('csv-parser');

SplitJson.CSV_PATH_ = SplitJson.L10N_PATH_ + '/locales';

SplitJson.fromCsv = function (input, output, type, lname) {
  let oldJson = JSON.parse(fs.readFileSync(output, 'utf8'));
  let oldLocale = SplitJson.loadLocale([output]);
  return new Promise((resolve, reject) => {
    console.log(input);
    fs.createReadStream(input)
      .pipe(csv())
      .on('data', (row) => {
        SplitJson.csvPicker(type, oldLocale, row, lname, input);
      })
      .on('end', () => {
        for (let oldElement of oldJson) {
          let key = oldElement.key;
          if (!key) continue;
          let newElement = oldLocale[key];
          if (!newElement) {
            console.log('Element for unicode not found: ' + key);
            continue;
          }
          Object.assign(oldElement.mappings, newElement.mappings);
        }
        resolve(oldJson);
    });
  }).then(() => {
    fs.writeFileSync(output, JSON.stringify(oldJson, null, 2) + '\n', 'utf8');
  });
};


SplitJson.LOCALE_COLUMN_ = new Map([
  [SplitJson.SYMBOLS_, 'Unicode'],
  [SplitJson.FUNCTIONS_, 'Function'],
  [SplitJson.UNITS_, 'Unit'],
  [SplitJson.CURRENCY_, 'Unit']
]);


// For hindi at the moment
SplitJson.CLEAN_ENTRY = function(x) {
  return x.replace(/:.*$/, '').trim();
  // return x;
};



/**
 * Picks a value from a CSV row and sets it in the given locale structure.
 * This methods is implemented for symbols.
 * @param {string} type The type of elements to pick.
 * @param {Object} locale The locale object.
 * @param {Object} row The csv row.
 * @param {string} lname The locale name.
 * @param {string} input Current input file.
 */
SplitJson.csvPicker = function(type, locale, row, lname, input) {
  let keyCol = SplitJson.LOCALE_COLUMN_.get(type);
  let key = row[keyCol];
  let element = locale[key];
  if (!element) {
    console.log(`Element for ${keyCol} not found: ${key}`);
    return;
  }
  if (type === SplitJson.UNITS_ || type === SplitJson.CURRENCY_) {
    SplitJson.pickUnitFromCsv(element, row, key, input); 
  } else {
    SplitJson.pickSymbolFromCsv(element, row, lname, key, input); 
  }
};


/**
 * 
 * @param {}
 * @return {}
 */
SplitJson.pickUnitFromCsv = function(element, row, key, input) {
  console.log(0);
  if (!element.mappings.default) {
    console.log(`Inspect element ${key} manually in ${input}`);
    return;
  }
  element.mappings.default.default = row['Singular'];
  element.mappings.default.plural = row['Plural'];
  element.mappings.default.dual = row['Dual'];
};


/**
 * 
 * @param {}
 * @return {}
 */
SplitJson.pickSymbolFromCsv = function(element, row, localeCol, key, input) {
  if (!element.mappings.default || typeof element.mappings.default.default === 'undefined') {
    console.log(`Inspect element ${key} manually in ${input}`);
    return;
  }
  element.mappings.default.default = SplitJson.CLEAN_ENTRY(row[localeCol]);
};


/**
 * Update the locale files for a particular,
 * @param {string} locale Locale name.
 * @param {string} type Element type.
 * @param {string} csvPath Path of the csv files.
 * @param {string=} lname The locale name of the row. Defaults to `Locale`.
 */
SplitJson.elementsFromCsv = function(locale, type, csvPath, lname = "Locale") {
  let inPath = `${SplitJson.PATH_}/${locale}/${type === 'currency' ? 'units' : type}/`;
  let files = SplitJson.FILES_MAP_.get(type);
  files.reduce(
    (promise, file) => {
      let input = csvPath + path.basename(file, '.json') + '.csv';
      return promise.then(() => SplitJson.fromCsv(input, inPath + file, type, lname));
    },
    new Promise(r => r())
  );
};

// SplitJson.elementsFromCsv('it', SplitJson.SYMBOLS_, '/home/sorge/git/sre/sre-resources/l10n/it/stefano/csv-symbols/', 'Italian');

/*************************************************************************/

/**
 * Pulls all unicode messages and cleans up for a locale.
 * @param {string} csv The csv input directory, relative to `SplitJson.CSV_PATH_`.
 * @param {string} iso The locale's iso designation.
 * @param {string} locale The locale name. This is used for messages etc.
 * @param {string=} src The source locale name. This is used for picking the
 *      original messages. It defaults to English.
 */
SplitJson.getUnicodeJSON = async function(csv, iso, locale, src = SplitJson.REF_LANGUAGE) {
  csv = path.join(SplitJson.CSV_PATH_, csv);
  SplitJson.elementsFromCsv(iso, SplitJson.SYMBOLS_, csv, locale);
  SplitJson.elementsFromCsv(iso, SplitJson.FUNCTIONS_, csv, locale);
  SplitJson.elementsFromCsv(iso, SplitJson.UNITS_, csv, locale);
  SplitJson.elementsFromCsv(iso, SplitJson.CURRENCY_, csv, locale);
  SplitJson.transformLocaleFiles(SplitJson.UNITS_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.removeDual);
  SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.removeDual);
  SplitJson.transformLocaleFiles(SplitJson.FUNCTIONS_, `${SplitJson.PATH_}/${iso}/functions/`, SplitJson.removeDual);

  // SplitJson.transformLocaleFiles(SplitJson.UNITS_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.removeSingular);
  // SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.removeSingular);
  // SplitJson.transformLocaleFiles(SplitJson.FUNCTIONS_, `${SplitJson.PATH_}/${iso}/functions/`, SplitJson.removeSingular);

  SplitJson.transformLocaleFiles(SplitJson.UNITS_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.removePlural);
  SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.removePlural);
  SplitJson.transformLocaleFiles(SplitJson.FUNCTIONS_, `${SplitJson.PATH_}/${iso}/functions/`, SplitJson.removePlural);

  // SplitJson.transformLocaleFiles(SplitJson.UNITS_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.swapSingularForPlural);
  // SplitJson.transformLocaleFiles(SplitJson.CURRENCY_, `${SplitJson.PATH_}/${iso}/units/`, SplitJson.swapSingularForPlural);
};


/*************************************************************************/


/**
 *  
 * Transforming locale files by  removing empty elements and potentially
 * swapping fields, e.g., singular to plural.
 *
 */

SplitJson.loadLocaleFileToList = function(file, path) {
  path = path || '';
  let content = fs.readFileSync(path + file);
  return content ? JSON.parse(content) : [];
};

SplitJson.transformLocaleFiles = function(type, path, method, outPath = path) {
  let files = SplitJson.FILES_MAP_.get(type);
  for (let file of files) {
    SplitJson.transformLocaleFile(file, path, method, outPath);
  }
};

SplitJson.transformLocaleFile = function(file, path, method, outPath = path) {
  let content = SplitJson.loadLocaleFileToList(file, path);
  let result = content.map(x => method(x));
  fs.writeFileSync(`${outPath}/${file}`, JSON.stringify(result, null, 2));
};

SplitJson.swapSingularForPlural = function(json) {
  if (!json.mappings || !json.mappings.default ||
      !json.mappings.default.default || !json.mappings.default.singular) {
    console.log(0);
    return json;
  }
  console.log(1);
  json.mappings.default.plural = json.mappings.default.default;
  json.mappings.default.default = json.mappings.default.singular;
  delete json.mappings.default.singular;
  return json;
};


SplitJson.removeDual = function(json) {
  return SplitJson.removeCell(json, 'dual');
};

SplitJson.removeSingular = function(json) {
  return SplitJson.removeCell(json, 'singular');
};

SplitJson.removePlural = function(json) {
  return SplitJson.removeCell(json, 'plural');
};

SplitJson.removeCell = function(json, cell) {
  if (!json.mappings || !json.mappings.default || json.mappings.default[cell]) {
    return json;
  }
  delete json.mappings.default[cell];
  return json;
};


/**
 * 
 * Transforming CSV files into lists for locale messages.
 *
 */
SplitJson.getCsvMapping = async function(file) {
  let mapping = [];
  let promise = new Promise((resolve, reject) => {
    fs.createReadStream(file)
      .pipe(csv())
      .on('data', (row) => {
        mapping.push(row);
      })
      .on('end', () => {
        resolve(mapping);
    });
  });
  return await promise;
};

SplitJson.getAssocList = async function(file, domain = SplitJson.REF_LANGUAGE,
                                        locale = 'Locale', english = SplitJson.REF_LANGUAGE) {
  file = SplitJson.CSV_PATH_ + '/' + file;
  let rows = await SplitJson.getCsvMapping(file);
  let mapping = {};
  for (let row of rows) {
    let key = row[domain];
    if (!key) continue;
    let value = row[locale] || row[english];
    mapping[key] = value;
  }
  return mapping;
};


SplitJson.writeAssocList = async function(file, out, domain = SplitJson.REF_LANGUAGE,
                                          locale = 'Locale', english = SplitJson.REF_LANGUAGE) {
  let mapping = await SplitJson.getAssocList(file, domain, locale, english);
  fs.writeFileSync(out, JSON.stringify(mapping, null, 2));
};


// csv directory, output directory for the message file, the locale iso, the locale name
SplitJson.getMessagesJSON = async function(csv, out, iso, locale, src = SplitJson.REF_LANGUAGE) {
  let msg = {};
  let json = {kind: 'messages', locale: iso, messages: msg};
  msg.MS = await SplitJson.getAssocList(csv + 'Mathspeak\ disambiguation.csv', 'Proc Message', locale, src);
  msg.MSroots = {};
  msg.font = await  SplitJson.getAssocList(
    csv + 'Fonts.csv', `Font Name ${src}`, 'Font Name ' + locale, `Font Name ${src}`);
  msg.embellish = await  SplitJson.getAssocList(
    csv + 'Embellished\ Characters.csv', 'Unicode Embellishment Name',
    'Embellishment Name ' + locale, `Embellishment Name ${src}`);
  msg.role = await SplitJson.getAssocList(csv + 'Roles.csv', 'Role', locale, src);
  msg.enclose = await SplitJson.getAssocList(csv + 'Enclose.csv', 'Enclose Type', locale, src);
  msg.navigate = await SplitJson.getAssocList(csv + 'Navigation.csv', src, locale, src);
  msg.regexp = {
      'TEXT': 'a-zA-Z',
      'NUMBER': '((\\d{1,3})(?=(.| ))((.| )\\d{3})*(\\,\\d+)?)|^\\d*\\,\\d+|^\\d+',
      'DECIMAL_MARK': ',',
      'DIGIT_GROUP': '\\.',
      'JOINER_SUBSUPER': ' ',
      'JOINER_FRAC': ' '
  };
  msg.unitTimes = '';
  fs.writeFileSync(out + 'messages.json', JSON.stringify(json, null, 2));
};


SplitJson.getAlphaJSON = async function(csv, out, iso, locale) {
  let [small, cap, spre, cpre] = await SplitJson.processLatin(csv, locale);
  let [gsmall, gcap] = await SplitJson.processGreek(csv, locale);
  let json = {kind: 'alphabets', locale: iso};
  let msg = {};
  json.messages = msg;
  msg.latinSmall = small;
  msg.latinCap = cap;
  msg.greekSmall = gsmall;
  msg.greekCap = gcap;
  console.log(cpre);
  console.log(spre);
  msg.capPrefix = {default: cpre};
  msg.smallPrefix = {default: spre};
  msg.digitPrefix = {default: ''};
  fs.writeFileSync(out + 'alphabets.json', JSON.stringify(json, null, 2));
};

SplitJson.latin = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'I', 'j', 'k',
  'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z'];

SplitJson.processLatin = async function(csv, locale) {
  let latin = await SplitJson.getAssocList(csv + 'Latin\ Alphabet.csv', 'Character', locale, 'Character');
  let small = [];
  let large = [];
  for (let char of SplitJson.latin) {
    let value = latin[char];
    small.push(value);
    large.push(value.match(/^[a-zA-Z]/) ?
               value[0].toUpperCase() + value.slice(1) : value);
  }
  return [small, large, latin['Small character'], latin['Large character']];
};

SplitJson.greekSmall = [
  '𝛻', '𝛼', '𝛽', '𝛾', '𝛿', '𝜀', '𝜁', '𝜂', '𝜃', '𝜄', '𝜅', '𝜆',
  '𝜇', '𝜈', '𝜉', '𝜊', '𝜋', '𝜌', '𝜍', '𝜎', '𝜏', '𝜐', '𝜑', '𝜒',
  '𝜓', '𝜔', '𝜕', '𝜖', '𝜗', '𝜘', '𝜙', '𝜚', '𝜛'
];

SplitJson.greekCaps = [
  '𝛼', '𝛽', '𝛾', '𝛿', '𝜀', '𝜁', '𝜂', '𝜃', '𝜄', '𝜅', '𝜆',
  '𝜇', '𝜈', '𝜉', '𝜊', '𝜋', '𝜌', '𝜍', '𝜎', '𝜏', '𝜐', '𝜑', '𝜒',
  '𝜓', '𝜔'
];

SplitJson.processGreek = async function(csv, locale) {
  let greek = await SplitJson.getAssocList(csv + 'Greek\ Alphabet.csv', 'Character', locale, 'Character');
  let small = [];
  for (let char of SplitJson.greekSmall) {
    small.push(greek[char]);
  }
  let large = [];
  for (let char of SplitJson.greekCaps) {
    let value = greek[char];
    large.push(value.match(/^[a-zA-Z]/) ?
               value[0].toUpperCase() + value.slice(1) : value);
  }
  return [small, large];
};


SplitJson.getNumbersJSON = async function(csv, out, iso, locale, src = SplitJson.REF_LANGUAGE) {
  let msg = {};
  let json = {kind: 'numbers', locale: iso, messages: msg};
  let numbers = await SplitJson.getAssocList(
    csv + 'Numbers.csv', 'Enumerator Value', 'Number ' + locale, `Number ${src}`);
  msg.zero = numbers[0] || '';
  SplitJson.addNewList(msg, numbers, 'ones', [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10',
    '11','12', '13', '14', '15', '16', '17', '18', '19'
  ]);
  SplitJson.addNewList(msg, numbers, 'tens', [
    '20', '30', '40', '50', '60', '70', '80', '90'
  ]);
  SplitJson.addNewList(msg, numbers, 'large', [
    '1000', '1000000', '1000000000', '10^12', '10^15', '10^18', '10^21',
    '10^24', '10^27', '10^30', '10^33'
  ]);
  msg.ones.unshift('');
  msg.tens.unshift('');
  msg.tens.unshift('');
  msg.large.unshift('');
  msg.vulgarSep = ' ';
  msg.numSep = '';
  SplitJson.addNewList(msg, numbers, 'hundreds', [
    '100', '200', '300', '400', '500', '600', '700', '800', '900'
  ]);
  SplitJson.addNewDict(msg, numbers, 'twenties', [
    '21', '22', '23', '24', '25', '26', '27', '28', '29',
  ]);
  SplitJson.addNewDict(msg, numbers, 'thirties', [
    '31', '32', '33', '34', '35', '36', '37', '38', '39',
  ]);
  msg.rest = numbers;
  fs.writeFileSync(out + 'numbers.json', JSON.stringify(json, null, 2));
};

SplitJson.addNewList = function(msg, numbers, name, list) {
  let result = [];
  for (let entry of list) {
    result.push(numbers[entry]);
    delete numbers[entry];
  }
  msg[name] = result;
};

SplitJson.addNewDict = function(msg, numbers, name, list) {
  let result = {};
  for (let entry of list) {
    result[entry] = numbers[entry];
    delete numbers[entry];
  }
  msg[name] = result;
};

// 
//

/**
 * 
 * Rewriting speech rule files from CSV file input.
 * (For this we need to load SRE with require.)
 */
let sre = require('/home/sorge/git/sre/speech-rule-engine/js/rule_engine/speech_rule');

SplitJson.getTextString = function(text) {
  if (text.match(/^\".*\"$/)) {
    return text.slice(1, text.length - 1);
  }
  return null;
};


SplitJson.rewriteSpeechRuleAction = function(actionStr, mapping) {
  let action = sre.Action.fromString(actionStr);
  let components = action.components;
  for (let action of components) {
    if (action.type === 'TEXT') {
      let text = SplitJson.getTextString(action.content);
      if (text) {
        if (mapping[text]) {
          action.content = `"${mapping[text]}"`;
        } else {
          console.log('Missing mapping for: ' + text);
        }
      }
    }
  }
  return action.toString();
};


SplitJson.rewriteSpeechRuleFile = async function(json, csv, locale, src) {
  let english = JSON.parse(fs.readFileSync(json));
  let mapping = await SplitJson.getAssocList(csv, src, locale, src);
  let newRules = [];
  for (let rule of english.rules) {
    let type = rule[0];
    if (type === 'Action') {
      rule[2] = SplitJson.rewriteSpeechRuleAction(rule[2], mapping);
    }
    newRules.push(rule);
  }
  english.rules = newRules;
  fs.writeFileSync(json, JSON.stringify(english, null, 2));
};


SplitJson.rewriteSpeechRulesLocale = function(iso, locale, csv, src = SplitJson.REF_LANGUAGE) {
  let outPath = SplitJson.PATH_ + '/' + iso + '/rules';
  let input = locale.toLowerCase();
  SplitJson.rewriteSpeechRuleFile(outPath + `/mathspeak_${input}_actions.json`, 
                                  csv + 'Mathspeak\ Messages.csv', locale,
                                  `${src} Speech Rule`);
  if (fs.existsSync(csv + 'Clearspeak\ Messages.csv')) {
    SplitJson.rewriteSpeechRuleFile(outPath + `/clearspeak_${input}_actions.js`, 
                                    csv + 'Clearspeak\ Messages.csv',
                                    locale, `${src} Speech Rule`);
  }
  SplitJson.rewriteSpeechRuleFile(outPath + `/summary_${input}_actions.json`, 
                                  csv + 'Summaries.csv', locale, `${src}`);
  SplitJson.rewriteSpeechRuleFile(outPath + `/prefix_${input}_actions.json`, 
                                  csv + 'Prefixes.csv', locale, `${src}`);
};



/**
 *  Use the CLDR for completion/initial set of elements.
 */
SplitJson.completeCldrLocale = function(iso) {
  let [tts] = SplitJson.loadCldrLocale(iso);
  SplitJson.fillSymbolFiles(iso, tts);
  SplitJson.fillCurrencyFile(iso, tts);
};

SplitJson.loadCldrLocale = function(iso) {
  let file = fs.readFileSync(SplitJson.CLDR_PATH + '/' + iso + '.xml', 'utf8');
  file = file.replace(/>[ \f\n\r\t\v\u200b]+</g, '><').trim();
  let dp = new xmldom.DOMParser();
  let xml = dp.parseFromString(file).documentElement;
  let children = Array.from(xml.childNodes[1].childNodes);
  let tts = {};
  let other = {};
  for (let child of children) {
    let cp = child.getAttribute('cp');
    let type = child.getAttribute('type');
    ((type === 'tts') ? tts : other)[cp] = child.textContent;
  }
  return [tts, other];
};


// Direct replacement on mathmaps file! 
SplitJson.fillSymbolFiles = function(iso, tts) {
  for (let file of SplitJson.SYMBOLS_FILES_) {
    let content = fs.readFileSync(`${SplitJson.PATH_}/${iso}/symbols/${file}`);
    let json = JSON.parse(content);
    // let locale = SplitJson.loadLocale([file], `${SplitJson.PATH_}/${iso}/symbols/`);
    for (let entry of json) {
      if (!entry.key) continue;
      let lookup = tts[SplitJson.numberToUnicode(parseInt(entry.key, 16))];
      if (lookup && !entry.mappings.default.default) {
        entry.mappings.default.default = lookup;
      }
    }
    fs.writeFileSync(`${SplitJson.PATH_}/${iso}/symbols/${file}`, JSON.stringify(json, null, 2));
  }
};


SplitJson.fillCurrencyFile = function(iso, tts) {
  let currency = fs.readFileSync(`${SplitJson.PATH_}/${iso}/units/${SplitJson.CURRENCY_FILE_}`);
  let json = JSON.parse(currency);
  for (let entry of json) {
    if (!entry.key) continue;
    let lookup = null;
    if (entry.mappings.default.singular) continue;
    for (let name of entry.names) {
      lookup = tts[name];
      if (lookup) break;
    }
    if (lookup && !entry.mappings.default.singular) {
      entry.mappings.default.singular = lookup;
    }
  }
  fs.writeFileSync(`${SplitJson.PATH_}/${iso}/units/${SplitJson.CURRENCY_FILE_}`, JSON.stringify(json, null, 2));
};



/**
 *  
 * Working with and rewriting the Rules files.
 *
 */
SplitJson.loadRules = function(iso, file) {
  let json = JSON.parse(fs.readFileSync(`${SplitJson.PATH_}/${iso}/rules/${file}.json`));
  return json.rules;
};
  
SplitJson.getRuleNames = function(rules) {
  let names = [];
  for (let rule of rules) {
    if (rule[0] === 'Rule') {
      let name = rule[1];
      names.push(name);
    }
  }
  let [unique, double] = SplitJson.uniqueNameList(names);
  return [names, unique, double];
};


SplitJson.getRuleAllNames = function(rules) {
  let names = [];
  let unique = {};
  let double = [];
  for (let rule of rules) {
    if (rule[0] !== 'Rule') continue;
    let name = rule[1];
    names.push(name);
    if (!unique[name]) {
      unique[name] = true;
      continue;
    }
    double.push([name, `${name}-${rule[2]}`]);
  }
  return [names, double];
};


SplitJson.getSpecializedRules = function(rules) {
  let noaction = [];
  let actions = [];
  for (let rule of rules) {
    if (rule[0] === 'SpecializedRule') {
      (rule[4] ? actions : noaction).push(rule[1]);
    }
  }
  return [noaction, actions];
};


SplitJson.uniqueNameList = function(...lists) {
  let double = [];
  let unique = {};
  for (let names of lists) {
    for (let name of names) {
      if (unique[name]) {
        double.push(name);
      } else {
        unique[name] = true;
      }
    }
  }
  return [Object.keys(unique), double];
};


SplitJson.currentLocaleRules = {
  'de': 'german',
  'en': 'english',
  'es': 'spanish',
  'fr': 'french',
  'hi': 'hindi',
  'it': 'italian'
};


SplitJson.compareRuleNames = function(domain, splitter = SplitJson.getRuleNames) {
  let splitRules = {};
  for (let [key, name] of Object.entries(SplitJson.currentLocaleRules)) {
    try {
      splitRules[key] = splitter(SplitJson.loadRules(key, `${domain}_${name}`));
    } catch (e) {
      continue;
    }
  }
  return splitRules;
};


// Rewrites in place!
SplitJson.rewriteRules = function(domain, rewriter, output = null, second = null) {
  for (let [iso, name] of Object.entries(SplitJson.currentLocaleRules)) {
    let file = `${SplitJson.PATH_}/${iso}/rules/${domain}_${name}.json`;
    let out = output ?
        (second ? `/tmp/${output}_${name}_${second}.json` :
         `/tmp/${output}_${name}.json`) :
        file;
    try {
      SplitJson.rewriteRuleSet(file, out, rewriter);
    } catch (e) {
      console.log(e);
      continue;
    }
  }
};

SplitJson.rewriteRuleSet = function(input, output, rewriter) {
  let json = JSON.parse(fs.readFileSync(SplitJson.PATH_ + '/' + input));
  let rules = json.rules;
  let result = [];
  for (let rule of rules) {
    let rewrite = rewriter(rule);
    if (rewrite) {
      result.push(rewrite);
    }
  }
  json.rules = result;
  fs.writeFileSync(output, JSON.stringify(json, null, 2) + '\n');
};


// Renaming
let rename = (rule) => {
  if (rule[0] === 'SpecializedRule' && rule[4]) {
    rule[0] = 'SpecializedAction';
  }
  return rule;
};


// Renames rule names via a mapping of pairs.
SplitJson.renameMapping = function(map) {
  this.map = map;
  this.count = 0;
  this.next = function(value) {
    this.reset();
    return this.map[this.count++] || [];
  };
  this.prev = function() {
    this.count--;
  };
  this.reset = function() {
    if (this.count < 0 || this.count >= this.map.length) {
      this.count = 0;
    }
  };
};
SplitJson.renameAllRulesMapping = new SplitJson.renameMapping([]);
{
  let ignoreFirst = true;
  let unique = {};
  SplitJson.renameAllRules = function(rule) {
    if (rule[0] !== 'Rule' || (ignoreFirst && !unique[rule[1]])) {
      unique[rule[1]] = true;
      return rule;
    }
    let map = SplitJson.renameAllRulesMapping.next();
    if (rule[1] !== map[0]) {
      SplitJson.renameAllRulesMapping.prev();
    } else {
      rule[1] = map[1];
    }
    return rule;
  };
}

// Renames spezialised actions into rules. Tries to also rename and rename a
// following spezialised rule.
{
  let lastRule = null;
  let lastName = '';
  SplitJson.renameSpecializedAction = function(rule) {
    if (rule[0] === 'SpecializedRule' && lastName) {
      rule[1] = lastName;
      return rule;
    }
    lastName = '';
    if (rule[0] === 'Rule') {
      lastRule = rule;
      return rule;
    }
    if (rule[0] !== 'SpecializedAction') {
      return rule;
    }
    lastName = `${rule[1]}-${rule[3]}`;
    let newRule = [
      'Rule', lastName, rule[3], rule[4],
      ...lastRule.slice(4)
    ];
    return newRule;
  };
}

SplitJson.outputRuleNames = function(kind) {
  let names = SplitJson.compareRuleNames(kind, SplitJson.getRuleAllNames);
  for (let [loc, [all, double]] of Object.entries(names)) {
    fs.writeFileSync(`/tmp/${kind}_${loc}.json`, JSON.stringify(all.map(x => [x,x])).replace(/\],\[/g, '],\n ['));
    fs.writeFileSync(`/tmp/${kind}_${loc}_double.json`, JSON.stringify(double).replace(/\],\[/g, '],\n ['));
  }
};


// Actions
let actions = (rule) => (rule[0] === 'Rule') ? ['Action', rule[1], rule[3]] : null;
// SplitJson.rewriteRules('mathspeak', actions, 'mathspeak', 'action');

// Preconditions
let prec = (rule) => (rule[0] === 'Rule') ? ['Precondition', rule[1], rule[2], ...rule.slice(4)] : rule;
// SplitJson.rewriteRules('mathspeak', prec, 'mathspeak');

// let rules = [ "number", "identifier-spacing", "identifier", "prefix", "postfix", "binary-operation", "implicit", "function-unknown", "function-prefix", "fences-open-close", "text", "matrix-cell", "row-simple", "line", "end-punct", "start-punct", "punctuated", "unit", "unit-combine" ];

SplitJson.removeAction = function(names, remove) {
  let list = names.splice(0);
  return r => {
    if (remove) {
      if (r[1] !== list[0]) {
        return r;
      }
      list.shift();
      return null;
    }
    if (r[1] === list[0]) {
      list.shift();
      return r;
    }
    return null;
  };
};
