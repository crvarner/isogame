import inputMapper from './inputMapper'
import { gameContext } from 'common/core/contexts'
import Player from 'common/core/player'
import PlayerController from 'common/core/playerController'
import { collider } from 'common/core/collision'
import testMap from './testMap'


const SECONDS_PER_UPDATE = 1/60.0;
let prev = null
let lag = 0;

function loop (ts) {
	if (!prev) prev = ts;
	const dt = (ts - prev)/1000.0;
	prev = ts
	lag += dt;

	handleInput()
	while (lag >= SECONDS_PER_UPDATE) {
		update(SECONDS_PER_UPDATE)
		lag -= SECONDS_PER_UPDATE
	}

	render(lag)
	window.requestAnimationFrame(loop)
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
	playerController.handleInput(inputs)
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
