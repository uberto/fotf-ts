import { some } from './utils'

export type Req = Request & { params: { [key: string]: string } }
export type HttpHandler = (req: Request) => Response
export type UserHandler = (req: Req) => Response
export type RouteSelector = (req: Request) => string

export type RouteParams = {
  selector: RouteSelector
  handler: UserHandler
}

const error404Handler: HttpHandler = function (_req) {
  return new Response('Not Found Error!')
} //add 404 and req data

type Routing = (routes: RouteParams[]) => HttpHandler

const routeMatcher =
  (endpoint: string) =>
  (req: Request): Req | undefined => {
    const url = new URL(req.url)
    const path = url.pathname
    const routeParts = endpoint.split('/')
    const pathParts = path.split('/')

    if (endpoint.startsWith('^')) {
      const regex = new RegExp(endpoint)
      if (regex.test(path)) {
        return { ...req, params: {} } as Req
      }
    }

    if (routeParts.length !== pathParts.length) {
      return
    }
    const params = {}

    for (let i = 0; i < routeParts.length; i++) {
      const routePart = routeParts[i]
      const pathPart = pathParts[i]
      if (routePart.startsWith(':')) {
        const paramName = routePart.slice(1)
        params[paramName] = pathPart
      } else if (routePart !== pathPart) {
        return
      }
    }
    return { ...req, params } as Req
  }

if (import.meta.vitest) {
  const genReq = (endpoint: string) =>
    new Request(`http://localhost:3000${endpoint}`)

  const { it, expect } = import.meta.vitest

  it('routeMatcher params', () => {
    const req = genReq('/pippo/lists/1/2/3')
    const newReq = routeMatcher('^/pippo/lists*')(req)

    expect(newReq).toBeDefined()

    const oneParamReq = genReq('/pippo/lists/1234')
    const oneParam = routeMatcher('/pippo/lists/:id')(oneParamReq) as Req

    expect(oneParam.params).toEqual({ id: '1234' })

    const twoParamReq = genReq('/pippo/lists/1234/items/5678')
    const twoParams = routeMatcher('/pippo/lists/:id1/items/:id2')(
      twoParamReq
    ) as Req

    expect(twoParams.params).toEqual({ id1: '1234', id2: '5678' })
  })
}

export const routing: Routing = (routes) => (request) => {
  const r = some<RouteParams, { handler: UserHandler; newRequest: Req }>(
    ({ selector, handler }) => {
      const endpoint = selector(request)
      const newRequest = routeMatcher(endpoint)(request)
      if (newRequest) return { handler, newRequest }
    },
    routes
  )
  if (r != undefined) {
    return r.handler(r.newRequest)
  } else {
    return error404Handler(request)
  }
}
