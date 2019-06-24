import exec from './core/index'

export default {
  type: 'create',
  name: 'svg2font',
  useOpts: ['cwd', 'dir', 'target', 'open', 'setting'],
  exec,
  desc: "setting: {name: iconfont, deep: true, miniprogram: true}, you can use setting replace cwd and so on"
}