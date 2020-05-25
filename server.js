var express = require('express');
var cors = require('cors');
var compression = require('compression');
var path = require('path');
var https = require('https');

const app = express();

app.use(compression());

app.use(cors({
    origin: true,
    methods: 'POST, GET, PUT, DELETE, OPTIONS',
    exposedHeaders: 'Content-Range, X-Content-Range',
    credentials: true,
    allowedHeaders: 'Cache-Control, Origin, Authorization, Content-Type, X-Requested-With',
}));

const DIST_FOLDER = path.join(process.cwd(), 'dist');

app.get('*', express.static(path.join(DIST_FOLDER, '')));
app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_FOLDER, '') + '/index.html');
});

app.use(express.static('/dist'));

app.get('*', function (req, res) {
    res.setHeader("X-Frame-Options", "DENY");
    res.sendFile('/dist/index.html', { root: __dirname });
})

app.listen(process.env.PORT || 4300, function () {
    console.log("HTTP server started listening on port: %s", process.env.PORT || 4300);
});

const options = {
   cert: fs.readFileSync(`certificate.pem`),
   key: fs.readFileSync(`privateKey.pem`)
};

https.createServer(options, app).listen(config.PORT, () => {
   console.log(`HTTPS server started listening on port:    ${config.PORT}`);
});