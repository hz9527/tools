import * as fs from 'fs'
import { execSync } from 'child_process'
import * as alias from './config.json'

import {Args} from '../../types'

interface AliasValue {template: string; fileName?: string}

interface AliasType {
  [prop: string]: string | AliasValue;
}

const Alias: AliasType = alias

const aliasKeys = Object.keys(alias)

function getName(template: string): string {
  return aliasKeys.find((name): boolean =>
    Alias[name] === template || (Alias[name] as AliasValue).template === template)
  || template
}

const temDir = __dirname + '/templates'

const allTemplates = fs.readdirSync(temDir).map((item): string => {
  return getName(item)
})

export default {
  type: 'create',
  name: 'tem',
  beforeRegiste(useOpts: string[]): [string, Args][] {
    if (useOpts.includes('name')) {
      return null;
    }
    return [
      ['name', ['-n, --name [temName...]', 'name of cmd(split with ",")', 'gitignore']]
    ]
  },
  useOpts: ['cwd'],
  exec({name, cwd}: {[prop: string]: string}): Promise<void> {
    return new Promise((resolve): void => {
      const names = name.split(',').map((item): string => item.trim())
      names.forEach((tem): void => {
        let template: string = tem
        let fileName: string = tem
        const value = Alias[tem]
        if (value) {
          template = typeof value === 'object' ? value.template : value;
          fileName = typeof value === 'object' ? (value.fileName || value.template) : value;
        }
        execSync(`cp ${temDir}/${template} ${cwd}/${fileName}`)
      })
      resolve()
    })
  },
  desc: `生成纯模板，-n ${allTemplates.join(',')}`
}