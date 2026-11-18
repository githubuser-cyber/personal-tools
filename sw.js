/*
 * 个人工具箱离线缓存。
 * 同源 GET 一律「先给缓存、后台拉新」：打开秒出、断网可用；页面文件有变化时通知页面提示刷新。
 * 缓存口径整体变动时才需要改 CACHE_NAME，平时发版不用动这里。
 */
const CACHE_NAME = "pt-cache-v2";
const PRECACHE_URLS = [
  "./",
  "./manifest.webmanifest",
  "./assets/pwa.js",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./tools/weekly-report/",
  "./tools/image-stitch/",
  "./tools/clipboard/"
];
const UPDATE_MESSAGE = "pt-sw-updated";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  if (new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(staleWhileRevalidate(event));
});

function isPage(request) {
  return request.mode === "navigate" || request.destination === "document" || request.destination === "iframe";
}

function versionTag(response) {
  return response.headers.get("etag") || response.headers.get("last-modified") || "";
}

/** 只比较页面文件：有版本头就比版本头，没有再比全文；变了就广播给所有窗口 */
async function notifyIfPageChanged(cached, fresh) {
  const cachedTag = versionTag(cached);
  const freshTag = versionTag(fresh);
  const changed = cachedTag && freshTag
    ? cachedTag !== freshTag
    : (await cached.clone().text()) !== (await fresh.clone().text());
  if (!changed) return;
  const windows = await self.clients.matchAll({ type: "window" });
  windows.forEach((client) => client.postMessage({ type: UPDATE_MESSAGE }));
}

async function staleWhileRevalidate(event) {
  const request = event.request;
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const refresh = fetch(request).then(async (response) => {
    if (response.ok && response.type === "basic") {
      if (cached && isPage(request)) await notifyIfPageChanged(cached, response.clone());
      await cache.put(request, response.clone());
    }
    return response;
  });
  if (cached) {
    event.waitUntil(refresh.catch((err) => console.warn("后台更新缓存失败（多半是断网）", request.url, err)));
    return cached;
  }
  try {
    return await refresh;
  } catch (err) {
    // 断网又没缓存过的页面，退回工具箱首页，至少能进到已缓存的工具
    const fallback = isPage(request) ? await cache.match("./") : null;
    if (fallback) return fallback;
    throw err;
  }
}
