import YAML from 'yaml'
import fs from 'fs'

export default (function () {

	let config = {}

	function load (path) {
		const file = fs.readFileSync(path, 'utf8')
		return config = YAML.parse(file)
	}

	function get (key, fallback = null) {
		let val = undefined
		try {
			val = key.split('.').reduce((obj, k) => obj[k], config)
		}
		finally {
			return val != undefined ? val : fallback
		}
	}

	return {
		load,
		get
	}
})()
