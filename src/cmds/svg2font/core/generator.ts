import * as fs from "fs";

type Infos = {name: string, unicode: string}[];
const iconPrefix = 'icon-';
const fontPostfix = '-iconfont';

function write(file: string, str: string) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, str, err => err ? reject(err) : resolve());
  })
}

function genBaseCss(setting: any) {
  const {miniprogram, target, name} = setting;
  const base = `${target}/${name}`;
  return new Promise((resolve, reject) => {
    if (miniprogram) {
      fs.readFile(`${base}.ttf`, (err, fd) => {
        err ? reject(err)
          : resolve(`data:application/x-font-ttf;base64,${fd.toString('base64')}`);
      })
    } else {
      resolve()
    }
  }).then(data => {
    const now = Date.now();
    let str = '';
    if (data) {
      str = `url(${data}) format('truetype');`
    } else {
      str = `
        url('${base}.woff?t=${now}') format('woff'),
        url('${base}.ttf?t=${now}') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
        url('${base}.svg?t=${now}#iconfont') format('svg'); /* iOS 4.1- */`;
    }
    return `@font-face {
      font-family: "${name}";
      src: url('iconfont.eot?t=1561278124095'); /* IE9 */
      src: ${str}
    }
    
    .${name}${fontPostfix} {
      font-family: "iconfont" !important;
      font-size: 16px;
      font-style: normal;
    }`
  }).then(str => write(`${base}/iconfont-base.css`, str))
}

function genStyle(infos: Infos, setting: any) {
  const {target, name} = setting;
  const base = `${target}/${name}`;
  const str = `${infos.map(info => `
  .${iconPrefix}${info.name}:before {
    font-family: ${name};
    content: '${info.unicode}';
  }
  `)}`
  return write(`${base}/icons.css`, str);
}

function genHtml(infos: Infos, setting: any) {
  const {target, name: fontName} = setting;
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8"/>
    <title>${fontName} Demo</title>
    <link rel="stylesheet" href="./iconfont-base.css">
    <link rel="stylesheet" href="./icons.css">
    <style></style>
  </head>
  <body>
    <div>
    ${infos.map(({name, unicode}) => `<div class="item">
      <div class="${fontName}${fontPostfix}">${unicode.replace(/\\u/g, '&#')};</div>
      <div class="${iconPrefix}${name}">${unicode.replace(/\\u/g, '&#')};</div>
      <div class="name">iconName: ${name}</div>
      <div class="content">${unicode.replace(/\\u/g, '&#')};</div>
    </div>`)}
    </div>
  </body>
  <html>
  `
  return write(`${target}/demo.html`, html);
}

function generator(infos: Infos, setting: any) {
  return Promise.all([
    genBaseCss(setting),
    genStyle(infos, setting),
    genHtml(infos, setting)
  ])
}

export default generator;