import {
  routing,
  routeParamsBuilder,
  jsonResponse,
  logRequest,
  RequestAndParams
} from './routes'
import {TodolistHub, todolistHubStub} from "./todolistHub";
// import { sleepSync } from 'bun'

//todo:
//implement write metodo (create and update list)
//separate library files from app files
//separate unittests

const getLists = (hub: TodolistHub) => (req: RequestAndParams) =>
  jsonResponse(hub.getUserLists (req.params.user))

const getListTasks = (hub: TodolistHub) => (req: RequestAndParams) =>
  jsonResponse(hub.getUserList (req.params.user, req.params.id))

const myRoutes = (hub:TodolistHub) => routing([
  routeParamsBuilder('/:user/lists', getLists(hub)),
  routeParamsBuilder('/:user/list/:id', getListTasks(hub))
])

// define some kind of DSL like this:
//
// const myRoutes = (hub) => routing([
//   "/:user/lists" GET { hub.allListsForUser(u)},
//   "/:user/list/:id" GET { hub.getListForUser(u, id)}
//   "/:user/list/:id" PUT { hub.updateListForUser(u, id, list)}
//   "/:user/list" POST { hub.newListForUser(u, list)}
// ])


// to test: curl http://localhost:3000/pippo/lists; curl http://localhost:3000/pippo/list/1234

export default {
  port: 3000,
  fetch(request: Request) {
    logRequest(request)
    return myRoutes(todolistHubStub)(request)
  }
}
