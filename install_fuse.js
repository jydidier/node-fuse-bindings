const util = require('util');
const path = require('path');
const fs = require('fs');
const homeDir = require('os').homedir();
const fuseLocal = path.join(homeDir, '.stealifyfs', 'fuse_bindings.node');

const exec = util.promisify(require('child_process').exec);

function installFuse() {
  switch (process.platform) {
    case 'win32':
      //https://github.com/dokan-dev/dokany/releases/download/v2.0.4.1000/Dokan_x86.msi x64
      var dokanLocal = path.join(homeDir, '.stealifyfs', 'Dokan_x64.msi');

      if(!fs.existsSync(dokanLocal)) {
            // fs.writeFileSync(dokanLocal, fs.readFileSync(dokanFromBin));
      }

      return exec('msiexec.exe /i ' + dokanLocal + ' /quiet /qn /norestart');
    break;

    case 'darwin':
      // github.com/frank-dspeed/macfuse-pkg
      var osxfuseFromBin = ;
      var osxfuseLocal = path.join(homeDir, '.stealifyfs', 'osxfuse.pkg');

      if(!fs.existsSync(osxfuseLocal)) {
        fs.writeFileSync(osxfuseLocal, fs.readFileSync(osxfuseFromBin));
      }

      return exec('installer -pkg ' + osxfuseLocal + ' -target /Applications');

    default:
    case 'linux':
      return Promise.resolve();
    //skip install, lets asume we have fuse support built in into the kernel
  }
}

switch (process.platform) {
  case 'win32':
    var fuseFromBin = 'node_modules/fuse-bindings/build/Release/fuse_bindings.node';
    break;

  case 'darwin':
    var fuseFromBin = 'node_modules/fuse-bindings/build/Release/fuse_bindings.node';
  break;

  case 'linux':
  default:
    var fuseFromBin = 'node_modules/fuse-bindings/prebuilds/linux-x64/node-57.node';
}


fs.mkdirSync(path.dirname(fuseLocal), { recursive: true, mode: '0755' }, true);
if(!fs.existsSync(fuseLocal)) {
  fs.writeFileSync(fuseLocal, fs.readFileSync(fuseFromBin));
}

function verifyFuse(): boolean {
  switch (process.platform) {
    case 'win32':
      var fuse = '';
      if(!fs.existsSync(fuse)) {
        //https://github.com/dokan-dev/dokany/releases/download/v2.0.4.1000/DokanSetup.exe
        //https://github.com/dokan-dev/dokany/releases/download/v2.0.4.1000/DokanSetupDbg.exe
        console.log("stealifyfs requires dokany, either download it from: https://github.com/dokan-dev/dokany/releases or use the installFuse() method ");
        return false;
      }

      break;

    case 'darwin':
      var fuse = '/usr/local/lib/libosxfuse.2.dylib';
      if(!fs.existsSync(fuse)) {
        console.log("stealifyfs requires osxfuse, either download it from: https://github.com/osxfuse/osxfuse/releases or use the installFuse() method");
        return false;
      }
    break;

    case 'linux':
    default:
      var fuse = '/usr/lib/x86_64-linux-gnu/libfuse.so';
      if(!fs.existsSync(fuse)) {
        console.log("stealifyfs requires fuse support, install libfuse-dev from your distribution mirrors.");
        return false;
      }
  }

  return true;
}
