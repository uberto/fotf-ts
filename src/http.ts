import { RouteParams, routing, jsonResponse } from './routes'
import {sleepSync} from "bun";

//todo:
//separate the library from the app files
//rename http.ts to todolistApp
//url for all list for users /:user/lists
//url for list details /:user/list/:id
//get params (:id,:user) from inside the
//nicer DSL to create routes

// to test: curl http://localhost:3000/pippo/lists
const r0: RouteParams = {
  selector: (_req) => '/:user/lists',
  handler: (req) => {
    return new Response(
      jsonResponse([
        req.params.user + "'s list 1",
        req.params.user + "'s list 2",
        req.params.user + "'s list 3"
      ])
    )
  }
}
// to test: curl http://localhost:3000/pippo/list/1234

const r1: RouteParams = {
  // do we really need the req here? maybe just a string | regex?
  selector: (_req) => '/:user/list/:id',
  handler: (req) => {
  //    console.log(req.params)
    // sleepSync(1)
    return new Response(
      jsonResponse({'listId': 123, 'tasks':
      [
        req.params.user + ' needs to buy this',
        req.params.user + ' needs to buy that'
      ]})
    )
  }
}

const myRoutes = routing([r0, r1])

// some kind of DSL like this:
// hub is the object facade of the domain with an interface
// hub will have an implementation with DB access and one with only mem for tests
//
// const myRoutes = (hub) => routing([
//   "/:user/lists" GET { hub.allListsForUser(u)},
//   "/:user/list/:id" GET { hub.getListForUser(u, id)}
//   "/:user/list/:id" PUT { hub.updateListForUser(u, id, list)}
//   "/:user/list" POST { hub.newListForUser(u, list)}
// ])

const logRequest = (request: Request) => {
  console.log('REQUEST:')
  console.log('url:', request.url)
  console.log('Headers:')
  request.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`)
  })
}

export default {
  port: 3000,
  fetch(request: Request) {
    logRequest(request)
    return myRoutes(request)
  }
}
