const defaultKeyMap = {
	gameContext: {
		states: {
			MOVE_LEFT: "a",
			MOVE_RIGHT: "d"
		},
		actions: {
			JUMP: "w"
		}
	}
}


export default (function () {

	const keyMap = invertKeyMap(defaultKeyMap);
	const contexts = []
	const actions = []
	const states = {}

	function invertKeyMap(km) {
		const inverted = {}
		for (const [name, map] of Object.entries(km)) {
			inverted[name] = {
				states: {},
				actions: {}
			}
			for (const [key, value] of Object.entries(map.states)) {
				inverted[name].states[value] = key
			}
			for (const [key, value] of Object.entries(map.actions)) {
				inverted[name].actions[value] = key
			}
		}
		return inverted
	}

	function mapButtonToState (button) {
		for (let i = 0; i < contexts.length; i++) {
			const context = contexts[i];
			const state = keyMap[context.name].states[button]
			if (state) {
				return context.states[state]
			}
		}
	}

	function mapButtonToAction (button, pressed) {
		for (let i = 0; i < contexts.length; i++) {
			const context = contexts[i]
			const action = keyMap[context.name].actions[button]
			if (action) {
				return pressed
					? context.actions["PRESS_" + action]
					: context.actions["REL_" + action]
			}
		}
	}

	function mapInput (button, pressed) {
		let action, state = null;
		if (state = mapButtonToState(button)) {
			states[state] = pressed
		}
		else if (action = mapButtonToAction(button, pressed)) {
			actions.push(action)
		}
	}

	const keyDown = {}
	document.addEventListener('keydown', e => {
		if (!keyDown[e.key]) {
			keyDown[e.key] = true
			mapInput(e.key, true)
		}
	})
	document.addEventListener('keyup', e => {
		keyDown[e.key] = false
		mapInput(e.key, false)
	})

	function pushContext (ctx) {
		contexts.push(ctx)
	}

	function flush () {
		return {
			actions: actions.splice(0, actions.length),
			states: Object.assign({}, states)
		}
	}

	return {
		pushContext,
		flush
	}
})();
