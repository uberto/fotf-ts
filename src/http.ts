import { RouteParams, routing, jsonResponse } from './routes'

//todo:
//separate the library from the app files
//rename http.ts to todolistApp
//url for all list for users /:user/lists
//url for list details /:user/list/:id
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
    return new Response(
      jsonResponse([
        req.params.user + ' needs to buy this',
        req.params.user + ' needs to buy that'
      ])
    )
  }
}

const myRoutes = routing([r0, r1])

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
