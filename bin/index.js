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
        program.command(`${cmd}${isSingle ? '' : ' <type>'}`)
          .description(desc)
      ).action(async (typeOrData, data) => {
        const exec = register.getExector(cmd, isSingle ? null : typeOrData)
        await exec(isSingle ? typeOrData : data)
      }).on('--help', function(){
        console.log('')
        console.log(cmd, 'help')
      });
    })

    program.parse(process.argv)
  })