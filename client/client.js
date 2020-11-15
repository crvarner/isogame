import inputMapper from './inputMapper'
import { gameContext } from 'common/core/contexts'
import Player from 'common/core/player'
import PlayerController from 'common/core/playerController'
import { collider } from 'common/core/collision'
import testMap from 'common/core/testMap'


const updates = []

const socket = new WebSocket('ws://localhost:3000/')
socket.onopen = function (e) {
    console.log("connection established")
}
socket.onclose = function (e) {
    console.log("connection closed")
}
socket.onmessage = function (e) {
    updates.unshift(JSON.parse(e.data))
    updates.splice(10)
}
socket.onerror = function (err) {
    console.log("error")
    console.log(err)
}



const SECONDS_PER_UPDATE = 1/60.0;
let prev = null
let lag = 0;

function loop (ts) {
    if (!prev) prev = ts;
    const dt = (ts - prev)/1000.0;
    prev = ts
    lag += dt;

    reconcile()
    handleInput()
    while (lag >= SECONDS_PER_UPDATE) {
        //update(SECONDS_PER_UPDATE)
        lag -= SECONDS_PER_UPDATE
    }

    render(lag)
    window.requestAnimationFrame(loop)
}



let current = null
function reconcile () {
    console.log(updates)
    if (updates[0] && updates[0] != current) {
        current = updates[0]
        player.x = current.x
        player.y = current.y
        player.vx = current.vx
        player.vy = current.vy
    }
}



const canvas = document.getElementsByTagName("canvas")[0]
const ctx = canvas.getContext("2d")
const height = canvas.height

const player = new Player(5, 5)
const playerController = new PlayerController(player)
const map = testMap
collider.map = map
collider.addEntity(player)

inputMapper.pushContext(gameContext);
window.requestAnimationFrame(loop)


function handleInput () {
    const inputs = inputMapper.flush()
    if (socket.readyState == 1) {
        socket.send(JSON.stringify(inputs))
    }
    //playerController.handleInput(inputs)
}


function update (dt) {
    player.update(dt)

}

function b2p (blocks) {
    return blocks * (height / 18);
}

function render (lag) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    map.render(ctx, b2p)
    player.render(ctx, b2p, lag)
}
