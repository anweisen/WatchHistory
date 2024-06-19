import {WorkboxPlugin} from "workbox-core/types";

declare const self: ServiceWorkerGlobalScope;

class OfflineNotifyWorkerPlugin implements WorkboxPlugin {

  async fetchDidFail() {
    console.log("fetchDidFail");
  }

  async cachedResponseWillBeUsed() {
    console.log("cachedResponseWillBeUsed");
  }

  async handlerDidError({request, error}: { request: Request, error: Error }) {
    const cachedResponse = await caches.match(request);
    console.log("handlerDidError ", error instanceof TypeError, typeof error, request.url, cachedResponse?.status);

    if (cachedResponse) {
      console.log("Serving from cache:", request.url);

      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({type: "CACHE_HIT", url: request.url});
        console.log("CACHE_HIT message sent to client (fetchDidFail");
      });
      return cachedResponse;
    }

    return undefined;
  }

}

export default OfflineNotifyWorkerPlugin;
