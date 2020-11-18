import GameClient from './GameClient'
import GameEngine from '../common/GameEngine'

const engine = new GameEngine()
const canvas = document.getElementsByTagName("canvas")[0]

const client = new GameClient(engine, canvas)
