import ws from 'ws'

import PlayerController from '../common/core/playerController'
import Player from '../common/core/player'
import { collider } from '../common/core/collision'
import testMap from '../common/core/testMap'
import { now } from '../common/utils'
import config from './config'


const TICK_LENGTH = 1.0 / 30
const instances = {}





const player = new Player(5, 5)
const playerController = new PlayerController(player)
const map = testMap
collider.map = map
collider.addEntity(player)





function Instance (id) {

    const player = new Player(5, 5)
    const playerController = new PlayerController(player)
    const sockets = []
    const inputs = []

    const wsServer = new ws.Server({ noServer: true })
    wsServer.on('connection', socket => {
        console.log('on connection')
        sockets.push(socket)

        socket.on('message', message => {
            inputs.push(JSON.parse(message))
        })
    })

    function join (req, socket, head) {
        wsServer.handleUpgrade(req, socket, head, socket => {
            console.log('emit connection')
            wsServer.emit('connection', socket, req)
        })
    }

    function broadcast (snapshot) {
        sockets.forEach(socket => {
            socket.send(JSON.stringify(snapshot))
        })
    }


    let tick = 0
    let prev = null;
    let target = now() + TICK_LENGTH
    function loop () {
        const ts = now()
        if (!prev) prev = ts
        const dt = ts - prev
        prev = ts

        handleInput()
        update(TICK_LENGTH)
        broadcast()

        tick++
        target += TICK_LENGTH
        setTimeout(loop, (target - now()) * 1000)
    }
    setTimeout(loop, (target - now()) * 1000)


    function handleInput () {
        const tickInputs = inputs.splice(0, inputs.length)
        tickInputs.forEach(input => {
            playerController.handleInput(input)
        })
    }


    function update (dt) {
        player.update(dt)
    }


    function broadcast () {
        sockets.forEach(socket => {
            socket.send(JSON.stringify({
                tick,
                x: player.x,
                y: player.y,
                vx: player.vx,
                vy: player.vy
            }))
        })
    }


    this.join = join
}

export function handleUpgrade (req, socket, head) {
    console.log("handle upgrade")
    // if (Object.keys(instances).length < config.get('max_instances')) {
    if (Object.keys(instances).length < 5) {
        const id = Math.random().toString(36).substr(2, 9);
        instances[id] = new Instance(id)
        instances[id].join(req, socket, head)
    }
    else {
        socket.destroy()
    }
}
