import * as glob from 'glob';
import {execSync} from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export default {
  type: 'regist',
  useOpts: ['dir', 'cwd'],
  exec({cwd, dir}: {[prop: string]: string}): Promise<void> {
    return new Promise((resolve, reject): void => {
      glob(`${dir}/*/index.js`, {cwd}, (err, files): void => {
        err ? reject(err) : resolve(files)
      })
    }).then((files): void => {
      (files as string[]).forEach((file): void => {
        const dir = path.resolve(cwd, file, '..')
        let dirName = dir.slice(dir.lastIndexOf('/') + 1)
        const cmdsDir = path.resolve(__dirname, '../')
        let i = 0
        while (fs.existsSync(`${cmdsDir}/dirName`)) {
          dirName += (++i)
        }
        execSync(`cp -r ${dir}/* ${cmdsDir}/${dirName}`)
      })
    })
  },
  isSingle: true,
  desc: '用于注册指令，当 dir 选项 目录下 有多个 目录，每个目录都将被作为 指令注册'
}