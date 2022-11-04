export type HttpHandler = (req: Request) => Response;
export type RouteSelector = (req: Request) => boolean;

export type RouteParams = {
  selector: RouteSelector;
  handler: HttpHandler;
};

const error404Handler: HttpHandler = function (req) {
  return new Response("Not Found Error!");
}; //add 404 and req data

type Routing = (routes: RouteParams[]) => HttpHandler;

export const routing: Routing =
  (routes) =>
  //returns the first route that matches the request
  (request) => {
    const r = routes.find((route) => {
      return route.selector(request);
    });
    if (r != undefined) {
      return r.handler(request);
    } else {
      return error404Handler(request);
    }
  };
