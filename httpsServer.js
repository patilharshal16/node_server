var express = require('express');
var cors = require('cors');
var compression = require('compression');
var path = require('path');
var https = require('https');
var http = require('http');
var fs = require('fs');

const app = express();

const PORT = 443;

const httpOptions = {
  cert: fs.readFileSync(`/root/DONOTDELETE/genomesmart.com.cert`),
  key: fs.readFileSync(`/root/DONOTDELETE/genomesmart.com.key`)
};

app.use(compression());

var server = https.createServer(httpOptions, app);

app.use(cors({
    origin: true,
    methods: 'POST, GET, PUT, DELETE, OPTIONS',
    exposedHeaders: 'Content-Range, X-Content-Range',
    credentials: true,
    allowedHeaders: 'Cache-Control, Origin, Authorization, Content-Type, X-Requested-With',
}));


const DIST_FOLDER = path.join(process.cwd(), 'dist/browser/');

app.get('*', express.static(path.join(DIST_FOLDER, '')));
app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_FOLDER, '') + '/index.html');
});


app.use(express.static('dist/browser'));

app.get('*', function (req, res) {
        res.setHeader("X-Frame-Options", "DENY");
        res.sendFile('/dist/browser/index.html', { root: __dirname });
})

server.listen(PORT, function () {
    console.log(`HTTPS server started listening on port:    ${PORT}`);
});

http.createServer(function (req, res) {
  res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url });
  res.end();
}).listen(80);