#! /usr/bin/env node

/* eslint-disable */
const {version} = require('../package.json')
const program = require('commander')
const Register = require('../lib/index').default

const register = new Register([
  ['create', 'create template for your project', false],
  ['server', 'create server to do something', false],
  ['regist', 'create template for your project', true],
])

register.start()
  .then(() => {
    program
      .version(version)
      .description('a useful tool for you');

    register.getCmds().forEach(([cmd, desc, isSingle]) => {
      register.getOptions(cmd).reduce(
        (pro, args) => pro.option(...args),
        program.command(`${cmd}${isSingle ? '' : ' <opt>'}`)
          .description(desc)
      ).action((opt) => {
        console.log(opt)
      })
    })
    program.command('test')
      .action((cmd, opt) => {
        console.log(777)
      })
    program.parse(process.argv)
  })