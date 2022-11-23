import {
  RouteParams,
  routing,
  routeParamsBuilder,
  jsonResponse,
  logRequest
} from './routes'
import { sleepSync } from 'bun'

//todo:
//separate the library from the app files
//rename http.ts to todolistApp
//separate unittests
//get params (:id,:user) from inside the
//nicer DSL to create routes
//perf test

const getLists = (req) => {
  return new Response(
    jsonResponse([
      req.params.user + "'s list 1",
      req.params.user + "'s list 2",
      req.params.user + "'s list 3"
    ])
  )
}
// to test: curl http://localhost:3000/pippo/lists
const r0: RouteParams = routeParamsBuilder('/:user/lists', getLists)

const getListTasks = (req) => {
  return new Response(
    jsonResponse({
      listId: req.params.id,
      tasks: [
        req.params.user + ' needs to buy this',
        req.params.user + ' needs to buy that'
      ]
    })
  )
}
// to test: curl http://localhost:3000/pippo/list/1234
const r1: RouteParams = routeParamsBuilder('/:user/list/:id', getListTasks)

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

export default {
  port: 3000,
  fetch(request: Request) {
    logRequest(request)
    return myRoutes(request)
  }
}
