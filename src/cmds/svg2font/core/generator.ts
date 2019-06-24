import * as fs from "fs";
import getHeader from '../helper/xml'

type Infos = {name: string; unicode: string}[];
const iconPrefix = 'icon-';
const fontPostfix = '-iconfont';

function write(file: string, str: string): Promise<void> {
  return new Promise((resolve, reject): void => {
    fs.writeFile(file, str, (err): void => {
      console.log(err)
      err ? reject(err) : resolve()
    });
  })
}

function genBaseCss(setting: any): Promise<void> {
  const {miniprogram, target, name} = setting;
  const base = `${target}/${name}`;
  return new Promise((resolve, reject): void => {
    if (miniprogram) {
      fs.readFile(`${base}.ttf`, (err, fd): void => {
        err ? reject(err)
          : resolve(`data:application/x-font-ttf;base64,${fd.toString('base64')}`);
      })
    } else {
      resolve()
    }
  }).then((data): string => {
    const now = Date.now();
    let str = '';
    if (data) {
      str = `url(${data}) format('truetype');`
    } else {
      str = `
        url('${name}.ttf?t=${now}') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
        url('${name}.svg?t=${now}#iconfont') format('svg'); /* iOS 4.1- */`;
    }
    return `@font-face {
      font-family: "${name}";
      src: ${str}
    }
    
    .${name}${fontPostfix} {
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
    }`
  }).then((str): Promise<void> => write(`${target}/iconfont-base.css`, str))
}

function genStyle(infos: Infos, setting: any): Promise<void> {
  const {target, name} = setting;
  const str = `
  ${infos.map((info): string => `
  .${iconPrefix}${info.name}:before {
    font-family: ${name};
    -webkit-font-smoothing: antialiased;
    content: '${info.unicode.replace('\\u', '\\')}';
  }
  `).join('\n')}`
  return write(`${target}/icons.css`, str);
}

function genHtml(infos: Infos, setting: any): Promise<void> {
  const {target, name: fontName} = setting;
  const html = `
  <!DOCTYPE html>
  <html>
    ${getHeader(setting)}
  <body>
    <div class="container">
    ${infos.map(({name, unicode}): string => `<div class="item">
      <div class="show-code ${fontName}${fontPostfix}">${unicode.replace(/\\u/g, '&#x')};</div>
      <div class="show-class ${iconPrefix}${name}"></div>
      <div class="text">iconName: ${name}</div>
      <div class="text">class: ${iconPrefix}${name}</div>
      <div class="text">unicode: &amp;${unicode.replace(/\\u/g, '#x')};</div>
    </div>`).join('')}
    </div>
  </body>
  <html>
  `;
  return write(`${target}/demo.html`, html);
}

function generator(infos: Infos, setting: any): Promise<void []> {
  return Promise.all([
    genBaseCss(setting),
    genStyle(infos, setting),
    genHtml(infos, setting)
  ])
}

export default generator;