require('/home/sorge/git/sre/speech-rule-engine/lib/sre4node');


sre.L10n.setLocale('es');


let vf = function(en, den) {
  return sre.Messages.NUMBERS.numberToWords(en) +
    sre.Messages.NUMBERS.vulgarSep +
    sre.Messages.NUMBERS.numberToOrdinal(den);
};


