import * as path from 'path';
import * as glob from 'glob';
import getSvgFont from './svg2svgs';
import transSvg from './format';
import generator from './generator';

type Infos = {name: string; unicode: string}[];

const defaultSetting = {
  name: 'iconfont',
  miniprogram: true,
  deep: true
}

function getSvgs(cwd: string, dir: string, deep: boolean): Promise<string []> {
  return new Promise((resolve, reject): void => {
    glob(`${dir}/${deep ? '**' : '*'}.svg`, {cwd}, (err, files): void => {
      err ? reject(err) : resolve(files)
    })
  })
}

function exec(opt: { [prop: string]: string }): Promise<void> {
  let { cwd, dir, target, open, setting: settingJson = '{}' } = opt;
  const setting: { [prop: string]: any } = {
    ...defaultSetting,
    ...JSON.parse(settingJson)
  }
  cwd = setting.cwd || cwd;
  dir = setting.dir || dir;
  target = setting.target || target;
  open = typeof setting.open === 'boolean' ? setting.open : !!open;
  // 获取所有svg
  // 将 svg 转 svg 字体
  // svg 转 ttf
  // ttf 转其他字体
  // 生成 html
  let data: Infos = [];
  return getSvgs(cwd, dir, setting.deep)
    .then((files): Promise<Infos> => {
      setting.target = path.resolve(cwd, target)
      return getSvgFont(
        files.map(f => path.resolve(cwd, f)),
        setting
      )
    }).then((infos): void => {
      data = infos;
      return transSvg(setting);
    }).then((): Promise<void []> => generator(data, setting))
    .then((): void => {
      // open chrome
    })
}

export default exec;