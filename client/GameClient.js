import inputMapper from './inputMapper'
import { gameContext } from '../common/core/contexts'

const TICK_LENGTH = 1 / 60.0


export default function GameClient (engine, canvas) {

    /*
    websocket stuff should be moved into its own Emitter class
    */
    const socket = new WebSocket(`ws://localhost:3000${window.location.pathname}`)
    socket.onopen = function (e) {
        console.log("connection established")
    }
    socket.onclose = function (e) {
        console.log("disconnected")
        window.location.href = window.routes.lobby + "?error=disconnected"
    }
    socket.onerror = function (err) {
        window.location.href = window.routes.lobby
    }
    socket.onmessage = function (e) {
        const payload = JSON.parse(e.data)
        if (payload.type == "init") {
            init(payload.id)
        }
        else {
            handleUpdate(payload)
        }
    }


    const updates = []
    let player_id = null;
    engine.setCanvas(canvas)
    inputMapper.pushContext(gameContext)

    function init (id) {
        player_id = id
        engine.createEntity(player_id)
        engine.controlEntity(player_id)
        window.requestAnimationFrame(loop)
    }

    function handleUpdate (update) {
        if (player_id) {
            updates.unshift(update)
            updates.splice(10)
        }
    }

    function handleInput () {
        const input = inputMapper.flush()
        socket.send(JSON.stringify(input))
        engine.applyInputs({[player_id]: [input]})
    }


    let lag = 0;
    let prev = null;
    function loop (ts) {
        if (!prev) prev = ts
        const dt = (ts - prev)/1000.0
        prev = ts
        lag += dt

        engine.reconcile(updates[0], player_id)
        handleInput()
        while (lag >= TICK_LENGTH) {
            //engine.update(TICK_LENGTH)
            lag -= TICK_LENGTH
        }
        engine.render(lag)

        window.requestAnimationFrame(loop)
    }
}
