import { error } from '../helper/loger';
import { Args, Config, Exector } from '../types';

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

class Registor {
  types: {[prop: string]: Exector[]}

  options: {[prop: string]: OptConfig}

  constructor(types = []) {
    this.types = types.reduce((res, key): object => {
      res[key] = [];
      return res;
    }, {});
    this.options = {};
  }

  addOption(name: string, args: Args): void {
    if (this.options[name]) {
      error(`${name} options existed`)
      return
    }
    this.options[name] = new OptConfig(name, args);
  }

  register(config: Config): void {
    const {type, beforeRegiste, rewrite, useOpts = [], ...opt} = config;
    if (!this.types[type]) {
      this.types[type] = [];
    } else if (!rewrite && this.types[type].find((item): boolean => item.name === opt.name)) {
      error(`${type} ${opt.name} has registed`)
      return
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
    this.types[type].push(opt)
  }
}

export default Registor;
