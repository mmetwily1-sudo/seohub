// SEOHUB Local CORS Proxy Server
// Usage: node proxy-server.js
// Then use the crawler in browser - it auto-detects localhost:3001

var http = require('http');
var https = require('https');
var url = require('url');

var PORT = 3001;

var server = http.createServer(function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    var parsed = url.parse(req.url, true);
    if (parsed.pathname === '/proxy') {
        var target = parsed.query.url;
        if (!target) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Missing ?url= parameter' }));
            return;
        }

        try {
            new URL(target);
        } catch(e) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid URL' }));
            return;
        }

        var mod = target.indexOf('https') === 0 ? https : http;
        var proxyReq = mod.get(target, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'ar,en;q=0.5'
            },
            timeout: 15000
        }, function(proxyRes) {
            var body = '';
            proxyRes.setEncoding('utf8');
            proxyRes.on('data', function(chunk) { body += chunk; });
            proxyRes.on('end', function() {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ contents: body, status: proxyRes.statusCode }));
            });
        });

        proxyReq.on('error', function(e) {
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        });

        proxyReq.on('timeout', function() {
            proxyReq.destroy();
            res.writeHead(504, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Request timeout' }));
        });
    } else if (parsed.pathname === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', proxy: 'SEOHub Local Proxy', port: PORT }));
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<html><body style="font-family:system-ui;padding:40px;text-align:center;">' +
            '<h2>SEOHUB CORS Proxy</h2>' +
            '<p>Proxy is running on port ' + PORT + '</p>' +
            '<p>Use: <code>http://localhost:' + PORT + '/proxy?url=<span style="color:#2563eb;">TARGET_URL</span></code></p>' +
            '<p style="color:#10b981;font-weight:bold;">The crawler tool in SEOHUB auto-detects this proxy.</p>' +
            '</body></html>');
    }
});

server.listen(PORT, function() {
    console.log('==============================================');
    console.log('  SEOHUB CORS Proxy Server');
    console.log('  Running on: http://localhost:' + PORT);
    console.log('==============================================');
    console.log('');
    console.log('  Keep this window open while using the crawler.');
    console.log('  The browser tool auto-detects this proxy.');
    console.log('');
    console.log('  Test: http://localhost:' + PORT + '/status');
    console.log('');
});
