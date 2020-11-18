export default function Collider (entities, map) {

    function resolve (actor) {
      const minY = Math.floor(actor.y)
      const maxY = Math.ceil(actor.y + actor.h) - 1
      if (actor.mx > 0) {
          // moving right, scan right along rows minY - maxY
          for (let row = minY; row <= maxY; row++) {
              for (let col = Math.ceil(actor.x + actor.w); col < map.collisionGrid[row].length; col++) {
                  const tile = map.collisionGrid[row][col];
                  if (tile.obstacle) {
                      const dx = col - (actor.x + actor.w);
                      if (actor.mx > dx) {
                          actor.mx = dx;
                          actor.vx = 0;
                          break;
                      }
                  }
              }
          }
      }
      else if (actor.mx < 0) {
          // moving left, scan left along rows minY - maxY
          for (let row = minY; row <= maxY; row++) {
              for (let col = Math.floor(actor.x) - 1; col >= 0; col--) {
                  const tile = map.collisionGrid[row][col];
                  if (tile.obstacle) {
                      const dx = actor.x - (col + 1)
                      if (actor.mx < -dx) {
                          actor.mx = -dx;
                          actor.vx = 0;
                          break;
                      }
                  }
              }
          }
      }
      actor.x += actor.mx;
      actor.mx = 0;

      const minX = Math.floor(actor.x)
      const maxX = Math.ceil(actor.x + actor.w) - 1
      if (actor.my < 0) {
          // moving up, scan up along columns minX - maxX
          for (let col = minX; col <= maxX; col++) {
              for (let row = Math.floor(actor.y) - 1; row >= 0; row--) {
                  const tile = map.collisionGrid[row][col];
                  if (tile.obstacle) {
                      const dy = actor.y - (row + 1)
                      if (actor.my < -dy) {
                          actor.my = -dy;
                          actor.vy = 0;
                          break;
                      }
                  }
              }
          }
          actor.send({type: "ground", payload: null})
      }
      else if (actor.my > 0) {
          // moving down, scan down along columns minX - maxX
          let ground = null;
          for (let col = minX; col <= maxX; col++) {
              for (let row = Math.ceil(actor.y + actor.h); row < map.collisionGrid.length; row++) {
                  const tile = map.collisionGrid[row][col];
                  if (tile.obstacle) {
                      const dy = row - (actor.y + actor.h)
                      if (actor.my > dy) {
                          ground = tile;
                          actor.my = dy;
                          actor.vy = 0;
                          break;
                      }
                  }
              }
          }
          actor.send({type: "ground", payload: ground})
      }
      actor.y += actor.my
      actor.my = 0;
    }

    this.resolve = resolve
}
