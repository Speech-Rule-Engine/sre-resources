require('/home/sorge/git/sre/speech-rule-engine/lib/sre4node');


sre.Engine.getInstance().locale = 'de';
sre.L10n.setLocale();


let vf = function(en, den) {
  return sre.Messages.NUMBERS.numberToWords(en) +
    sre.Messages.NUMBERS.vulgarSep +
    sre.Messages.NUMBERS.numberToOrdinal(den, en > 1);
};


let vfb = function(en, den) {
  return '⠹' + sre.Messages.NUMBERS.numberToWords(en) +
    '⠌' + sre.Messages.NUMBERS.numberToWords(den) + '⠼';
};


