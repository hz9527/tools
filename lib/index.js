"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
const checker_1 = require("./helper/checker");
const loger_1 = require("./helper/loger");
const defaultOpts_1 = require("./helper/defaultOpts");
const SingleName = 'default';
class OptConfig {
    constructor(name, args) {
        this.name = name;
        this.users = {};
        this.args = args;
    }
    addUser(type, user) {
        if (!this.users[type]) {
            this.users[type] = [];
        }
        this.users[type].push(user);
    }
}
class Registor {
    constructor(types = []) {
        this.types = {};
        types.forEach((item) => this.registerType(...item));
        this.options = {};
    }
    addOption(name, args) {
        if (this.options[name]) {
            loger_1.error(`${name} options existed`);
            return;
        }
        this.options[name] = new OptConfig(name, args);
    }
    registerType(...args) {
        let [type, desc, isSingle] = args;
        if (!desc) {
            desc = '';
            loger_1.warn(`regist command ${type} desc is empty`);
        }
        if (this.types[type]) {
            loger_1.error(`command ${type} has exist`);
            return;
        }
        this.types[type] = { desc, isSingle, data: [] };
    }
    register(config) {
        const { type, typeDesc, isSingle = false, beforeRegiste, rewrite, useOpts = [], ...opt } = config;
        if (isSingle) {
            opt.name = SingleName;
        }
        if (!this.types[type]) {
            this.registerType(type, typeDesc, isSingle);
        }
        else if (!rewrite && this.types[type].data.some((item) => item.name === opt.name)) {
            loger_1.error(`${type} ${opt.name} has registed`);
            return;
        }
        if (isSingle && this.types[type].data.length) {
            this.types[type].data.length = 0;
        }
        const opts = typeof beforeRegiste === 'function' ? beforeRegiste(Object.keys(this.options)) : null;
        const uses = useOpts.slice();
        if (opts) {
            opts.forEach(([name, args]) => {
                this.addOption(name, args);
                uses.push(name);
            });
        }
        Array.from(new Set(uses)).forEach((optName) => {
            if (this.options[optName]) {
                this.options[optName].addUser(type, opt.name);
            }
            else {
                loger_1.error(`${optName} not exist`);
            }
        });
        this.types[type].data.push(opt);
    }
    start() {
        Object.keys(defaultOpts_1.default).forEach((name) => this.addOption(name, defaultOpts_1.default[name]));
        return new Promise((resolve, reject) => {
            glob('./cmds/*/index.js', { cwd: path.resolve(__dirname) }, (err, files) => {
                err ? reject(err) : resolve(files);
            });
        }).then((files) => {
            files.forEach((file) => {
                const pkg = require(file).default;
                let config = typeof pkg === 'function' ? pkg() : pkg;
                config = checker_1.default(config) ? config : null;
                config && this.register(config);
            });
        });
    }
    getCmds() {
        return Object.keys(this.types)
            .map((name) => [name, this.types[name].desc, this.types[name].isSingle]);
    }
    getOptions(type) {
        return Object.keys(this.options).map((opt) => {
            const { users } = this.options[opt];
            if (users[type]) {
                return this.options[opt].args;
            }
            return null;
        }).filter((item) => !!item);
    }
    getExector(cmd, type) {
        const { data, isSingle } = this.types[cmd];
        let exector;
        if (isSingle) {
            exector = data[0];
        }
        else {
            exector = data.find((item) => item.name === type);
        }
        return exector
            ? exector.exec
            : () => Promise.resolve();
    }
}
exports.default = Registor;
//# sourceMappingURL=index.js.map