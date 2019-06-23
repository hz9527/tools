import * as fs from 'fs'
import * as path from 'path'
import * as svg2ttf from 'svg2ttf'

function transSvg(setting: any) {
  const base = `${setting.target}/${setting.name}`
  const ttf = svg2ttf(fs.readFileSync(`${base}.svg`, 'utf8'), {});
  fs.writeFileSync(`${base}.ttf`, new Buffer(ttf.buffer));
}

export default transSvg;