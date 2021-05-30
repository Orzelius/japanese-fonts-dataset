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
// import * as wanakana from 'wanakana';
const {PROPS} = require('./const')

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
          console.log(PROPS)
          PROPS.classes.forEach(kanaEl => {
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
            ctx.fillText(kanaEl.kat, 10, 80, 100)
            canvas.createPNGStream()
              .pipe(fs.createWriteStream(path.join(__dirname, '/images/katakana/' + `${kanaEl.kat}_${count}.png`)));
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