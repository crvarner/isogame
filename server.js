import express from 'express'
import path from 'path'
import ejs from 'ejs'

import config from './server/config'
import utils from './common/utils'

config.load(path.resolve('/etc', 'isogame', 'isogame.yml'))

const app = express()
app.engine('.html', ejs.__express)
app.set('views', path.resolve(__dirname, 'views'))
app.use('/static', express.static('static'))


app.get('/', (req, res) => {
	console.log(config.get('test'))
	res.render("index.html")
})


app.listen(3000)
