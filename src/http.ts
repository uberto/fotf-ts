import { RouteParams, routing } from "./routes";

type JsonResponse = (obj: unknown) => Blob;

// See here the accepted Response body types: https://developer.mozilla.org/en-US/docs/Web/API/Response/Response
const jsonResponse: JsonResponse = (obj) =>
  new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });

const r1: RouteParams = {
  selector: (req) => req.url.startsWith("http://0.0.0.0:3000/pippo/lists"), //todo regex
  handler: (req) => new Response(jsonResponse(["a", "b", "c"])),
};

const myRoutes = routing([r1]);

export default {
  port: 3000,
  fetch(request: Request) {
    console.log(request.url);

    return myRoutes(request);
  },
};
