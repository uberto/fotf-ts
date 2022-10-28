


type HttpHandler = (Request) => (Response)

type RouteSelector = (Request) => boolean

class Route {
    selector: RouteSelector = function (req){return true}
    handler: HttpHandler = function (req){return new Response("TODO!")}
}

const error404Handler: HttpHandler = function (req) {return new Response("Not Found Error!")} //add 404 and req data

function routing(routes: Route[]): HttpHandler {
    //returns the first route that match the request
    return function (request: Request) {
        const r = routes.find(function (route) {
            return route.selector(request)
        })
        if (r != undefined) {
            return r.handler(request)
        }
        else {
            return error404Handler(request)
        }
    }
}
//-------------

const myRoutes: HttpHandler = routing([
        new Route(),
        new Route(),
        new Route()
    ])


export default {
    port: 3000,
    fetch(request: Request) {
//         return new Response("Welcome to Bun!")
        return myRoutes(request)
    }
}

