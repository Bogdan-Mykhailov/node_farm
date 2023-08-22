"use strict";
const fs = require('fs')
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

// sync way, blocking
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
//
// const textOut = `This is what we know about avocado: ${textIn}.\nCrated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
//

// non-blocking, async way
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//   if (err) {
//     console.log(err.message || 'Something went wrong!')
//     return;
//   }
//
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     if (err) {
//       console.log(err.message || 'Something went wrong!')
//       return;
//     }
//
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//       if (err) {
//         console.log(err.message || 'Something went wrong!')
//         return;
//       }
//
//       console.log(data3);
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//         if (err) {
//           console.log(err.message || 'Something went wrong!');
//           return;
//         }
//         console.log('Your file gas been written 👍🏼')
//       })
//     });
//   });
// });
const port = 8000

const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8');
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8');
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8');

const data = fs.readFileSync('./dev-data/data.json', 'utf-8')
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {'Content-Type': 'text/html'})

    const cardsHtml = productData.map((el) => replaceTemplate(templateCard, el)).join('');
    const output = templateOverview.replace('{%PRODUCT_CARD%}', cardsHtml);
    res.end(output)
  } else if (pathname === '/product') {
    res.writeHead(200, {'Content-Type': 'text/html'})
    const product = productData[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output)
  } else if (pathname === '/api') {
    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(port, () => {
  console.log(`Server use port ${port}`)
})
