const path = require('path');
const trebor = require('trebor/plugin');
const resolve = require('rollup-plugin-node-resolve');

const outputs = [];
const plugins = [trebor()];
const ENV = process.env.BUILD;

if (ENV === 'test') {
  outputs.push({
    name: 'Test',
    format: 'umd',
    file: path.join(__dirname, 'test', 'script.js'),
    sourcemap: false
  });
  plugins.push(resolve());
} else {
  outputs.push({
    name: 'Router',
    format: 'es',
    file: path.join(__dirname, 'lib', 'router.esm.js'),
    sourcemap: false
  });
}

module.exports = {
  input: path.join(__dirname, ...(ENV === 'test' ? ['test', 'components', 'script.js'] : ['build/index.js'])),
  output: outputs,
  plugins: plugins
};
