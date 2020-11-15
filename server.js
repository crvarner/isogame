import express from 'express'
import path from 'path'
import ejs from 'ejs'

import config from './server/config'
import { router, route, url_for, dump } from './server/router'
import { handleUpgrade } from './server/instance'
import utils from './common/utils'

config.load(path.resolve('/etc', 'isogame', 'isogame.yml'))

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))
app.locals.dump_routes = dump
app.locals.url_for = url_for

app.use('/static', express.static('static'))
app.use('/', router)


route("GET", "/", "index", (req, res) => {
    console.log(config.get('test'))
    console.log(url_for('index'))
    res.render("index")
})


const server = app.listen(3000)
server.on('upgrade', handleUpgrade)
