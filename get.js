'use strict';

exports.getRssAtom = function(feedUrl, callback) {

    const
        url = require('url'),
        feed = url.parse(feedUrl),
        http = require('http'),
        https = require('https');

    function getItem(content, tag) {
        let tagStart = 0, tagEnd = 0, s = '', count = 0;
        while (content.search('<' + tag) > 0 && count < content.length) {
            tagStart = content.search('<' + tag);
            tagEnd = content.search('/' + tag + '>');
            if (tagEnd > tagStart) {
                s = content.substr(tagStart, tagEnd - tagStart + tag.length + 2);
                content = content.replace(s, '')
            } else {
                count++
            }
        }
        return s.replace("<![CDATA[", "")
            .replace("]]>", "")
            .replace(/<[^>]+>/g, '')
            .replace(/\r?\n|\r/g, '')
    }

    function getItemAtom(content, tag) {
        const match = content.match('<' + tag + '(.*)?/>');
        if (match !== null) {
            return match[0].match(/"(.*)"/)[0].replace(/"/g, '')
        } else {
            return ''
        }
    }

    function getItems(content, tag) {
        let arr = [], tagStart = 0, tagEnd = 0, count = 0;
        while (content.search('<' + tag) > 0 && count < content.length) {
            tagStart = content.search('<' + tag);
            tagEnd = content.search('/' + tag + '>');
            if (tagEnd > tagStart) {
                let
                    s = content.substr(tagStart, tagEnd - tagStart + tag.length + 2),
                    t = getItem(s, 'title'),
                    c = getItem(s, 'content').concat(getItem(s, 'description')),
                    l = getItem(s, 'link');
                if (t === '') t = '[Failed]';
                if (c === '') c = '[Failed]';
                if (l === '') l = getItemAtom(s, 'link');
                if (l === '') l = '[Failed]';
                arr.push({title: t, description: c, href: l});
                content = content.replace(s, '')
            }
            count++
        }
        return arr
    }

    function getTitle(content) {
        let
            s = content.toString(),
            titleStart = s.indexOf('<title'),
            titleEnd = s.indexOf('</title>');
        s = s.substr(titleStart, titleEnd - titleStart + 8);
        if ( s === '') s = '[Failed]';
        return s.replace("<![CDATA[", "")
            .replace("]]>", "")
            .replace(/<[^>]+>/g, '')
            .replace(/\r?\n|\r/g, '')
    }

    function extractItems(content) {
        let t = getTitle(content.toString());
        return { title: t, items: getItems(content.toString(), 'item')
            .concat(getItems(content.toString(), 'entry')) }
    }

    const parser = function (res) {
        let content = '';
        res.on('data', chunk => content += chunk);
        res.on('end', () => callback(extractItems(content)));
    };

    if (feed.protocol === 'http:') {
        http.get(feedUrl, parser).on('error', e => {
            console.error(e.message)
        })
    } else {
        https.get(feedUrl, parser).on('error', e => {
            console.error(e.message)
        })
    }

};
