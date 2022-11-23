import { RouteParams, routing, jsonResponse } from './routes'
import {sleepSync} from "bun";

//todo:
//separate the library from the app files
//rename http.ts to todolistApp
//url for all list for users /:user/lists
//url for list details /:user/list/:id
//get params (:id,:user) from inside the
//nicer DSL to create routes
//perf test

// to test: curl http://localhost:3000/pippo/lists/1234
const r1: RouteParams = {
  // do we really need the req here? maybe just a string | regex?
  selector: (_req) => '/pippo/lists/:id',
  handler: (req) => {
    console.log(req.params)
    // sleepSync(1)
    return new Response(jsonResponse(['a', 'b', 'c']))
  }
}


const myRoutes = routing([
    r1
])

// some kind of DSL like this:
//
// const myRoutes = routing([
//   "/:user/lists" GET { allListsForUser(u)},
//   "/:user/list/:id" GET { getListForUser(u, id)}
//   "/:user/list/:id" PUT { updateListForUser(u, id, list)}
//   "/:user/list" POST { newListForUser(u, list)}
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
