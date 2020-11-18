import express from 'express'
import path from 'path'
import expressLayouts from 'express-ejs-layouts'

import config from './server/config'
import { router, route, dump, url_for } from './server/router'
import GameServer from './server/GameServer'
import GameEngine from './common/GameEngine'
import utils from './common/utils'

// create app
const app = express()

// load config from VOLUME
config.load(path.resolve('/etc', 'isogame', 'isogame.yml'))

// templating engine
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.set('views', path.resolve(__dirname, 'views'))
app.set('layout', 'layouts/layout');
app.locals.dump_routes = dump
app.locals.url_for = url_for

// routing
app.use('/static', express.static('static'))
app.use('/', router)

// pages
route("GET", "/lobby", "lobby", (req, res) => {
    res.render('lobby')
})
route("GET", "/games/:game_id", "client", (req, res) => {
    res.render('client')
})

// api
const games = {}
route("GET", "/api/games", "list_games", (req, res) => {
    const gameList = Object.keys(games).map(id => ({
        id,
        players: games[id].players()
    }))
    console.log(gameList)
    res.send({games: gameList})
})
route("POST", "/api/games", "create_game", (req, res) => {
    let id = utils.unique_id()
    while (id in games) id = utils.unique_id()
    const engine = new GameEngine()
    games[id] = new GameServer(engine)
    games[id].start().then(() => {
        console.log(`${id} stopped`)
        delete games[id]
    })
    res.send({id})
})
route("DELETE", "/api/games/:game_id", "delete_game", (req, res) => {
    delete games[req.params.game_id]
    res.send({status: 0})
})

// WebSockets
const server = app.listen(3000)
server.on('upgrade', (req, socket, head) => {
    const game_id = req.url.match(/^\/games\/([0-9a-zA-Z]+)$/)[1]
    if (game_id in games) {
        games[game_id].connect(req, socket, head)
    }
    else {
        socket.destroy()
    }
})
