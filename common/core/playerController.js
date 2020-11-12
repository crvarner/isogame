import { gameContext } from 'common/core/contexts'
const {actions, states} = gameContext

export default function (player) {

	this.handleInput = function (inputs) {
		if (inputs.states[states.MOVE_LEFT] && !inputs.states[states.MOVE_RIGHT]) {
			player.send({type: "move", payload: -1})
		}
		else if (!inputs.states[states.MOVE_LEFT] && inputs.states[states.MOVE_RIGHT]) {
			player.send({type: "move", payload: 1})
		}
		else {
			player.send({type: "move", payload: 0})
		}

		for (const action of inputs.actions) {
			switch (action) {

				case actions.PRESS_JUMP:
					player.send({type: "jump"})
					break;
			}
		}
	}

}
