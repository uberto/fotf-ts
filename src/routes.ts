import { some } from './utils'

export type RequestAndParams = Request & { params: { [key: string]: string } }
export type HttpHandler = (req: Request) => Response
export type UserHandler = (req: RequestAndParams) => Response
export type RouteSelector = (req: Request) => string  //TODO!!! this should return a boolean, this imply to use the regex to match the path and compare the method as well

export type RouteParams = {
  selector: RouteSelector
  handler: UserHandler
}

export type JsonResponse = (obj: unknown) => Response

const error404Handler: HttpHandler = function (_req) {
  return new Response('Not Found Error!')
} //add 404 and req data

type Routing = (routes: RouteParams[]) => HttpHandler

const routeMatcher =
  (endpoint: string) =>
  (req: Request): RequestAndParams | undefined => {
    const url = new URL(req.url)
    const path = url.pathname
    const routeParts = endpoint.split('/')
    const pathParts = path.split('/')

    if (endpoint.startsWith('^')) {
      const regex = new RegExp(endpoint)
      if (regex.test(path)) {
        return { ...req, params: {} } as RequestAndParams
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
    return { ...req, params } as RequestAndParams
  }

const routeParamsBuilder = (
    method: string,
    path: string,
    handler: (req: RequestAndParams) => Response
) => {
  return {
    selector: (_req: Request) => path,
    handler: handler
  }
}

export const GET = (
    path: string,
    handler: (req: RequestAndParams) => Response
) =>   routeParamsBuilder('GET',path, handler)

export const POST = (
    path: string,
    handler: (req: RequestAndParams) => Response
) =>   routeParamsBuilder('POST',path, handler)

export const PUT = (
    path: string,
    handler: (req: RequestAndParams) => Response
) =>   routeParamsBuilder('PUT',path, handler)

//UnitTest
if (import.meta.vitest) {
  const genReq = (endpoint: string) =>
    new Request(`http://localhost:3000${endpoint}`)

  const { it, expect } = import.meta.vitest

  it('routeMatcher params', () => {
    const req = genReq('/pippo/lists/1/2/3')
    const newReq = routeMatcher('^/pippo/lists*')(req)

    expect(newReq).toBeDefined()

    const oneParamReq = genReq('/pippo/lists/1234')
    const oneParam = routeMatcher('/pippo/lists/:id')(
      oneParamReq
    ) as RequestAndParams

    expect(oneParam.params).toEqual({ id: '1234' })

    const twoParamReq = genReq('/pippo/lists/1234/items/5678')
    const twoParams = routeMatcher('/pippo/lists/:id1/items/:id2')(
      twoParamReq
    ) as RequestAndParams

    expect(twoParams.params).toEqual({ id1: '1234', id2: '5678' })
  })
}

export const routing: Routing = (routes) => (request) => {
  const r = some<
    RouteParams,
    { handler: UserHandler; newRequest: RequestAndParams }
  >(({ selector, handler }) => {
    const endpoint = selector(request)
    const newRequest = routeMatcher(endpoint)(request)
    if (newRequest) return { handler, newRequest }
  }, routes)
  if (r != undefined) {
    return r.handler(r.newRequest)
  } else {
    return error404Handler(request)
  }
}

// See here the accepted Response body types: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
export const jsonResponse: JsonResponse = (obj) =>
  new Response(
    new Blob([JSON.stringify(obj, null, 2)], {
      type: 'application/json'
    })
  )

export const logRequest = (request: Request) => {
  console.log('REQUEST:')
  console.log('method:', request.method)
  console.log('url:', request.url)
  console.log('Headers:')
  request.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`)
  })
}
