# cp.js

[![Latest version](https://img.shields.io/npm/v/@unixcompat/cp.js)
 ![Dependency status](https://img.shields.io/librariesio/release/npm/@unixcompat/cp.js)
](https://www.npmjs.com/package/@unixcompat/cp.js)
[![Coverage](https://codecov.io/gh/prantlf/cp.js/branch/master/graph/badge.svg)](https://codecov.io/gh/prantlf/cp.js)

Copies files or directories like the `cp` command.

There are multi-platform file-system commands compatible with `cp` from UN*X implemented for Node.js in JavaScript, like [ncp], [cpy-cli], [cpx] or [copyfiles], but they have different interface and different behaviour than the `cp` command. Instead of reusing the knowledge of the `cp` command, you would have to learn their new interface. This project aims to provide the well-known interface of the `cp` command.

This package offers only command-line interface, because programmatic interface is provided by [`cp`] and [`copyFile`] from [node:fs]. See also other commands compatible with their counterparts from UN*X - [cat.js], [ln.js], [mkdir.js], [mv.js] and [rm.js].

## Synopsis

The following scripts from `package.json` won't work on Windows:

    rm -rf dist
    mkdir -p dist
    cat src/umd-prolog.txt src/code.js src/umd-epilog.txt > dist/index.umd.js
    cp src/index.d.ts dist
    mv LICENSE doc
    ln -s ../src src

Replace them with the following ones, which run on any operating system which is supported by Node.js:

    rm-j -rf dist
    mkdir-j -p dist
    cat-j src/umd-prolog.txt src/code.js src/umd-epilog.txt > dist/index.umd.js
    cp-j src/index.d.ts dist
    mv-j LICENSE doc
    ln-j -s ../src src

Notice that the only difference is the suffix `.js` behind the command names.

## Installation

This module can be installed in your project using [NPM], [PNPM] or [Yarn]. Make sure, that you use [Node.js] version 16.15 or newer.

```sh
$ npm i -D @unixcompat/cp.js
$ pnpm i -D @unixcompat/cp.js
$ yarn add -D @unixcompat/cp.js
```

## Command-line Interface

See also `man cp` for the original [POSIX documentation] or for the extended [Linux implementation].

    Usage: cp-j [-DfHLnPpRrv] [--] src... dest

    Options:
      -c|--cwd <dir>              directory to start looking for the source files
      -D|--dry-run                only print paths of source files or directories
      -a|--archive                same as -dpR
      -d                          the same as -P
      -f|--force                  removes the destination if not writable
      -H|--dereference-args       follow command-line symbolic links in src
      -L|--dereference            always follow symbolic links in src
      -n|--no-clobbering          prevents accidentally overwriting any files
      -P|--no-dereference         never follow symbolic links in src
      -p|--preserve[=timestamps]  preserve timestamps of the source files
      -r                          the same as -R
      -R|--recursive              copy directories recursively
      -v|--verbose                print path of each copied file or directory
      -V|--version                print version number
      -h|--help                   print usage instructions

    Examples:
      $ cp-j prog.js prog.bak
      $ cp-j jones smith /home/nick/clients
      $ cp-j -R /home/nick/clients/ /home/nick/customers

## Differences

The following options are specific to this command:

    -D|--dry-run    only print path of each file or directory
    -c|--cwd <dir>  directory to start looking for the source files

Also, the arguments may be [BASH patterns]. The pattern matching will ignore symbolic links. The argument `-c|--cwd` will be used only as a base directory to expand the BASH patterns in.

The following options from the POSIX version are not supported:

    -i    write a prompt to standard error before copying to any existing
          non-directory destination file. If the response from the standard
          input is affirmative, the copy shall be attempted; otherwise,
          it shall not.
    -p    duplicate the time of last data modification and time of last
          access, the user ID and group ID, the file permission bits
          and the S_ISUID and S_ISGID bits of each source file
          in the corresponding destination file

The option `-p` is supported, but will preserve only timestamps, no other attributes of the source files in the destination ones.

The following options from the Linux version are not supported:

    -a|--archive     same as -dpR --preserve=all
    --attributes-only
          don't copy the file data, just the attributes
    --backup[=CONTROL]
          make a backup of each existing destination file
    -b               like --backup but does not accept an argument
    --copy-contents  copy contents of special files when recursive
    -l, --link       hard link files instead of copying
    --preserve[=ATTR_LIST]
          preserve the specified attributes (default: mode, ownership,
          timestamps), if possible additional attributes: context, links,
          xattr, all
    --no-preserve=ATTR_LIST
          don't preserve the specified attributes
    --parents        use full source file name under DIRECTORY
    --reflink[=WHEN]
          control clone/CoW copies. See below
    --remove-destination
          remove each existing destination file before attempting to
          open it (contrast with --force)
    --sparse=WHEN    control creation of sparse files. See below
    --strip-trailing-slashes
          remove any trailing slashes from each SOURCE argument
    -s, --symbolic-link
          make symbolic links instead of copying
    -S, --suffix=SUFFIX
          override the usual backup suffix
    -t, --target-directory=DIRECTORY
          copy all SOURCE arguments into DIRECTORY
    -T, --no-target-directory
          treat DEST as a normal file
    -u, --update     copy only when the SOURCE file is newer than the
                     destination file or when the destination file is missing

The option `-a` is supported, but will preserve only timestamps, no other attributes of the source files in the destination ones.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.  Add unit tests for any new or changed functionality. Lint and test your code using `npm test`.

## License

Copyright (c) 2022-2023 Ferdinand Prantl

Licensed under the MIT license.

[Node.js]: http://nodejs.org/
[NPM]: https://www.npmjs.com/
[PNPM]: https://pnpm.io/
[Yarn]: https://yarnpkg.com/
[ncp]: https://www.npmjs.com/package/ncp
[cpy-cli]: https://www.npmjs.com/package/cpy-cli
[cpx]: https://www.npmjs.com/package/cpx
[copyfiles]: https://www.npmjs.com/package/copyfiles
[cat.js]: https://www.npmjs.com/package/@unixcompat/cat.js
[ln.js]: https://www.npmjs.com/package/@unixcompat/ln.js
[mkdir.js]: https://www.npmjs.com/package/@unixcompat/mkdir.js
[mv.js]: https://www.npmjs.com/package/@unixcompat/mv.js
[rm.js]: https://www.npmjs.com/package/@unixcompat/rm.js
[POSIX documentation]: https://man7.org/linux/man-pages/man1/cp.1p.html
[Linux implementation]: https://man7.org/linux/man-pages/man1/cp.1.html
[`cp`]: https://nodejs.org/api/fs.html#fscpsrc-dest-options-callback
[`copyFile`]: https://nodejs.org/api/fs.html#fscopyfilesrc-dest-mode-callback
[node:fs]: https://nodejs.org/api/fs.html
[BASH patterns]: https://www.linuxjournal.com/content/pattern-matching-bash
