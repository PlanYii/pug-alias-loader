const path = require("path");
const pug = require("pug");

module.exports = function (source) {
  const options = this.getOptions();
  const alias = this._compiler.options.resolve.alias;

  const filename = path.relative(process.cwd(), this.resourcePath);

  for(let key in alias) {
    if (key === '@') {
      continue;
    }
    const reg = new RegExp(`${key}\/[\\w-\/\\.]+`, 'g')
    if (reg.test(source)) {
      const _resPath = path.relative(path.resolve(filename, ".."), path.relative(process.cwd(), alias[key]))
      source = source.replace(reg, (match) => {
        const exts = match.split('.')
        const _includePath = match.replace(key, '')
        const _matchPath = exts.length === 2 ? path.join(_resPath, _includePath) : path.join(_resPath, _includePath, '/index.pug');
        return _matchPath.replace(/\\/g, '/')
      });
    }
  }
  let html = ''
  try {
    const template = pug.compile(
      source,
      Object.assign(options, {
        compileDebug: this.debug || false,
        filename: filename,
      })
    );
    html = template(options.data || {});
  } catch (error) {
    console.log('compile-error================', error)
    html = source
  }
  return html;
  // const template = pug.compileClient(
  //   source,
  //   Object.assign(options, {
  //     compileDebug: this.debug || false,
  //     filename: filename,
  //   })
  // );
  // return template + "\n module.exports = template";
};
