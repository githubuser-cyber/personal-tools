 个人工具箱

离线单页小工具集合，可部署到 GitHub Pages。

## 本地打开

直接用浏览器打开根目录 `index.html`，或：

```bash
cd personal-tools
python -m http.server 8080
```

访问 `http://127.0.0.1:8080/`

## GitHub Pages

1. 把本仓库推到 GitHub（Public）
2. Settings → Pages → Branch 选 `main`，目录 `/ (root)`
3. 访问：`https://你的用户名.github.io/仓库名/`

## 目录

```text
index.html                 # 工具主页
tools/weekly-report/       # 周报填写助手
tools/image-stitch/        # 图片拼接 + 标注
tools/clipboard/           # 共享剪贴板（WebRTC；PeerJS 本地化，信令仍需联网）
```

新增工具：在 `tools/` 下新建目录放 `index.html`，并在根目录 `index.html` 的 `tools` 数组里加一项。
