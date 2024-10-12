## mtk-playground

  这是一个为 [maptalks](https://github.com/maptalks/maptalks.js) 提供示例展示的一个基础模板。
通过对接 [@vue/repl](https://github.com/vuejs/repl) 和 [github api](https://docs.github.com/en/rest)
实现了一个简单的在线编辑器。这样可以方便的在线编辑代码，并且可以预览效果；并且允许我们新增和编辑示例，方便我们进行
bug report 和 feature request。

### 如何使用

这里分为了两个仓库 [mtk-playground]() 和示例存储库 [mtk-playgrounds-store]()，简单来说[mtk-playground]()提供了
基本应用，[mtk-playgrounds-store]()则提供了示例存储作用。

1. clone [mtk-playground]()

```bash
git clone https://github.com/maptalks/mtk-playground.git
```

2. clone [mtk-playgrounds-store]()

```bash
git clone https://github.com/maptalks/mtk-playgrounds-store.git .playgrounds
```

3. 安装依赖

注意这里需要的 node 版本为 `20.18.0`，如果不符合此版本要求可以通过 [fnm](https://github.com/Schniz/fnm) 或者 [nvm](https://github.com/nvm-sh/nvm) 来切换版本

```bash
pnpm i
```

执行以上命令后除了安装必要的依赖外，还会安装 puppeteer chrome，耗时可能会比较长，请耐心等待。

4. 新建环境变量文件

```bash
touch .env.local

# 以下变量需要根据实际情况进行替换

# github 授权 token
VITE_AUTH_TOKEN=
# 示例仓库 owner
VITE_GITHUB_OWNER=
# 示例仓库名称
VITE_GITHUB_REPO=
# 通用作者名称
VITE_COMMON_AUTHOR_NAME=
# 通用作者邮箱
VITE_COMMON_AUTHOR_EMAIL=
```

5. 启动项目

```bash
pnpm start
```

但是我们直接启动的话在示例列表中缩略图会显示不正常，所以需要我们手动进行缩略图的生成。
首先我们需要根据 `mtk-playgrounds-store` 中的示例生成路由，然后根据路由生成缩略图。

```bash
# 生成路由  
pnpm build:pls
# 生成缩略图
pnpm build:thumbnail
```

这两步实际上就是根据克隆下的示例目录生成路由（目录层级固定），然后构建，再使用无头浏览器进行页面访问-截图生成缩略图。
生成的示例会保存在 `public/thumbnails` 目录下 (此处待讨论，是否需要直接保存仓库中)。


### 如何新增示例

#### 本地新增示例

常规情况下在应用发布后我们可以直接在线编辑示例，但是如果我们需要更快速的新增示例，可以在 `mtk-playgrounds-store` 中新增所需的内容。

并且需要说明的是，新增的示例需要符合 `mtk-playgrounds-store` 中的目录结构，否则会导致示例生成失败，目前示例目录结构如下：

```bash
.
├── basic
│   ├── map
│   │   └── load
│   │       │── src
│   │       │    │── App.vue # 示例代码
│   │       │    └── main.js # 不可修改，自动生成
│   │       │── package.json # 依赖
│   │       │── tsconfig.json # 不可修改，自动生成
│   │       │── import-map.json # import map 文件
│   │       │── README.md # 示例说明文件
│   │       │── vite.config.js # 不可修改，自动生成
│   │       └── index.html # 不可修改，自动生成
```

我们主要修改的是 `src/App.vue` 中的代码，`package.json` 中的依赖和 `import-map.json` 中的依赖以及`README.md` 中的内容。

修改完成后单个示例可以独立运行调试，确认无问题后，可以提交代码，然后通过 [mtk-playground]() 中的步骤 4 和 5 生成示例。

#### 在线新增示例

一般情况下我们可以通过 [mtk-playground]() 中的在线编辑器来新增示例，但是需要注意的是这里的新增并不是实时的，我们每次保存会在 github 上创建一个 PR，然后需要管理者 Review 后进行合并，然后我们才可以看到对应的示例。当然针对这种情况后续会升级在线编辑器运行我们切换分支浏览。

### 资源 Resource

大部分的示例我们可能不需要外部静态资源，但是也有一些示例需要外部静态资源，比如地图 icon 、模型等，暂时考虑的是将这些资源暂存 `public` 目录下，后续规划了一个资源上传和管理的面板（暂未实现）

### 多语言

目前示例中大部分的映射已经整理到 `src/locales` 中，通过 [vue-i18n](https://github.com/intlify/vue-i18n) 来实现多语言支持，后续的示例新增需要管理者来修改对应的映射（此处可否在线协作？）
