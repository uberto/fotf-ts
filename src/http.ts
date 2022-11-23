import { RouteParams, routing, jsonResponse } from './routes'

// to test: curl http://localhost:3000/pippo/lists/1234
const r1: RouteParams = {
  // do we really need the req here? maybe just a string | regex?
  selector: (_req) => '/pippo/lists/:id',
  handler: (req) => {
    console.log(req.params)
    return new Response(jsonResponse(['a', 'b', 'c']))
  }
}


const myRoutes = routing([r1])

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
