import { some } from "./utils";

export type Req = Request & { params: { [key: string]: string } }
export type HttpHandler = (req: Request) => Response;
export type UserHandler = (req: Req) => Response;
export type RouteSelector = (req: Request) => string;

export type RouteParams = {
  selector: RouteSelector;
  handler: UserHandler;
};

const error404Handler: HttpHandler = function (req) {
  return new Response("Not Found Error!");
}; //add 404 and req data

type Routing = (routes: RouteParams[]) => HttpHandler

const routeMatcher = (endpoint: string) => (req: Request): Req | false => {
  const url = new URL(req.url);
  const path = url.pathname;
  const routeParts = endpoint.split("/");
  const pathParts = path.split("/");

  if (endpoint.startsWith("^")) {
    const regex = new RegExp(endpoint);
    if (regex.test(path)) {
      return { ...req, params: {} };
    }
  }

  if (routeParts.length !== pathParts.length) {
    return false;
  }
  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];
    if (routePart.startsWith(":")) {
      const paramName = routePart.slice(1);
      params[paramName] = pathPart;
    } else if (routePart !== pathPart) {
      return false;
    }
  }
  return {...req, params};
};

// console.log(routeMatcher("^/pippo/*")(new Request("http://localhost:3000/pippo/lists/a")))
// console.log(routeMatcher("/pippo/:param")(new Request("http://localhost:3000/pippo/lists")))

export const routing: Routing =
  (routes) =>
  (request) => {
    const r = some<RouteParams, {handler: UserHandler, newRequest: Req}>(
      ({selector, handler}) => {
          const endpoint = selector(request);
          const newRequest = routeMatcher(endpoint)(request);  
          if(newRequest) return {handler, newRequest};
      },
      routes
    ) 
    if (r != undefined) {
      return r.handler(r.newRequest);
    } else {
      return error404Handler(request);
    }
  };
