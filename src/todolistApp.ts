import {
    routing,
    jsonResponse,
    logRequest,
    RequestAndParams, GET, POST, PUT
} from './routes'
import {TodolistHub, todolistHubStub} from "./todolistHub";
import {TODO} from "./utils";
// import { sleepSync } from 'bun'

//todo:
//implement write metodo (create and update list)
//separate library files from app files
//separate unittests and practice TDD

const getLists = (hub: TodolistHub) => (req: RequestAndParams) =>
  jsonResponse(hub.getUserLists (req.params.user))

const getListTasks = (hub: TodolistHub) => (req: RequestAndParams) =>
  jsonResponse(hub.getUserList (req.params.user, req.params.id))

const myRoutes = (hub:TodolistHub) => routing([
    GET('/:user/lists', getLists(hub)),
    GET('/:user/list/:id', getListTasks(hub)),
    // PUT('/:user/list/:id', TODO()),
    // POST('/:user/list', TODO())
])


// to test: curl http://localhost:3000/pippo/lists; curl http://localhost:3000/pippo/list/1234

export default {
  port: 3000,
  fetch(request: Request) {
    logRequest(request)
    return myRoutes(todolistHubStub)(request)
  }
}
