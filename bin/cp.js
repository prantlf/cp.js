#!/usr/bin/env node

function help() {
  console.log(`${require('../package.json').description}

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
  $ cp.js -R /home/nick/clients /home/nick/customers`)
}

const { argv } = process
const args = []
let   force = false, clobbering = true, dereference = false, 
      preserveTimestamps = false, recursive = false, verbose, dry, cwd

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
        case 'H': case 'dereference':
          dereference = flag
          return
        case 'clobbering':
          clobbering = flag
          return
        case 'n':
          clobbering = !flag
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
          console.log(require('../package.json').version)
          process.exit(0)
          break
        case 'h': case 'help':
          help()
          process.exit(0)
      }
      console.error(`unknown option: "${arg}"`)
      process.exit(1)
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
  console.error('missing source and destination paths')
  process.exit(1)
}

const formatErr = ({ message }) => {
  if (message.startsWith('Target already exists: cp returned EEXIST (')) {
    message = `EEXIST: ${message.substring(43, message.lastIndexOf(') '))}`
  } else if (message.startsWith('Invalid src or dest: cp returned EINVAL (')) {
    message = `EINVAL: ${message.substring(41, message.lastIndexOf(') '))}`
  }
  return message
}

(async () => {
  const paths = []
  const files = []
  const patterns = args
    .slice(0, args.length - 1)
    .filter(src => {
      if (src.includes('*') || src.includes('?')) return true
      files.push(src)
    })
  if (patterns.length) {
    const glob = require('fast-glob', { cwd })
    if (verbose) console.log(patterns.join('\n'))
    paths.push(...await glob(patterns))
  }
  

  const { constants } = require('fs')
  const { access, cp, mkdir, stat } = require('fs/promises')
  const { basename, dirname, join } = require('path')

  const dest = args[args.length - 1]
  let destDir
  try {
    destDir = (await stat(dest)).isDirectory()
  } catch (err) {
    if (err.code !== 'ENOENT') throw err
  }

  const copy = async (paths, keepPath) => {
    for (const path of paths) {
      if (verbose) console.log(path)
      if (dry) continue
      const srcPath = cwd ? join(cwd, path) : path
      let destPath
      if (keepPath) {
        const srcDir = dirname(path)
        if (srcDir !== '.') await mkdir(join(dest, srcDir))
        destPath = join(dest, path)
      } else {
        destPath = destDir ? join(dest, basename(path)) : dest
      }
      try {
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
  }

  await copy(files, false)
  await copy(paths, true)
})().catch(err => {
  console.error(formatErr(err))
  process.exitCode = 1
})
