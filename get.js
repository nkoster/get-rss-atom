'use strict';

let hostFeed = '';
if (process.argv.indexOf("-host") !== -1) {
    hostFeed = process.argv[process.argv.indexOf("-host") + 1]
}

let hostPort = '';
if (process.argv.indexOf("-port") !== -1) {
    hostPort = process.argv[process.argv.indexOf("-port") + 1]
}

let hostPath = '';
if (process.argv.indexOf("-path") !== -1) {
    hostPath = process.argv[process.argv.indexOf("-path") + 1]
}

const
    http = require('http'),
    https = require('https'),
    options = {
        host: hostFeed,
        port: hostPort,
        path: hostPath
    };

function getItems(content, tag) {
    let
        arr = [],
        tagStart = 0, tagEnd = 0,
        s = '';
    while (content.search('<' + tag) > 0) {
        tagStart = content.search('<' + tag);
        tagEnd = content.search('/' + tag + '>');
        if (tagEnd > tagStart) {
            s = content.substr(tagStart, tagEnd - tagStart + tag.length + 2);
            arr.push(s);
            content = content.replace(s, '')
        }
    }
    return arr
}

function extractItems(content) {
    return getItems(content.toString(), 'item').concat(getItems(content.toString(), 'entry'))
}

const parser = function(res) {
    let content = '';
    res.on('data', chunk => content += chunk);
    res.on('end', () => {
        extractItems(content).forEach((item) => {
            console.log(item)
        })
    });
    console.log("Got response: " + res.statusCode)
};

if (hostPort === '80') {
    http.get(options, parser).on('error', e => {
        console.error(e.message)
    })
} else {
    https.get(options, parser).on('error', e => {
        console.error(e.message)
    })
}
