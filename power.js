const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
var randomize = require('randomatic')
var random = require('random-name')
const cheerio = require('cheerio');
const { link } = require('fs-extra');

const functionVerif = (link) => new Promise((resolve, reject) => {
      fetch(link, { 
          method: 'GET'
      })
      .then(res => res.text())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

const functionRegist = (first, last, email, reff) => new Promise((resolve, reject) => {
    const bodys = {
        "params":{"event":"registration","user":{"firstname":first,"lastname":last,"email":email,"extraData":{},"consents":{}},"referrer":{"referralCode":reff},"refSource":"copy","acquiredFrom":"popup"},"publicToken":"CovQMDh5aTt2BADpDlbOYJQWCyA"
        }
    
      fetch('https://app.viral-loops.com/api/v2/events', { 
          method: 'POST', 
          body: JSON.stringify(bodys),
          headers: {
            'Host': 'app.viral-loops.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
            'X-UCID': 'CovQMDh5aTt2BADpDlbOYJQWCyA',
            'Content-Type': 'application/json',
            'Accept': '*/*',
            'Origin': 'https://power.trade',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'en-US,en;q=0.9'

          }
      })
      .then(res => res.json())
      .then(result => {
          resolve(result);
      })
      .catch(err => reject(err))
  });

  const functionGetLink = (nickname) =>
  new Promise((resolve, reject) => {
      fetch(`https://generator.email/`, {
          method: "get",
          headers: {
              'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
              'accept-encoding': 'gzip, deflate, br',
              'accept-language': 'en-US,en;q=0.9',
              'cookie': `_ga=GA1.2.1434039633.1579610017; _gid=GA1.2.374838364.1579610017; _gat=1; surl=cokils.com%2F${nickname}`,
              'sec-fetch-mode': 'navigate',
              'sec-fetch-site': 'same-origin',
              'upgrade-insecure-requests': 1,
              'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36'
          }
      })
      .then(res => res.text())
          .then(text => {
              const $ = cheerio.load(text);
              const src = $('td[class=font_default] a').attr('href')
              resolve(src);
          })
          .catch(err => reject(err));
  });

(async () => {
    const reff = readlineSync.question('[?] Reff: ')
    const jumlah = readlineSync.question('[?] Jumlah reff: ')
    console.log("")
    for (var i = 0; i < jumlah; i++){
    try {
        var rand = randomize('0', 5)
        var first = random.first()
        const last = random.last()
        const email = `${first}${rand}@cokils.com`
        const regist = await functionRegist(first, last, email, reff)
        if (regist.email == email){
            console.log('[+] Regist Berhasil !')
            do {
                var link = await functionGetLink(`${first}${rand}`)
            } while (link == undefined)
            console.log(`[+] Link verif: ${link}`)
            const verif = await functionVerif(link)
            if(verif){
                console.log("[+] Berhasil Verif !\n")
            } else {
                console.log("[!] Gagal Verif !\n")
            }
        } else {
            console.log('[!] Regist Gagal !\n')
        }
    } catch (e) {
        console.log(e)
    }
}
})()