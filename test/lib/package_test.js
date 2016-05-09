const fs = require("fs");
const path = require("path");
const package = require('../../lib/package');

describe("lib/package", function() {
  describe(".addDependencies", function() {
    const root = process.cwd();
    const source = root + '/test/files/lib/package.json';
    const dest = root + '/redbeard_tests/package.json';

    console.log("root", root);
    console.log("source", source);
    console.log("dest", dest);
    console.log("__dirname", __dirname);

    // copy package.json to /redbeard_tests
    beforeEach(function(done) {
      return copyFile(source, dest, done);
    });

    afterEach(function(done) {
      fs.unlink(dest, done);
    });

    it("must add dependencies to file provided", function() {
      const moduleName = 'sweet_module';
      const version = '1.0.0';

      package.addDependencies(dest, {[moduleName]: version});
      const file = fs.readFileSync(dest, 'utf-8');
      const json = JSON.parse(file);

      const result = json.dependencies[moduleName];
      result.must.equal(version);
    });
  });
});

function copyFile(source, dest, done) {
  const readStream = fs.createReadStream(source);
  readStream.on('err', done);
  readStream.on('close', () => done());
  readStream.pipe(fs.createWriteStream(dest));
}
