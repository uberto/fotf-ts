export type HttpHandler = (Request) => Response

export type RouteSelector = (Request) => boolean

export class Route {
    constructor({selector, handler}) {
        this.selector = selector
        this.handler = handler
    }

    selector: RouteSelector
    handler: HttpHandler
}

const error404Handler: HttpHandler = function (req) {
    return new Response("Not Found Error!")
} //add 404 and req data

export const routing = (routes: Route[]): HttpHandler => //returns the first route that match the request
    (request: Request) => {
        const r = routes.find(function (route) {

            console.log(route, request)


            return route.selector(request)
        })
        if (r != undefined) {
            return r.handler(request)
        } else {
            return error404Handler(request)
        }
    }

