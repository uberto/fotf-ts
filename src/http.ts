import { Req, RouteParams, routing } from "./routes";

type JsonResponse = (obj: unknown) => Blob;

// See here the accepted Response body types: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
const jsonResponse: JsonResponse = (obj) =>
  new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });

// to test: curl http://localhost:3000/pippo/lists/1234
const r1: RouteParams = {
  // do we really need the req here? maybe just a string | regex?
  selector: (req) => "/pippo/lists/:id",
  handler: (req) => {
    console.log(req.params);
    return new Response(jsonResponse(["a", "b", "c"]))
  },
};

const myRoutes = routing([r1]);

const logRequest = (request: Request) => {
  console.log("REQUEST:");
  console.log("url:", request.url);
  console.log("Headers:");
  request.headers.forEach((value, key) => {
    console.log(`${key}: ${value}`);
  });
};

export default {
  port: 3000,
  fetch(request: Request) {
    logRequest(request);
    return myRoutes(request);
  },
};
