import {
  routing,
  routeParamsBuilder,
  jsonResponse,
  logRequest,
  RequestAndParams
} from './routes'
// import { sleepSync } from 'bun'

//todo:
//separate the library from the app files
//separate unittests
//perf test

const getLists = (req: RequestAndParams) =>
  jsonResponse([
    req.params.user + "'s list 1",
    req.params.user + "'s list 2",
    req.params.user + "'s list 3"
  ])

const getListTasks = (req: RequestAndParams) =>
  jsonResponse({
    listId: req.params.id,
    tasks: [
      req.params.user + ' needs to buy this',
      req.params.user + ' needs to buy that'
    ]
  })

const myRoutes = routing([
  // to test: curl http://localhost:3000/pippo/lists
  routeParamsBuilder('/:user/lists', getLists),
  // to test: curl http://localhost:3000/pippo/list/1234
  routeParamsBuilder('/:user/list/:id', getListTasks)
])

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
