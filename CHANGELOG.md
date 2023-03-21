# [3.0.0](https://github.com/prantlf/cp.js/compare/v2.0.1...v3.0.0) (2023-03-21)


### Bug Fixes

* Rename the bin script to cp-j ([c3ba24d](https://github.com/prantlf/cp.js/commit/c3ba24da2904e4615c35952f7f77c29bace99ea1))


### BREAKING CHANGES

* The name of the executable changed from "cp.js" to "cp-j". I'm sorry
for that, but Windows mistake the suffix ".js" to a file extension and try execute it.
NPM creates the original file name too, probably to support Cygwin.

## [2.0.1](https://github.com/prantlf/cp.js/compare/v2.0.0...v2.0.1) (2023-03-05)


### Bug Fixes

* Use .mjs extension to enforce the module type ([b94abda](https://github.com/prantlf/cp.js/commit/b94abdaa6cf86ef082da058c1f27949e44d0b3a5))

# [2.0.0](https://github.com/prantlf/cp.js/compare/v1.0.0...v2.0.0) (2023-01-29)


### Bug Fixes

* Fix -H argument, add other missing arguments ([711689d](https://github.com/prantlf/cp.js/commit/711689de3e457407bab378c5e7621d43c8352216))


### BREAKING CHANGES

* The argument `-H` dereferences only symlinks supplied on the command-line. Not symlinks found in the subdirectories any more. If you want to dereference all symlinks, use the argument `L`. Also, if an argument ends with a slash (/), its children will be copied instead. If you want to copy the whole directory, do not end its name on the command line by a slash (/).

## 1.0.0

Initial release.
