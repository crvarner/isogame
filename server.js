import express from 'express'
import path from 'path'
import ejs from 'ejs'

import utils from './common/utils'


const app = express()
app.engine('.html', ejs.__express)
app.set('views', path.resolve(__dirname, 'views'))
app.use('/static', express.static('static'))


app.get('/', (req, res) => {
	res.render("index.html")
})

app.get('/edit', (req, res) => {
	res.render("editor.html")
})


app.listen(3000)
