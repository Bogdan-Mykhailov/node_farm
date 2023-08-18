"use strict";
const fs = require('fs')
const http = require('http');
const url = require('url');


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

const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCT_NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%NUTRIENTS_NAME%}/g, product.nutrients);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace('{%NOT_ORGANIC%}', 'not-organic');
  }

  return output;
}

const templateOverview = fs.readFileSync('./templates/template-overview.html', 'utf-8')
const templateProduct = fs.readFileSync('./templates/template-product.html', 'utf-8')
const templateCard = fs.readFileSync('./templates/template-card.html', 'utf-8')
const data = fs.readFileSync('./dev-data/data.json', 'utf-8')
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const pathName = req.url;

  if (pathName === '/' || pathName === '/overview') {

    res.writeHead(200, {'Content-Type': 'text/html'})

    const cardsHtml = productData.map((el) => replaceTemplate(templateCard, el)).join('');
    const overview = templateOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);
    res.end(overview)
  } else if (pathName === '/product') {
    res.end('This is the product')
  } else if (pathName === '/api') {


    res.writeHead(200, {'Content-Type': 'application/json'})
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end("<h1>Page not found</h1>");
  }
});

server.listen(port, () => {
  console.log(`Server use port ${port}`)
})
