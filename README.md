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
index.html                 # 顶栏 Tab 壳：同页切换三个工具（iframe 保活）
tools/weekly-report/       # 周报填写助手
tools/image-stitch/        # 图片拼接 + 标注
tools/clipboard/           # 共享剪贴板（MQTT 公共通道同步）
```

打开根目录即可在一个浏览器标签里切换工具，已打开过的工具不会卸载。共享剪贴板进过房间的话，打开工具箱时会在后台自动连上；切去拼图 / 写周报也保持连接，收到内容时顶栏显示未读数并弹出提醒。也可直接访问 `#weekly` / `#stitch` / `#clipboard`。

新增工具：在 `tools/` 下新建目录放 `index.html`，再在根目录 `index.html` 的 `TOOLS` 数组里加一项（id、名称、路径、一句话说明），并在 `ICONS` 里给同一个 id 配一个图标。
