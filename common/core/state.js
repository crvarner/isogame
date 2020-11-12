

export default function State () {

	this.handleCommand = function (actor, cmd) {
		if (cmd.type in this) {
			const newState = this[cmd.type](actor, cmd.payload)
			if (newState) {
				if (actor.state.exit) actor.state.exit(actor)
				actor.state = newState;
				if (actor.state.enter) actor.state.enter(actor)
			}
		}
	}

	this.handleUpdate = function (actor, dt) {
		const newState = this.update(actor, dt)
		if (newState) {
			if (actor.state.exit) actor.state.exit(actor)
			actor.state = newState;
			if (actor.state.enter) actor.state.enter(actor)
		}
	}

}
