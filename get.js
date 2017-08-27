'use strict';

let hostFeed = '';
if (process.argv.indexOf("-host") != -1) {
    hostFeed = process.argv[process.argv.indexOf("-host") + 1];
}

let hostPort = '';
if (process.argv.indexOf("-port") != -1) {
    hostPort = process.argv[process.argv.indexOf("-port") + 1];
}

let hostPath = '';
if (process.argv.indexOf("-path") != -1) {
    hostPath = process.argv[process.argv.indexOf("-path") + 1];
}

const
    http = require('http'),
    https = require('https'),
    options = {
        host: hostFeed,
        port: hostPort,
        path: hostPath
    };

function extractItems(content) {
    let
        arr = [],
        c = content.toString(),
        count = 0, p1 = 0, p2 = 0,
        s = '';
    while (c.search(/<item/) > 0) {
        p1 = c.search(/<item/);
        p2 = c.search(/\/item>/);
        if (p2 > p1) {
            s = c.substr(p1, p2 - p1 + 6);
            arr.push(s);
            c = c.replace(s, '');
            count++
        }
    }
    while (c.search(/<entry/) > 0) {
        p1 = c.search(/<entry/);
        p2 = c.search(/\/entry>/);
        if (p2 > p1) {
            s = c.substr(p1, p2 - p1 + 7);
            arr.push(s);
            c = c.replace(s, '');
            count++
        }
    }
    return arr
}

const parser = function(res) {
    let content = '';
    res.on('data', chunk => content += chunk);
    res.on('end', () => {
        extractItems(content).forEach((item) => {
            console.log(item)
        })
    });
    console.log("Got response: " + res.statusCode);
};

if (hostPort === '80') {
    http.get(options, parser).on('error', e => {
        console.error(e.message);
    });
} else {
    https.get(options, parser).on('error', e => {
        console.error(e.message);
    });
}
