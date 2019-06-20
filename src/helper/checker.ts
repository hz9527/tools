import { Config, ConfKeys } from "types";

// https://github.com/microsoft/TypeScript/issues/20503
// declare const Object: {
//   keys<T extends {}>(object: T): (keyof T)[];
// }

const confKeys: ConfKeys = {
  type: {type: String},
  desc: {type: String, defaultValue: ''},
  useOpts: {
    type: Array,
    defaultValue: [],
    check(opts): boolean {
      return opts.every((item): boolean => typeof item === 'string')
    }
  }
}

const Keys: (keyof ConfKeys)[] = Object.keys(confKeys);

// todo log
function isConfig(config: Config): config is Config {
  if (!config || typeof config !== 'object') {
    return false;
  }
  for (let i = 0, l = Keys.length; i < l; i++) {
    const field = Keys[i];
    const {type, defaultValue, check} = confKeys[field];
    if (config[field]) {
      let vaild = true;
      if (typeof check === 'function') {
        if (!(check as <T>(v: T) => v is T)(config[field]) // todo
          || config[field].constructor !== type) {
          vaild = false;
        }
      } else {
        if (config[field].constructor !== type) {
          vaild = false;
        }
      }
      if (!vaild) {
        if (defaultValue) {
          Object.assign(config, {key: defaultValue})
        } else {
          return false;
        }
      }
    } else if (defaultValue) {
      Object.assign(config, {key: defaultValue})
    } else {
      return false;
    }
  }
  return true;
}

export default isConfig