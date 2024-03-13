# hledger-parser

![NPM Version](https://img.shields.io/npm/v/hledger-parser)
![Version](https://img.shields.io/github/package-json/v/goldenpathtechnologies/hledger-parser)
![Release](https://img.shields.io/github/actions/workflow/status/goldenpathtechnologies/hledger-parser/release.yml)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
![LICENSE](https://img.shields.io/github/license/goldenpathtechnologies/hledger-parser)

![hledger-parser logo](https://github.com/goldenpathtechnologies/hledger-parser/blob/main/resources/logo-256.png?raw=true)

A parser for hledger journal files based on Chevrotain

## Grammar

[🏗️ Parsing diagram](https://raw.githack.com/goldenpathtechnologies/hledger-parser/main/diagram.html)

## Installation

```sh
npm install hledger-parser
```

## Usage

```typescript
import { parseLedgerToCooked } from 'hledger-parser';

const parseResult = parseLedgerToCooked(sourceCode);

console.log(`Lexing errors: ${parseResult.lexErrors.length}`);
console.log(`Parsing errors: ${parseResult.parseErrors.length}`);
console.log('Result:', parseResult.cookedJournal);

// Output:
// => Lexing errors: 0
// => Parsing errors: 0
// => Result: {
// =>   transactions: [
// =>     {
// =>       date: [Object],
// =>       status: 'unmarked',
// =>       description: 'Transaction',
// =>       postings: [Array],
// =>       tags: []
// =>     }
// =>   ],
// =>   accounts: [],
// =>   prices: []
// => }
```

## Contributors

- Tristan Jones ([@jonestristand](https://github.com/jonestristand)), Author
- Daryl G. Wright ([@darylwright](https://github.com/darylwright)), Lead Maintainer

## Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check the
[issues page](https://github.com/goldenpathtechnologies/hledger-parser/issues). You can also take a
look at the [contributing guide](https://github.com/goldenapathtechnologies/hledger-parser/blob/master/CONTRIBUTING.md).

## Project roadmap

Please see the [roadmap](ROADMAP.md) for project status and a list of features to be implemented.

## Show your support

Give a ⭐️ if this project helped you!

## License

Copyright © 2022 [Tristan Jones <jones.tristand@gmail.com>](https://github.com/jonestristand).<br />
Copyright © 2024 [Daryl G. Wright <daryl@goldenpath.ca>](https://github.com/darylwright).<br />
This project is [MIT](https://github.com/goldenpathtechnologies/hledger-parser/blob/master/LICENSE) licensed.
