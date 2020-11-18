/*
GameEngine.js - Isomorphic Game Engine
*/
import Player from './core/player'
import PlayerController from './core/playerController'
import Collider from './core/collider'
import testMap from './core/testMap'
import utils from '../common/utils'


export default function GameEngine () {

    const map = testMap
    const entities = {}
    const collider = new Collider(entities, map)
    const controllers = {}


    // GameServer: called on connection open
    // GameClient: called during Server Reconcilliation
    function createEntity (entity_id) {
        const id = entity_id || utils.unique_id()
        entities[id] = new Player(5, 5)
        console.log(`created entity ${id}`)
        return id
    }


    // GameServer: called on connection open and scripted events
    // GameClient: called during Server Reconcilliation
    function controlEntity (id) {
        controllers[id] = new PlayerController(entities[id])
        console.log(`created controller ${id}`)
    }


    // GameServer: called on connection close
    // GameClient: called during Server Reconcilliation
    function removeEntity (id) {
        delete entities[id]
        delete controllers[id]
        console.log(`removed entity ${id}`)
    }


    // GameServer: called once per tick
    // GameClient: called during Client-Side Prediction
    function applyInputs (inputs) {
        Object.keys(inputs).forEach(id => {
            const consumed = inputs[id].splice(0, inputs[id].length)
            consumed.forEach(input => {
                controllers[id].handleInput(input)
            })
        })
    }


    // GameServer: called once per tick
    // GameClient: called for Client-Side Prediction
    function update (dt) {
        const snapshot = {}
        Object.keys(entities).forEach(id => {
            const entity = entities[id]
            entity.update(dt)
            collider.resolve(entity)
            snapshot[id] = {
                x: entity.x,
                y: entity.y
            }
        })
        return snapshot
    }


    // GameClient: Server Reconcilliation performed each update
    function reconcile (update, player_id) {
        if (update == undefined) return
        // if update missing known entity, remove it
        Object.keys(entities).forEach(entity_id => {
            if (!(entity_id in update)) {
                removeEntity(entity_id)
            }
        })
        Object.keys(update).forEach(entity_id => {
            // if update contains unknown entity, create it
            if (!(entity_id in entities)) {
                createEntity(entity_id)
                if (entity_id == player_id) {
                    // if unknown entity matches player_id, control it
                    controlEntity(entity_id)
                }
            }
            // naive reconcilliation, snap to server update
            const localEntity = entities[entity_id]
            const serverEntity = update[entity_id]
            localEntity.x = serverEntity.x
            localEntity.y = serverEntity.y
        })
    }


    // GameClient: calls during initialization
    let canvas = null
    let ctx = null
    let b2p = null
    function setCanvas (c) {
        canvas = c
        ctx = canvas.getContext('2d')
        b2p = function (blocks) {
            return blocks * (canvas.height / 18)
        }
    }


    // GameClient: called in requestAnimationFrame loop
    function render (lag) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        map.render(ctx, b2p)
        Object.keys(entities).forEach(id => entities[id].render(ctx, b2p, lag))
    }


    this.createEntity = createEntity
    this.controlEntity = controlEntity
    this.removeEntity = removeEntity
    this.applyInputs = applyInputs
    this.update = update
    this.reconcile = reconcile
    this.setCanvas = setCanvas
    this.render = render
}
