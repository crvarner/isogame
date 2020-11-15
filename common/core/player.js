import { collider } from './collision'
import State from './state'


export default function Player (x, y) {

	const RUN_AX = 80
	const MAX_VX = 15

	const JUMP_VY = -30
	const FALL_GRAVITY = 60
	const MAX_VY = 30

	this.x = x;
	this.y = y;
	this.w = 1;
	this.h = 2;
	this.vx = 0;
	this.vy = 0;
	this.mx = 0;
	this.my = 0;
	this._direction = 0;
	this._ground = null;
	this.state = new IdleState();
	if (this.state.enter) this.state.enter()

	this.update = function (dt) {
		this.state.handleUpdate(this, dt)
	}

	this.send = function (cmd) {
		this.state.handleCommand(this, cmd)
	}

	this.render = function (ctx, b2p, lag) {
		this.state.render(this, ctx, b2p, lag)
	}

	/* PLAYER STATES */
	function IdleState () {
		State.call(this)

		this.enter = function (actor) {
			console.log("Player.IdleState: enter")
		}

		this.render = function (actor, ctx, b2p, lag) {
			ctx.beginPath()
			ctx.fillStyle = "rgba(0,0,255,1)"
			ctx.rect(b2p(actor.x), b2p(actor.y), b2p(actor.w), b2p(actor.h))
			ctx.fill()
		}

		this.update = function (actor, dt) {
			const dvx = -Math.sign(actor.vx) * RUN_AX * dt;
			actor.vx = (Math.abs(actor.vx) > dvx)
				? actor.vx - Math.sign(actor.vx) * RUN_AX * dt
				: 0
			actor.mx += actor.vx * dt

			actor.vy = Math.min(MAX_VY, actor.vy + FALL_GRAVITY * dt)
			actor.my += actor.vy * dt

			collider.resolve(actor)
		}

		this.move = function (actor, direction) {
			actor._direction = direction
			if (direction != 0) {
				return new RunningState()
			}
		}

		this.jump = function (actor) {
			let doubleJump = false;
			return new JumpingState(doubleJump)
		}

		this.ground = function (actor, ground) {
			if (!ground) {
				let jumpAllowed = true
				return new FallingState (jumpAllowed)
			}
		}
	}

	function RunningState () {
		State.call(this)

		this.enter = function (actor) {
			console.log("Player.RunningState: enter")
		}

		this.render = function (actor, ctx, b2p, lag) {
			ctx.beginPath()
			ctx.fillStyle = "rgba(0,0,155,1)"
			ctx.rect(b2p(actor.x), b2p(actor.y), b2p(actor.w), b2p(actor.h))
			ctx.fill()
		}

		this.update = function (actor, dt) {
			actor.vx += actor._direction * RUN_AX * dt;
			actor.vx = Math.min(MAX_VX, Math.max(-MAX_VX, actor.vx))
			actor.mx += actor.vx * dt

			actor.vy = Math.min(MAX_VY, actor.vy + FALL_GRAVITY * dt)
			actor.my += actor.vy * dt

			collider.resolve(actor)
		}

		this.move = function (actor, direction) {
			actor._direction = direction
			if (direction == 0) {
				return new IdleState()
			}
		}

		this.jump = function (actor) {
			const doubleJump = false;
			return new JumpingState(doubleJump)
		}

		this.ground = function (actor, ground) {
			if (!ground) {
				let jumpAllowed = true
				return new FallingState(jumpAllowed)
			}
		}
	}

	function JumpingState (isDoubleJump) {
		State.call(this)

		this.enter = function (actor) {
			console.log("Player.JumpingState: enter")
			actor.vy = JUMP_VY
		}

		this.render = function (actor, ctx, b2p, lag) {
			ctx.beginPath()
			ctx.fillStyle = "rgba(0,255,0,0.2)"
			ctx.rect(b2p(actor.x), b2p(actor.y), b2p(actor.w), b2p(actor.h))
			ctx.fill()
		}

		this.update = function (actor, dt) {
			actor.vx += actor._direction * RUN_AX * dt;
			actor.vx = Math.min(MAX_VX, Math.max(-MAX_VX, actor.vx))
			actor.mx += actor.vx * dt

			actor.vy = Math.min(MAX_VY, actor.vy + FALL_GRAVITY * dt)
			actor.my += actor.vy * dt

			collider.resolve(actor)
			if (actor.vy >= 0) {
				let jumpAllowed = !isDoubleJump
				return new FallingState(jumpAllowed)
			}
		}

		this.move = function (actor, direction) {
			actor._direction = direction
		}

		this.jump = function (actor) {
			if (!isDoubleJump) {
				let doubleJump = true
				return new JumpingState(doubleJump)
			}
		}

		this.ground = function (actor, ground) {
			if (ground) {
				return new IdleState()
			}
		}
	}

	function FallingState (jumpAllowed) {
		State.call(this)

		this.enter = function () {
			console.log("Player.FallingState: enter")
		}

		this.render = function (actor, ctx, b2p, lag) {
			ctx.beginPath()
			ctx.fillStyle = "rgba(0,155,0,1)"
			ctx.rect(b2p(actor.x), b2p(actor.y), b2p(actor.w), b2p(actor.h))
			ctx.fill()
		}

		this.update = function (actor, dt) {
			actor.vx += actor._direction * RUN_AX * dt;
			actor.vx = Math.min(MAX_VX, Math.max(-MAX_VX, actor.vx))
			actor.mx += actor.vx * dt

			actor.vy = Math.min(MAX_VY, actor.vy + FALL_GRAVITY * dt)
			actor.my += actor.vy * dt

			collider.resolve(actor)
		}

		this.move = function (actor, direction) {
			actor._direction = direction
		}

		this.jump = function (actor) {
			if (jumpAllowed) {
				const doubleJump = true;
				return new JumpingState(doubleJump);
			}
		}

		this.ground = function (actor, ground) {
			if (ground) {
				return new IdleState()
			}
		}
	}
}
