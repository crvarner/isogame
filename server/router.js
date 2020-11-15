import { Router } from 'express'
import config from './config'

export const router = Router()
const routes = {}

export function url_for (key) {
    return key in routes
        ? config.get('url_prefix') + routes[key]
        : config.get('url_prefix') + key
}

export function dump () {
    return JSON.stringify(routes)
}

export function route (method, pattern, name, cb) {
    routes[name] = url_for(pattern)
    let methods = Array.isArray(method) ? method : [method]
    methods.forEach(method => {
        switch (method) {
            case "GET": return router.get(pattern, cb)
            case "POST": return router.post(pattern, cb)
            case "PUT": return router.put(pattern, cb)
            case "DELETE": return router.delete(pattern, cb)
        }
    })
}
