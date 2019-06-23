import * as fs from 'fs';
import * as SVGIcons2SVGFontStream from 'svgicons2svgfont';

type Infos = {name: string, unicode: string}[];

function getFileName(file: string) {
  return file.slice(file.lastIndexOf('/') + 1, file.lastIndexOf('.'))
}
const cache: {[prop: string]: true} = {}
const codes: number[] = []

function getItem(name: string) {
  let result = name;
  let i = 0;
  while (cache[result]) {
    result = name + (++i)
  }
  i = 0;
  while (codes[i] === 0xfff) {
    i++
  }
  codes[i] = codes[i] || -1;
  codes[i]++;
  const last = parseInt(codes[i].toString(16), 16).toString().padStart(3, '0')
  const unicode = Array.from({length: i}).map(i => '\uefff').join('') + `\\ue${last}`
  return {
    name: result,
    unicode
  }
}

function getSvgFont(files: string[], setting: any): Promise<Infos> {
  const fontStream = new SVGIcons2SVGFontStream({
    fontName: setting.name
  })
  return new Promise((resolve, reject) => {
    const result: Infos = [];
    fontStream
      .pipe(fs.createWriteStream(`${setting.target}/${setting.name}.svg`))
      .on('finish', () => {
        resolve(result)
      })
      .on('error', reject);
    
    files.forEach(file => {
      const item = fs.createReadStream(file);
      const info = getItem(getFileName(file));
      result.push(info)
      item.metadata = {
        unicode: [info.unicode],
        name: info.name
      };
      fontStream.write(item);
    })
  })
}

export default getSvgFont;