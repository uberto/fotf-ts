export type HttpHandler = (req: Request) => Response;
export type RouteSelector = (req: Request) => boolean;

type RouteParams = {
  selector: RouteSelector;
  handler: HttpHandler;
};

export class Route {
  selector;
  handler;

  constructor({ selector, handler }: RouteParams) {
    this.selector = selector;
    this.handler = handler;
  }
}

const error404Handler: HttpHandler = function (req) {
  return new Response("Not Found Error!");
}; //add 404 and req data

type Routing = (routes: Route[]) => HttpHandler;

export const routing: Routing =
  (routes) =>
  //returns the first route that matches the request
  (request) => {
    const r = routes.find(function (route) {
      return route.selector(request);
    });
    if (r != undefined) {
      return r.handler(request);
    } else {
      return error404Handler(request);
    }
  };
