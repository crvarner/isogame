

function createContext (context) {
	context.states = context.states.reduce((acc, state) => {
		acc[state] = context.name + ":" + state
		return acc;
	}, {})
	context.actions = context.actions.reduce((acc, action) => {
		acc["PRESS_" + action] = context.name + ":PRESS_" + action
		acc["REL_" + action] = context.name + ":REL_" + action
		return acc;
	}, {})
	return context
}

export const gameContext = createContext({
	name: "gameContext",
	states: [
		"MOVE_LEFT",
		"MOVE_RIGHT"
	],
	actions: [
		"JUMP"
	]
})
