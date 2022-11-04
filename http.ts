

import {HttpHandler, routing, Route} from "./routes"


const r1: Route = new Route( {selector: (req: Request) => req.path.startsWith("/pippo/lists"),  //todo regex
handler: (req: Request) => Response(["a","b","c"])})

//const r2: Route = new Route( (req: Request) => req.path.startsWith("/users"),  //todo regex
//                             (req: Request) => Response(["pippo","pluto"]))
//
//const r3: Route = new Route( (req: Request) => req.path.startsWith("/pippo/lists/a"),  //todo regex
//                             (req: Request) => Response(["buy milk","water plants"]))

const myRoutes: HttpHandler = routing([r1]) //,r2,r3


export default {
    port: 3000,
    fetch(request: Request) {
        console.log(request)
        return new Response("Welcome to Bun!")

//        return myRoutes(request)
    }
}
