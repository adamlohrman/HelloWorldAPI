const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const skimPath = path.replace(/^\/+|\/+$/g, '');
  const queryStringObject = parsedUrl.query;
  const method = req.method.toLowerCase();
  const headers = req.headers;

  console.log(skimPath);


  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  req.on('end', () => {
    buffer += decoder.end();
  });

  let yourHandler = typeof (router[skimPath]) !== 'undefined' ? router[skimPath] : handlers.notFound;

  let data = {
    'skimPath': skimPath,
    'queryStringObject': queryStringObject,
    'method': method,
    'headers': headers,
    'payload': buffer
  };

  yourHandler(data, (/*statusCode,*/payload) => {
    // statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
    payload = typeof (payload) == 'object' ? payload : {};
    const payloadString = JSON.stringify(payload);
    res.setHeader('Content-type', 'application/json');
    // res.writeHead(statusCode);
    res.end(payloadString);
    console.log(/*statusCode,*/ payloadString);
  });
});

server.listen(3000, () => {
  console.log('the server is connected');
});

const helloMessage =
  'Hello, there!! I\'d like to welcome you to my first server respone. There will definitely be more to come, but this is the first assignment that\'s being required of me! There\'s not much to look at, it\'s really just this response. Anyways, welcome to the beginning of my path to back-end development, I hope you\'re having a wonderful day and if there\'s anything that you need, just let me know!!'





let handlers = {};

handlers.hello = (data, callback) => {
  callback(/*200, */{ helloMessage });
};

handlers.notFound = (data, callback) => {
  callback(404);
};



let router = {
  'hello': handlers.hello
};