const common = require('./webpack.config.js')
common[0].mode = common[1].mode = 'production'
common[0].output = {filename: '../docs/dist/js/community.v1.min.js'}
common[1].output = {filename: '../docs/dist/js/data_handler.v1.min.js'}
module.exports = common
