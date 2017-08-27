'use strict';

let hostFeed = '', hostPort = '80', hostPath = '';

if (process.argv.indexOf("-host") !== -1) {
    hostFeed = process.argv[process.argv.indexOf("-host") + 1]
}

if (process.argv.indexOf("-port") !== -1) {
    hostPort = process.argv[process.argv.indexOf("-port") + 1]
}

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

function getItem(content, tag) {
    let tagStart = 0, tagEnd = 0, s = '';
    while (content.search('<' + tag) > 0) {
        tagStart = content.search('<' + tag);
        tagEnd = content.search('/' + tag + '>');
        if (tagEnd > tagStart) {
            s = content.substr(tagStart, tagEnd - tagStart + tag.length + 2);
            content = content.replace(s, '')
        }
    }
    return s.replace("<![CDATA[", "").replace("]]>", "").replace(/<[^>]+>/g, '')
}

function getItems(content, tag) {
    let arr = [], tagStart = 0, tagEnd = 0;
    while (content.search('<' + tag) > 0) {
        tagStart = content.search('<' + tag);
        tagEnd = content.search('/' + tag + '>');
        if (tagEnd > tagStart) {
            let
                s = content.substr(tagStart, tagEnd - tagStart + tag.length + 2),
                t = getItem(s, 'title'),
                c = getItem(s, 'content').concat(getItem(s, 'description'));
            arr.push( { title: t, description: c } );
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
            console.log(`\n--------\n${item.title}\n${item.description}\n`)
        })
    });
    console.log(`Got response: ${res.statusCode}`)
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
