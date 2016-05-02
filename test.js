const exec = require('child_process').execSync;
const bandname = require("bandname");
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const path = require('path');
const os = require('os');

const randomstring = () => bandname().replace(' ', '_').replace(/-/g, '_');

var dir;
if (process.env.SLOW_TEST) {
  dir = path.join(os.tmpdir(), 'redbeard_tests', randomstring());
} else {
  dir = path.join(__dirname, 'redbeard_tests', randomstring());
}

mkdirp.sync(dir);

const opts = {cwd: dir, stdio: 'inherit'};
const index = path.join(__dirname, 'index.js');

const appName = 'redbeard_tests_'+randomstring();
const controllerName = randomstring();
const userName = randomstring()+'_user';

exec(['node', index, 'base', appName].join(' '), opts);
if (process.env.SLOW_TEST) exec(['npm', 'install'].join(' '), opts);
exec(['node', index, 'user', userName].join(' '), opts);
exec(['node', index, 'controller', controllerName, '-r', userName].join(' '), opts);
exec(['node', index, 'cors'].join(' '), opts);
exec(['npm', 'test'].join(' '), opts);

rimraf.sync(dir);
