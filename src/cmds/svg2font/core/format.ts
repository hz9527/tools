import * as fs from 'fs'
import * as svg2ttf from 'svg2ttf'

function transSvg(setting: any): void {
  const base = `${setting.target}/${setting.name}`;
  const ttf = svg2ttf(fs.readFileSync(`${base}.svg`, 'utf8'), {});
  fs.writeFileSync(`${base}.ttf`, Buffer.from(ttf.buffer));
}

export default transSvg;