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
        c = content.toString(),
        count = 0,
        regex = /<item/;
    while (c.search(regex) > 0) {
        c = c.replace(regex, '');
        count++
    }
    regex = /<entry/;
    while (c.search(regex) > 0) {
        c = c.replace(regex, '');
        count++
    }
    return count;
}

const parser = function(res) {
    let content = '';
    res.on('data', chunk => content += chunk);
    res.on('end', () => {
        console.log(extractItems(content))
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
