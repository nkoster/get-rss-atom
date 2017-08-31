Simple RSS/ATOM feed parser.

`getRssAtom(url, callback)` returns a callback with an object:

```
{
    title: String,
    items: Array [
        {
            title: String,
            content: String,
            href: String
        },
        ...
    ]
}
```

### Install

```
npm init
npm install --save get-rss-atom
```

### Usage

For example, create `reader.js`

```
const reader = require('get-rss-atom');

let
    count = 0;
    feedUrl = '';

if (process.argv.length > 2) {
    feedUrl = process.argv[2]
} else {
    console.error('Please specify an RSS URL.');
    process.exit(1)
}

reader.getRssAtom(feedUrl, feed => {
    console.log(`\n${feed.title}\n`);
    feed.items.forEach((item) => {
        count++;
        console.log(`\n--${count}-- ${item.title}\n${item.content}\n${item.href}\n`)
    }
)});
```

### Run

```
node reader http://www.at5.nl/feeds/at5/nieuws/V100/nieuws
```
