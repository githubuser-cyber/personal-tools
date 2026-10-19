/*
 * 个人工具箱 PWA 引导：注册离线缓存，页面有新版本时在顶部提示刷新。
 * 工具页嵌在工具箱里时由外层工具箱负责，这里只在顶层页面运行；http 明文访问时浏览器不允许注册，直接跳过。
 */
(() => {
  if (window.self !== window.top) return;
  const script = document.currentScript;
  if (!script || !("serviceWorker" in navigator) || !window.isSecureContext) return;

  const UPDATE_MESSAGE = "pt-sw-updated";
  const rootUrl = new URL("../", script.src);
  const BANNER_CSS = [
    ".pt-update{position:fixed;left:50%;top:calc(var(--pt-banner-top,12px) + env(safe-area-inset-top));z-index:2147483000;",
    "display:flex;align-items:center;gap:10px;max-width:calc(100vw - 24px);padding:6px 6px 6px 16px;",
    "font:500 13px/1.4 \"Segoe UI\",\"PingFang SC\",\"Microsoft YaHei\",sans-serif;color:#1e2533;",
    "background:rgba(255,255,255,.84);border:1px solid rgba(255,255,255,.9);border-radius:999px;",
    "box-shadow:0 12px 32px rgba(30,41,90,.18);-webkit-backdrop-filter:saturate(160%) blur(16px);backdrop-filter:saturate(160%) blur(16px);",
    "transform:translateX(-50%);animation:pt-update-in .25s ease-out}",
    ".pt-update-go{height:30px;padding:0 14px;font:inherit;font-weight:600;color:#fff;",
    "background:linear-gradient(135deg,#1677ff,#7c5cff);border:0;border-radius:999px;cursor:pointer}",
    ".pt-update-go:hover{filter:brightness(1.08)}",
    ".pt-update-close{width:30px;height:30px;font:inherit;font-size:18px;line-height:1;color:#8790a3;",
    "background:transparent;border:0;border-radius:50%;cursor:pointer}",
    ".pt-update-close:hover{color:#1e2533;background:rgba(30,41,59,.06)}",
    "@keyframes pt-update-in{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}",
    "@media (prefers-reduced-motion:reduce){.pt-update{animation:none}}"
  ].join("");

  function showUpdateBanner() {
    if (document.getElementById("ptUpdateBanner")) return;
    const style = document.createElement("style");
    style.textContent = BANNER_CSS;
    document.head.appendChild(style);

    const bar = document.createElement("div");
    bar.id = "ptUpdateBanner";
    bar.className = "pt-update";
    bar.setAttribute("role", "status");
    const text = document.createElement("span");
    text.textContent = "工具箱有新版本，刷新后生效";
    const reload = document.createElement("button");
    reload.type = "button";
    reload.className = "pt-update-go";
    reload.textContent = "立即刷新";
    reload.addEventListener("click", () => location.reload());
    const later = document.createElement("button");
    later.type = "button";
    later.className = "pt-update-close";
    later.textContent = "×";
    later.title = "稍后再说，下次打开自动是新版";
    later.setAttribute("aria-label", "稍后再说");
    later.addEventListener("click", () => bar.remove());
    bar.append(text, reload, later);
    document.body.appendChild(bar);
  }

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === UPDATE_MESSAGE) showUpdateBanner();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("sw.js", rootUrl).href, { scope: rootUrl.href }).catch((err) => {
      console.error("离线缓存注册失败，工具照常可用，只是断网时打不开", err);
    });
  });
})();
