/* eslint-disable @typescript-eslint/no-var-requires */
const glob = require('glob');
const fs = require('fs');
const {execSync} = require('child_process');

function autoMkdir(path, base) {
  const paths = path.split('/');
  let i = 0;
  let cur = base;
  while (i < paths.length) {
    cur += `/${paths[i++]}`
    if (!fs.existsSync(cur)) {
      execSync(`mkdir ${cur}`)
    }
  }
}

const CWD = process.cwd()

glob('cmds/*/templates/**', {cwd:  CWD + '/src'}, (err, files) => {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  const base = CWD + '/lib'
  files.forEach(file => {
    const [, path] = file.match(/(.+)\/[^\\/]+/);
    autoMkdir(path, base);
    execSync(`cp -f ./src/${file} ./lib/${file}`)
  })
})
