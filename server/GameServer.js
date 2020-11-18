import ws from 'ws'

import utils from '../common/utils'
import config from './config'

const TICK_LENGTH = 1.0 / config.get('TICK_RATE', 60)

export default function GameServer (engine) {

    const inputs = {}

    const wsServer = new ws.Server({
        noServer: true,
        clientTracking: true
    })
    wsServer.on('connection', socket => {
        const id = engine.createEntity()
        engine.controlEntity(id)
        inputs[id] = []

        console.log(`${id} connection established`)
        socket.send(JSON.stringify({type: "init", id}))

        socket.on('close', () => {
            console.log(`${id} connection closed`)
            engine.removeEntity(id)
            delete inputs[id]
        })

        socket.on('message', message => {
            inputs[id].push(JSON.parse(message))
        })
    })

    function connect (req, socket, head) {
        wsServer.handleUpgrade(req, socket, head, socket => {
            console.log("connection request")
            wsServer.emit('connection', socket, req)
        })
    }

    function broadcast (snapshot) {
        wsServer.clients.forEach(client => {
            client.send(JSON.stringify(snapshot))
        })
    }

    let tick = 0
    let target = null
    let stop = null
    function step () {
        const ts = utils.now()

        engine.applyInputs(inputs)
        const snapshot = engine.update(TICK_LENGTH)
        broadcast(snapshot)

        if (false) {
            return stop()
        }

        tick++
        target += TICK_LENGTH
        setTimeout(step, (target - utils.now()) * 1000)
    }

    function start () {
        target = utils.now()
        return new Promise((resolve, reject) => {
            stop = resolve
            step()
        })
    }

    function players () {
        return wsServer.clients.size
    }

    this.connect = connect
    this.start = start
    this.players = players
}
