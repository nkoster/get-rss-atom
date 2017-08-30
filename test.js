test = require('get-rss-son/get');

let
    count = 0;
    hostFeed = '';

if (process.argv.length > 1) {
    hostFeed = process.argv[2]
}

test.getRssAtom(hostFeed, content => content.forEach((item) => {
    count++;
    console.log(`\n--${count}-- ${item.title}\n${item.description}\n${item.href}\n`)
}));
