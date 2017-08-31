Simple RSS/ATOM feed parser.

`getRssAtom(url, callback)` returns a callback with an object array.

### Install

```
npm init
npm install --save get-rss-atom
```

### Usage

For example, create `reader.js`

```
reader = require('get-rss-atom');

let
    count = 0;
    feedUrl = '';

if (process.argv.length > 1) {
    feedUrl = process.argv[2]
}

reader.getRssAtom(feedUrl, content => content.forEach((item) => {
    count++;
    console.log(`\n--${count}-- ${item.title}\n${item.description}\n${item.href}\n`)
}));
```

### Run

```
node reader http://www.at5.nl/feeds/at5/nieuws/V100/nieuws
```
