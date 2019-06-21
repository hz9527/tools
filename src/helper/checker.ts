import { Config, ConfKeys, ObjectExpandKeys } from "types";

const confKeys: ConfKeys = {
  type: {type: String},
  desc: {
    type: String,
    defaultValue: '',
    check(desc, config): boolean {
      if (config.isSingle === true) {
        return true;
      }
      return typeof desc === 'string'
    }
  },
  useOpts: {
    type: Array,
    defaultValue: [],
    check(opts): boolean {
      return opts.every((item): boolean => typeof item === 'string')
    }
  }
}

const Keys: (keyof ConfKeys)[] = (Object as ObjectExpandKeys).keys(confKeys);

// todo log
function isConfig(config: Config): config is Config {
  if (!config || typeof config !== 'object') {
    return false;
  }
  for (let i = 0, l = Keys.length; i < l; i++) {
    const field = Keys[i];
    const {type, defaultValue, check} = confKeys[field];
    const checker = (check as <T>(v: T, config: Config) => v is T)
    if (config[field]) {
      let vaild = true;
      if (typeof check === 'function') {
        if (!checker(config[field], config)) {
          vaild = false;
        }
      } else if (config[field].constructor !== type) {
        vaild = false;
      }
      if (!vaild) {
        if (defaultValue) {
          Object.assign(config, {key: defaultValue})
        } else {
          console.log(`${field} is invaild`)
          return false;
        }
      }
    } else if (defaultValue) {
      Object.assign(config, {key: defaultValue})
    } else {
      if (typeof check === 'function' && checker(undefined, config)) {
        continue;
      }
      console.log(`${field} is required`);
      return false;
    }
  }
  return true;
}

export default isConfig