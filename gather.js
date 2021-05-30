const $ = require('cheerio');
var https = require('https');
const fs = require('fs');
const axios = require('axios');
const path = require( 'path' );

console.clear();

const getfonts = () => {
  fs.writeFileSync('fonts.txt', '', { encoding: 'utf8', flag: 'w' })
  for (let page = 1; page < 10; page++) {
    axios.get('https://www.freejapanesefont.com/category/handwriting/page/' + page).then(res => {
      // console.log(res);
      Array.prototype.forEach.call($('ul.loop', res.data).children(), element => {
        if (element.children[1].type !== 'comment') {
          let link = element.children[1].children[1].attribs.href;
          console.log(link);
          fs.appendFile('fonts.txt', link + '\n', function (err) {
            if (err) throw err;
          });
        }
      });
      // console.log($('ul.loop', res.data).children()[0].children[1].children[1].attribs.href);
    })
  }
}
// getfonts();

const getfonts2 = () => {
  fs.writeFileSync('fonts2.txt', '', { encoding: 'utf8', flag: 'w' })
  for (let page = 1; page < 9; page++) {
    axios.get('https://www.vector.co.jp/vpack/filearea/winnt/writing/font/index_00' + page + '.html').then(res => {
      // console.log(res);
      // console.log($('ul.file_list', res.data).children()[0].children);
      Array.prototype.forEach.call($('ul.file_list', res.data).children(), element => {
        let isFree = false;
        let index = element.children.findIndex(e => e.attribs && e.attribs.alt && e.attribs.alt === 'FREE');
        if(index !== -1){
          let href = element.children[element.children.findIndex(e => e.name === 'a' && e.attribs && e.attribs.href)].attribs.href;
          href = href.split('/');
          href = 'https://www.vector.co.jp/soft/dl/winnt/writing/' + href[href.length - 1];
          // console.log(href);
          axios.get(href).then(res2 => {
            let downloadUrl1 = 'https://www.vector.co.jp' + $('a.btn.download', res2.data)[0].attribs.href;
            axios.get(downloadUrl1).then(res2 => {
            let hrefs = $('p > a > img', res2.data);

            let urlDownloadFinal = hrefs.parent()[0].attribs.href;
            let filename = urlDownloadFinal.split('/');
            let filename2 = filename[filename.length - 1]
            download(urlDownloadFinal, __dirname + '/fonts/random/' + filename2);
          });
          });
        }
      });
      // console.log($('ul.loop', res.data).children()[0].children[1].children[1].attribs.href);
    })
  }
}
// getfonts2();

var download = function(url, dest, cb) {
  var file = fs.createWriteStream(dest);
  var request = https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      console.log('finished downloading ' + dest)
      file.close(cb);  // close() is async, call cb after close completes.
    });
  }).on('error', function(err) { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    if (cb) cb(err.message);
  });
};
