const { deprecationNotice } = require('../deprecation');
const { builder, handler } = require('../../cml/tensorboard/connect');

exports.command = 'tensorboard-dev';
exports.description = false;
exports.handler = handler;
exports.builder = deprecationNotice({
  builder,
  notice:
    '"cml tensorboard-dev" is deprecated, please use "cml tensorboard connect"'
});
