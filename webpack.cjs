const path = require('path')

module.exports = {
	mode: 'development',
	entry: {
		client: './client/client.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'static', 'js')
	},
	resolve: {
		alias: {
			common: path.resolve(__dirname, 'common')
		}
	},
	module: {
		rules: [{
			test: /.jsx?$/,
			loader: 'babel-loader'
		}]
	}
}
