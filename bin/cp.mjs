#!/usr/bin/env node

import { access, cp, mkdir, readdir, realpath, stat } from 'fs/promises'
import { constants, readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { basename, dirname, join } from 'path'

function getPackage() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  return JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
}

function help() {
  console.log(`${getPackage().description}

Usage: cp-j [-DfHLnPpRrv] [--] src... dest

Options:
  -c|--cwd <dir>              directory to start looking for the source files
  -D|--dry-run                only print paths of source files or directories
  -a|--archive                the same as -dpR
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
  $ cp-j -R /home/nick/clients/ /home/nick/customers`)
}

const { argv } = process
const args = []
let   force = false, clobbering = true, dereference = false,
      dereferenceArgs = false, preserveTimestamps = false,
      recursive = false, verbose, dry, cwd

function fail(message) {
  console.error(message)
  process.exit(1)
}

for (let i = 2, l = argv.length; i < l; ++i) {
  const arg = argv[i]
  const match = /^(-|--)(no-)?([a-zA-Z][-a-zA-Z]*)(?:=(.*))?$/.exec(arg)
  if (match) {
    const parseArg = (arg, flag) => {
      switch (arg) {
        case 'c': case 'cwd':
          cwd = match[4] || argv[++i]
          return
        case 'D': case 'dry-run':
          dry = flag
          return
        case 'f': case 'force':
          force = flag
          return
        case 'H': case 'dereference-args':
          dereferenceArgs = flag
          dereference = false
          return
        case 'L': case 'dereference':
          dereference = flag
          dereferenceArgs = flag
          return
        case 'clobbering':
          clobbering = flag
          return
        case 'n':
          clobbering = !flag
          return
        case 'd': case 'P':
          dereference = false
          dereferenceArgs = false
          return
        case 'p': case 'preserve':
          preserveTimestamps = flag
          return
        case 'R': case 'r': case 'recursive':
          recursive = flag
          return
        case 'v': case 'verbose':
          verbose = flag
          return
        case 'V': case 'version':
          console.log(getPackage().version)
          process.exit(0)
          break
        case 'h': case 'help':
          help()
          process.exit(0)
      }
      fail(`unknown option: "${arg}"`)
    }
    if (match[1] === '-') {
      const flags = match[3].split('')
      for (const flag of flags) parseArg(flag, true)
    } else {
      parseArg(match[3], match[2] !== 'no-')
    }
    continue
  }
  if (arg === '--') {
    args.push(...argv.slice(i + 1, l))
    break
  }
  args.push(arg)
}

if (args.length < 2) {
  help()
  process.exit(1)
}

let arg
const formatMessage = ({ code, message }) => {
  /* c8 ignore next 2 */
  if (code === 'EISDIR' || code === 'ERR_FS_EISDIR') {
    message = `EISDIR: "${arg}" is a directory`
  } else if (code === 'EEXIST' || code === 'ERR_FS_CP_EEXIST') {
    message = `EEXIST: "${arg}" already exists`
  /* c8 ignore next 5 */
  } else if (code === 'EINVAL' || code === 'ERR_FS_CP_EINVAL') {
    message = `EINVAL: "${arg}" is invalid`
  } else if (code === 'ENOENT') {
    message = `ENOENT: "${arg}" does not exist`
  }
  return message
}

try {
  const paths = []
  const files = []
  const patterns = args
    .slice(0, args.length - 1)
    .filter(src => {
      if (src.includes('*') || src.includes('?')) return true
      files.push(src)
    })
  if (patterns.length) {
    const glob = (await import('fast-glob')).default
    if (verbose) console.log(patterns.join('\n'))
    paths.push(...await glob(patterns, {
      cwd, extglob: true, dot: true, onlyFiles: false, markDirectories: true,
      followSymbolicLinks: !!(dereference || dereferenceArgs)
    }))
  }

  const dest = args[args.length - 1]
  let destDir
  try {
    destDir = (await stat(dest)).isDirectory()
  } catch (err) {
    /* c8 ignore next */
    if (err.code !== 'ENOENT') throw err
  }

  const copyOne = async (srcPath, destPath) => {
    try {
      arg = srcPath
      await cp(srcPath, destPath, {
        force: false, errorOnExist: true, dereference, preserveTimestamps, recursive
      })
    } catch (err) {
      if (err.code === 'ERR_FS_CP_EEXIST' && clobbering) {
        if (!force) await access(destPath, constants.W_OK)
        await cp(srcPath, destPath, { dereference, preserveTimestamps, recursive })
      } else {
        throw err
      }
    }
  }

  const copyAll = async (paths, keepPath) => {
    for (const path of paths) {
      if (verbose) console.log(path)
      if (dry) continue
      const srcPath = cwd ? join(cwd, path) : path
      if (recursive && srcPath.endsWith ('/') || srcPath.endsWith ('\\')) {
        const children = await readdir(srcPath, { withFileTypes: true })
        if (!destDir) {
          await mkdir(dest)
          destDir = true
        }
        for (const child of children) {
          const { name } = child
          await copyOne(join(srcPath, name), join(dest, name))
        }
      } else {
        const srcReal = !dereference && dereferenceArgs ?
          await realpath(srcPath) : srcPath
        const destPath = recursive && keepPath ? join(dest, path) :
            destDir ? join(dest, basename(path)) : dest
        await copyOne(srcReal, destPath)
      }
    }
  }

  await copyAll(files, false)
  await copyAll(paths, true)
} catch(err) {
  console.error(formatMessage(err))
  process.exitCode = 1
}
