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

SplitJson.PATH_ = SplitJson.BASE_PATH_ + 'speech-rule-engine/src/mathmaps';

SplitJson.OUTPUT_PATH_ = SplitJson.L10N_PATH_ + '/transform/split-forms';

SplitJson.HTML_PATH_ = '/tmp/html';

SplitJson.TEMPLATE_PATH_ = '/tmp/ods';

SplitJson.ODS_PATH_ = SplitJson.L10N_PATH_ + '/locales';

SplitJson.ALPHANUM_TEMPLATE_ = SplitJson.L10N_PATH_ + '/templates/AlphaNumerics.ods';

SplitJson.ODS_TEMPLATE_ = SplitJson.L10N_PATH_ + '/templates/ods';

SplitJson.INPUT_PATH_ = SplitJson.L10N_PATH_ + '/transform/int-forms';

SplitJson.WWW_BASE_PATH = SplitJson.BASE_PATH_ + 'sre-webpages/resources/www';

SplitJson.UNICODE_PATH = SplitJson.BASE_PATH_ + 'others/unicode-table-data/loc';

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
  'greek-scripts.js', 'greek-symbols.js',
  'greek-rest.js',

  // Hebrew
  'hebrew_letters.js',

  // Latin
  'latin-lower-double-accent.js', 'latin-lower-phonetic.js',
  'latin-lower-single-accent.js', 'latin-rest.js',
  'latin-upper-double-accent.js', 'latin-upper-single-accent.js',

  // Math Symbols
  'math_angles.js', 'math_arrows.js', 'math_characters.js',
  'math_delimiters.js', 'math_geometry.js',
  'math_harpoons.js', 'math_non_characters.js', 'math_symbols.js',
  'math_whitespace.js', 'other_stars.js',

  // Digits
  'digits_rest.js'

];


/**
 * Array of JSON filenames containing symbol definitions for math speak.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.FUNCTIONS_FILES_ = [
  'algebra.js', 'elementary.js', 'hyperbolic.js', 'trigonometry.js'
];


/**
 * Array of JSON filenames containing unit definitions for math speak.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.UNITS_FILES_ = [
  'area.js', 'energy.js', 'length.js', 'memory.js', 'other.js', 'speed.js',
  'temperature.js', 'time.js', 'volume.js', 'weight.js'// , 'currency.js' // ???
];


SplitJson.CURRENCY_FILE_ = 'currency.js';

SplitJson.PREFIX_FILE_ = 'prefix.js';

/**
 * Array of JSON filenames containing unit unused unicode translations.
 * @type {Array.<string>}
 * @const
 * @private
 */
SplitJson.UNUSED_FILES_ = [
  'accented_characters.js', 'currencies_music.js', 'greek_accented.js',
  'private_area.js', 'special_symbols.js'
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
  let [result, missing] = SplitJson.splitContent(list, locale, addempty);
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
SplitJson.splitContent = function(list, locale, addempty = false) {
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
        loc.mappings = {default: { default: '', singular: '', dual: '' }};
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
  fs.writeFileSync(`${SplitJson.OUTPUT_PATH_}/${iso}-rest/${kind}.js`,
                   JSON.stringify(values, null, 2));
};


SplitJson.generateFiles = function(iso) {
  let base = JSON.stringify([{"locale": iso}], null, 2);
  fs.mkdirSync(`${SplitJson.INPUT_PATH_}/${iso}`, {recursive: true});
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.SYMBOLS_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.FUNCTIONS_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.UNITS_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.CURRENCY_}.json`, base);
  fs.writeFileSync(`${SplitJson.INPUT_PATH_}/${iso}/${SplitJson.PREFIX_}.json`, base);
  SplitJson.allFiles(iso);
};


SplitJson.allFiles = function(iso) {
  fs.writeFileSync(`${SplitJson.OUTPUT_PATH_}/${iso}-missing.csv`, '');
  SplitJson.splitFiles(SplitJson.SYMBOLS_, iso, 'en');
  SplitJson.splitFiles(SplitJson.FUNCTIONS_, iso, 'en', true);
  SplitJson.splitFiles(SplitJson.UNITS_, iso, 'en', true);
  SplitJson.splitFiles(SplitJson.CURRENCY_, iso, 'en');
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
  fs.writeFileSync(`${SplitJson.OUTPUT_PATH_}/${iso}/si/prefixes.js`,
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
  console.log('doing it');
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
  fs.writeFileSync(`${SplitJson.PATH_}/${iso}/units/currency.js`,
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
  // TODO: Change that for the future!
  element.mappings.default.default = row['Plural'];
  element.mappings.default.singular = row['Singular'];
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
      let input = csvPath + path.basename(file, '.js') + '.csv';
      return promise.then(() => SplitJson.fromCsv(input, inPath + file, type, lname));
    },
    new Promise(r => r())
  );
};

// SplitJson.elementsFromCsv('it', SplitJson.SYMBOLS_, '/home/sorge/git/sre/sre-resources/l10n/it/stefano/csv-symbols/', 'Italian');


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

SplitJson.getAssocList = async function(file, domain = 'English',
                                        locale = 'Locale', english = 'English') {
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


SplitJson.writeAssocList = async function(file, out, domain = 'English',
                                          locale = 'Locale', english = 'English') {
  let mapping = await SplitJson.getAssocList(file, domain, locale, english);
  fs.writeFileSync(out, JSON.stringify(mapping, null, 2));
};

// 
//

/**
 * 
 * Rewriting speech rule files from CSV file input.
 * (For this we need to load SRE with require.)
 */
// require('/home/sorge/git/sre/speech-rule-engine/lib/sre4node');


SplitJson.getTextString = function(text) {
  if (text.match(/^\".*\"$/)) {
    return text.slice(1, text.length - 1);
  }
  return null;
};


SplitJson.rewriteSpeechRuleAction = function(actionStr, mapping) {
  let action = sre.SpeechRule.Action.fromString(actionStr);
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


SplitJson.rewriteSpeechRuleFile = async function(json, csv) {
  let english = JSON.parse(fs.readFileSync(json));
  let mapping = await SplitJson.getAssocList(
    csv, 'English Speech Rule', 'Locale', 'English Speech Rule'); // line for clear/mathspeak
    // csv, 'English', 'Locale', 'English'); // Line for prefix and summary
  console.log(mapping);
  let newRules = [];
  for (let rule of english.rules) {
    let type = rule[0];
    if (type === 'Rule') {
      rule[3] = SplitJson.rewriteSpeechRuleAction(rule[3], mapping);
    }
    if (type === 'SpecializedRule' && rule[4]) {
      rule[4] = SplitJson.rewriteSpeechRuleAction(rule[4], mapping);
    }
    newRules.push(rule);
  }
  english.rules = newRules;
  fs.writeFileSync('/tmp/out.json', JSON.stringify(english, null, 2));
};


SplitJson.rewriteSpeechRulesLocale = function(iso, locale, csv) {
  let outPath = SplitJson.PATH_ + '/' + iso + '/rules';
  // SplitJson.rewriteSpeechRuleFile(outPath + `/mathspeak_${locale}.js`, 
  //                                 csv + '/csv-messages/Mathspeak\ Messages.csv');
  SplitJson.rewriteSpeechRuleFile(outPath + `/clearspeak_${locale}.js`, 
                                  csv + '/csv-messages/Clearspeak\ Messages.csv');
  // SplitJson.rewriteSpeechRuleFile(outPath + `/summary_${locale}.js`, 
  //                                 csv + '/csv-messages/Summaries.csv');
  // SplitJson.rewriteSpeechRuleFile(outPath + `/prefix_${locale}.js`, 
  //                                 csv + '/csv-messages/Prefixes.csv');
};
