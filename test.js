test = require('get-rss-son/get');

let
    count = 0;
    feedUrl = '';

if (process.argv.length > 1) {
    feedUrl = process.argv[2]
}

test.getRssAtom(feedUrl, content => content.forEach((item) => {
    count++;
    console.log(`\n--${count}-- ${item.title}\n${item.description}\n${item.href}\n`)
}));
