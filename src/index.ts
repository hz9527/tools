// import path from 'path';
import * as glob from 'glob';
import * as path from 'path';
import isConfig from './helper/checker';
import { error, warn } from './helper/loger';
import DefaultOpts from './helper/defaultOpts';
import { Args, Config, CmdArg, CmdData, CmdPkg } from './types';

const SingleName = 'default';
class OptConfig {
  name: string;

  users: {[name: string]: string[]};

  args: Args;

  constructor(name: string, args: Args) {
    this.name = name;
    this.users = {};
    this.args = args;
  }

  addUser(type: string, user: string): void {
    if (!this.users[type]) {
      this.users[type] = [];
    }
    this.users[type].push(user);
  }
}

interface Types {[prop: string]: CmdData}
class Registor {
  types: Types

  options: {[prop: string]: OptConfig}

  constructor(types: CmdArg[] = []) {
    this.types = {};
    types.forEach((item): void => this.registerType(...item));
    this.options = {};
  }

  private addOption(name: string, args: Args): void {
    if (this.options[name]) {
      error(`${name} options existed`)
      return
    }
    this.options[name] = new OptConfig(name, args);
  }

  private registerType(...args: CmdArg): void {
    let [type, desc, isSingle] = args;
    if (!desc) {
      desc = ''
      warn(`regist command ${type} desc is empty`)
    }
    if (this.types[type]) {
      error(`command ${type} has exist`)
      return;
    }
    this.types[type] = {desc, isSingle, data: []}
  }

  private register(config: Config): void {
    const {type, typeDesc, isSingle = false, beforeRegiste, rewrite, useOpts = [], ...opt} = config;
    if (isSingle) {
      opt.name = SingleName
    }
    if (!this.types[type]) {
      this.registerType(type, typeDesc, isSingle);
    } else if (!rewrite && this.types[type].data.some((item): boolean => item.name === opt.name)) {
      error(`${type} ${opt.name} has registed`)
      return
    }
    if (isSingle && this.types[type].data.length) {
      this.types[type].data.length = 0;
    }
    const opts = typeof beforeRegiste === 'function' ? beforeRegiste() : null;
    if (opts) {
      opts.forEach(([name, args]): void => {
        this.addOption(name, args)
      })
    }
    useOpts.forEach((optName): void => {
      if (this.options[optName]) {
        this.options[optName].addUser(type, opt.name)
      } else {
        error(`${optName} not exist`)
      }
    })
    this.types[type].data.push(opt);
  }

  public start(): Promise<void> {
    Object.keys(DefaultOpts).forEach((name): void => this.addOption(name, DefaultOpts[name]))
    return new Promise((resolve, reject): void => {
      glob(
        './cmds/*/index.js',
        {cwd: path.resolve(__dirname)},
        (err: Error, files: string[]): void => {
          err ? reject(err) : resolve(files)
        }
      )
    }).then((files): void => {
      // read files & init
      (files as string[]).forEach((file): void => {
        const pkg: CmdPkg = require(file).default as CmdPkg; // eslint-disable-line import/no-dynamic-require
        let config: Config = typeof pkg === 'function' ? pkg() : pkg;
        // config = isConfig(config) ? config : null;
        console.log(config)
        config && this.register(config);
      })
    })
  }

  public getCmds(): CmdArg[] {
    return Object.keys(this.types)
      .map((name): CmdArg => [name, this.types[name].desc, this.types[name].isSingle])
  }

  public getOptions(type: string): Args[] {
    return Object.keys(this.options).map((opt: string): Args => {
      const {users} = this.options[opt];
      if (users[type]) {
        return this.options[opt].args; // todo can stat cmd arg
      }
      return null;
    }).filter((item): boolean => !!item)
  }

  public exec() {

  }
}

export default Registor;
