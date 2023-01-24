let http = require('http');
const fs = require(`fs`);


let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Whoops! File not found!');
        } else {
            response.write(data);
        }
        response.end();
    });


    // response.write('Hi There!');
    // response.end();
};

http.createServer(handleRequest).listen(8000);