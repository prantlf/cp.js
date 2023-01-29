# [2.0.0](https://github.com/prantlf/cp.js/compare/v1.0.0...v2.0.0) (2023-01-29)


### Bug Fixes

* Fix -H argument, add other missing arguments ([711689d](https://github.com/prantlf/cp.js/commit/711689de3e457407bab378c5e7621d43c8352216))


### BREAKING CHANGES

* The argument `-H` dereferences only symlinks supplied on the command-line. Not symlinks found in the subdirectories any more. If you want to dereference all symlinks, use the argument `L`. Also, if an argument ends with a slash (/), its children will be copied instead. If you want to copy the whole directory, do not end its name on the command line by a slash (/).

## 1.0.0

Initial release.
