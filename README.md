# cp.js

[![Latest version](https://img.shields.io/npm/v/@unixcompat/cp.js)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/@unixcompat/cp.js)
](https://www.npmjs.com/package/@unixcompat/cp.js)

Copies files or directories like the `cp` command.

There are multi-platform file-system commands compatible with `cp` from UN*X implemented for Node.js in JavaScript, like [ncp], [cpy-cli], [cpx] or [copyfiles], but they have different interface and different behaviour than the `cp` command. Instead of reusing the knowledge of the `cp` command, you would have to learn their new interface. This project aims to provide the well-known interface of the `cp` command.

See also other commands compatible with their counterparts from UN*X - [mkdir.js] and [rm.js].

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 14.8 or newer.

```sh
$ npm i -D @unixcompat/cp.js
$ pnpm i -D @unixcompat/cp.js
$ yarn add -D @unixcompat/cp.js
```

## Command-line Interface

    Usage: cp.js [-DfHnpRrv] [--] src... dest

    Options:
      -c|--cwd <dir>      directory to start looking for the source files in
      -D|--dry-run        only print path of each source file or directory
      -f|--force          removes the destination if not writable
      -H|--dereference    follows symbolic links, so that the files are copied
      -n|--no-clobbering  prevents accidentally overwriting any files
      -p|--preserve       preserves timestamps of the source files
      -R|--recursive      copy directories recursively (also -r)
      -v|--verbose        print path of each copied file or directory
      -V|--version        print version number
      -h|--help           print usage instructions

    Examples:
      $ cp.js prog.js prog.bak
      $ cp.js jones smith /home/nick/clients
      $ cp.js -R /home/nick/clients /home/nick/customers

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License

Copyright (c) 2022 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[ncp]: https://www.npmjs.com/package/ncp
[cpy-cli]: https://www.npmjs.com/package/cpy-cli
[cpx]: https://www.npmjs.com/package/cpx
[copyfiles]: https://www.npmjs.com/package/copyfiles
[mkdir.js]: https://www.npmjs.com/package/@unixcompat/mkdir.js
[rm.js]: https://www.npmjs.com/package/@unixcompat/rm.js
