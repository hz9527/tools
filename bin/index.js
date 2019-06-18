#! /usr/bin/env node
const {version} = require('../package.json')
const program = require('commander')

const Creators = [
  'rollup',
  'node-esm',
  'release',
  'changlog',
  'lint'
]

const Servers = []
const options = {
  source: {
    args: [],
    creators: [],
    servers: []
  }
}

program
  .version(version)
  .description('a useful tool for you')

program
  .command('create <tem>', 'create script or template', {})

program.parse(process.argv)