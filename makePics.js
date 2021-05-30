const $ = require('cheerio');
var https = require('https');
const fs = require('fs');
const axios = require('axios');
const path = require('path');
const { registerFont, createCanvas } = require('canvas')
const canvas = createCanvas(200, 200)
const ctx = canvas.getContext('2d')
const FontName = require('fontname');
var fontkit = require('fontkit');
// import { getName } from './fontforge';
import * as wanakana from 'wanakana';


const vowels = ['a', 'i', 'u', 'e', 'o']
const consonants = ['k', 'g', 's', 'z', 't', 'd', 'n', 'h', 'p', 'b', 'm', 'y', 'r', 'w']

const basicKana = {
  latin: '',
  katakana: '',
  hiragana: '',
  daku: false,
}
const kana = [];
vowels.forEach(vowel => {
  consonants.forEach(cons => {
    let newKana = { ...basicKana, latin: (cons + vowel) };
    newKana.katakana = wanakana.toKatakana(newKana.latin);
    newKana.hiragana = wanakana.toHiragana(newKana.latin);
    if(cons === 'g' || cons === 'z' || cons === 'd' || cons === 'p' || cons === 'b'){
      newKana.daku = true;
    }
    if(newKana.latin != 'wi' && newKana.latin != 'we' && newKana.latin != 'ye' && newKana.latin != 'we')
    kana.push(newKana);
  })
});
const sortFonts = () => {
  const fontsPath = __dirname + '/fonts/valid';
  (async () => {
    try {
      const files = await fs.promises.readdir(fontsPath);
      let count = 0;
      for (const file of files) {
        count++;
        if (file) {
          // console.log('\n', count, file);
          kana.forEach(kanaEl => {
            console.log(count, kanaEl);
            const fromPath = path.join(fontsPath, file);
            registerFont(fromPath, { family: "aaasd" });
            const canvas = createCanvas(100, 100)
            const ctx = canvas.getContext('2d')
            let font;
            font = fontkit.openSync(fromPath);
            // console.log(font.familyName + '  ');
            ctx.font = '80px "' + font.familyName + '"'
            ctx.fillStyle = '#fff'
            ctx.fillText(kanaEl.hiragana, 10, 80, 100)
            canvas.createJPEGStream()
              .pipe(fs.createWriteStream(path.join(__dirname, '/images/hiragana/' + `${kanaEl.latin}_${font.familyName}_daku${kanaEl.daku}`+ '.jpeg')));
          });
        }
      }
    }
    catch (e) {
      console.error("We've thrown! Whoops!", e);
    }

  })();
}
sortFonts();