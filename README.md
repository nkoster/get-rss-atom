Simple RSS/ATOM feed parser.

Pass an URL to getRssAtom() and you'll receive a callback with an object array.

### Install

```
npm init
npm install --save get-rss-atom
```

### Usage

For example, create `test.js`

```
test = require('get-rss-son/get');

let
    count = 0;
    hostFeed = '';

if (process.argv.length > 1) {
    hostFeed = process.argv[2]
}

test.getRssAtom(hostFeed, content => content.forEach((item) => {
    count++;
    console.log(
    `\n--${count}-- ${item.title}\n${item.description}\n${item.href}\n`
    )
}));
```

### Run

```
node test.js https://rss.fok.nl/feeds/nieuws
```
