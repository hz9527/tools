import {Args} from '../types'

const Opts: {[prop: string]: Args} = {
  cwd: ['--cwd [cwd]', 'cwd of cmd', process.cwd()],
  path: ['-P, --path [path]', 'path of cmd', './'],
  target: ['-T, --target [path]', 'dist target path of cmd', './dist'],
  port: ['-p, --port [port]', 'server port', parseInt, 80],
  open: ['-o, --open', 'auto open browser'],
};

export default Opts
