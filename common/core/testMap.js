const width = 32;
const height = 18;

const tile = {
	OPEN: {obstacle: false},
	BLOCK: {obstacle: true},
}

const tiles = Array.from(Array(height), _ => new Array(width))
for (let row = 0; row < height; row++) {
	for (let col = 0; col < width; col++) {
		tiles[row][col] = (row > 16 || col == 0 || col == width - 1)
			? tile.BLOCK
			: tile.OPEN
	}
}
for (let col = 10; col < 20; col++) {
	tiles[12][col] = tile.BLOCK
}


export default {
	collisionGrid: tiles,
	render: function (ctx, b2p) {
		const dim = b2p(1)
		ctx.beginPath()
		ctx.fillStyle = "rgba(0,255,0,0.2)"
		for (let row = 0; row < height; row++) {
			for (let col = 0; col < width; col++) {
				if (!tiles[row][col].obstacle) {
					ctx.rect(col * dim, row * dim, dim, dim)
				}
			}
		}
		ctx.fill()
		ctx.beginPath()
		ctx.fillStyle = "rgba(255,0,0,0.2)"
		for (let row = 0; row < height; row++) {
			for (let col = 0; col < width; col++) {
				if (tiles[row][col].obstacle) {
					ctx.rect(col * dim, row * dim, dim, dim)
				}
			}
		}
		ctx.fill()
	}
}
