import {Args} from '../types'

const Opts: {[prop: string]: Args} = {
  cwd: ['--cwd [cwd]', 'cwd of cmd', process.cwd()],
  dir: ['-D, --dir [dir]', 'entry dir of cmd', './assets'],
  target: ['-T, --target [path]', 'dist target path of cmd', './dist'],
  port: ['-p, --port [port]', 'server port', parseInt, 80],
  open: ['-o, --open', 'auto open browser'],
  setting: ['-S, --setting', 'setting json/file for cmd', '"{}"']
};

export default Opts
