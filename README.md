# rn_0741

[![React Native](https://img.shields.io/badge/React_Native-0.74.1-61DAFB)](https://reactnative.dev/docs/0.74/getting-started)
[![React](https://img.shields.io/badge/React-18.2.0-20232A)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-3178C6)](https://www.typescriptlang.org/)

用 React Native **0.74.1** 搭的一个单页实验工程，名字和包名都是 `rn_0741`。界面把左侧 `ScrollView` 和右侧 `Animated.FlatList` 并排放在同一屏，用来看嵌套滚动、滚动驱动动画、下拉刷新和 `scrollToOffset`。

工程从 [`@react-native-community/cli`](https://github.com/react-native-community/cli) 模板生成，随后只改了 `App.tsx`，并把 Android 的新架构开关打开。没有路由、网络接口、本地存储或额外原生模块。

## 界面内容

根组件是横向 `flexDirection: 'row'` 的一屏，没有导航。

| 区域 | 实现 | 表现 |
| --- | --- | --- |
| 左侧，约占屏幕宽 30% | `ScrollView`，背景粉色 | 固定渲染 100 行，每行文案为 `View {序号}`，行高 100、浅蓝色、上下外边距 20 |
| 右侧，约占屏幕宽 70% | `Animated.FlatList` | 挂载后生成 100 条数据。每项高 300，包含一个按钮、一张远程图片、一段白色文案 `FlatList Body Content`，以及会随滚动位移的文字 `Animated Text` |

右侧列表的交互都写在 `App.tsx` 里：

- **数据**：`id` 为 `0..99`。`id` 为奇数时额外带上 `title`、`content` 字段，但 `renderItem` 没有读取这两个字段，每一项画出来的结构相同。
- **入场动画**：挂载后用 `Animated.parallel` 在 5 秒内把图片透明度从 0 调到 1、缩放从 0.5 调到 2（`useNativeDriver: false`）。
- **滚动联动**：纵向偏移在 `0..3000` 内，把格子背景从绿色插值到红色，图片旋转 `0deg..360deg`，底部文字向下平移 `0..30`。滚动过程中 `onScroll` 会在控制台打印 `Hide guide`。
- **按钮**：文案 `FlatListStuckAndStopped`。按下后调用 `scrollToOffset({ offset: 1000, animated: false })`。
- **下拉刷新**：`RefreshControl` 的标题在 `Pull to refresh` 与 `Loading...` 之间切换。松手后约 2 秒结束刷新，列表数据本身不会变。
- **图片地址**：`http://e.hiphotos.baidu.com/image/pic/item/a1ec08fa513d2697e542494057fbb2fb4316d81e.jpg`。

## 技术栈

版本取自 `package.json` 与 `yarn.lock` 中已锁定的解析结果。

| 类别 | 版本 |
| --- | --- |
| React Native | 0.74.1 |
| React / react-test-renderer | 18.2.0 |
| TypeScript | 5.0.4 |
| `@react-native/babel-preset`、`metro-config`、`eslint-config`、`typescript-config` | 0.74.83 |
| Metro（本环境实际启动时的横幅） | 0.80.12 |
| Babel `@babel/core`、`preset-env`、`runtime` | 7.24.5 |
| Jest / babel-jest | 29.7.0 |
| ESLint | 8.57.0 |
| Prettier | 2.8.8 |
| `@types/react` | 18.3.1 |

原生配置：

| 平台 | 事实 |
| --- | --- |
| Android | `applicationId` `com.rn_0741`，`versionName` 1.0 / `versionCode` 1。`minSdk` 23，`compileSdk` / `targetSdk` 34，Build Tools 34.0.0，NDK `26.1.10909125`，Kotlin 1.9.22，Gradle 8.6。`hermesEnabled=true`，`newArchEnabled=true`。ABI：`armeabi-v7a`、`arm64-v8a`、`x86`、`x86_64`。Release 未开 ProGuard，签名仍使用模板里的 debug keystore |
| iOS | 显示名 `rn_0741`，Bundle ID `org.reactjs.native.example.rn_0741`，Marketing Version 1.0，部署目标 iOS 13.4。Podfile 为 0.74 模板，没有额外 Pod。Hermes 默认开启（仅当环境变量 `USE_HERMES=0` 时关闭）。新架构要在 `pod install` 时设置 `RCT_NEW_ARCH_ENABLED=1` 才会打开；当前 Podfile 没有设置该变量 |

## 目录

```text
.
├── App.tsx                  # 全部界面：左 ScrollView + 右 Animated.FlatList
├── index.js                 # AppRegistry.registerComponent('rn_0741', ...)
├── app.json                 # name / displayName 均为 rn_0741
├── __tests__/App.test.tsx   # 模板自带的渲染冒烟测试
├── android/                 # Kotlin 工程，MainActivity / MainApplication
├── ios/                     # Xcode 工程与 Podfile
├── babel.config.js          # @react-native/babel-preset
├── metro.config.js          # 默认 Metro 配置，无自定义项
├── jest.config.js           # preset: react-native
├── tsconfig.json            # 继承 @react-native/typescript-config
├── package.json             # 脚本与依赖，private，版本 0.0.1
├── yarn.lock                # Yarn v1 lockfile
└── Gemfile                  # Ruby >= 2.6.10，CocoaPods >= 1.13 且 < 1.15
```

`android/`、`ios/` 下的启动图标、启动页和测试 target 都是 CLI 模板原样，没有业务资源。

## 环境要求

- Node.js **>= 18**（`package.json` 的 `engines`）。
- Yarn 1。仓库用 `yarn.lock` 锁依赖。
- Android：Android SDK（对应上面的 SDK 34 / NDK）、Gradle 8.6 自带的 wrapper。React Native 0.74 的[环境文档](https://reactnative.dev/docs/0.74/set-up-your-environment)要求 JDK 17。
- iOS：macOS、Xcode，以及能满足 `Gemfile` 的 Ruby 与 CocoaPods。需要先在 `ios/` 执行 `bundle install` 和 `bundle exec pod install`。

## 安装

`yarn.lock` 里每条 `resolved` 都指向内网源 `http://registry.npm.release.ctripcorp.com`。能访问该源时：

```bash
yarn install
```

公网解析不到这个域名。本仓库在当前环境用公共 npm 源、按 `package.json` 的版本范围安装可以完成（devDependency 的补丁版本可能与 lockfile 不完全相同）：

```bash
npm install --registry https://registry.npmjs.org
```

iOS 依赖（仅 macOS）：

```bash
bundle install
cd ios && bundle exec pod install && cd ..
```

## 运行

脚本定义在 `package.json`：

| 命令 | 作用 |
| --- | --- |
| `yarn start` | 启动 Metro |
| `yarn android` | `react-native run-android` |
| `yarn ios` | `react-native run-ios`（需要 macOS） |
| `yarn test` | Jest |
| `yarn lint` | `eslint .` |

先启动打包器，再另开终端装到模拟器或真机：

```bash
yarn start
yarn android   # 或 yarn ios
```

改完 `App.tsx` 后，Android 在设备上按两次 `R`，或打开开发菜单（Linux / Windows 为 `Ctrl` + `M`）选 Reload。iOS 模拟器使用 `Cmd` + `R`。

### 本次实际跑过的步骤

在 Linux、Node v22.23.4 上核对过：

- 直接按 lockfile 访问 `registry.npm.release.ctripcorp.com` 失败（DNS `ENOTFOUND`）。
- 使用公共 npm 源执行 `npm install` 成功。
- `npx react-native start` 后，`http://127.0.0.1:8081/status` 返回 `packager-status:running`。
- 向 Metro 请求 Android 开发包 `index.bundle?platform=android&dev=true` 返回 HTTP 200（约 6.1 MB），JavaScript 能打成包。

下面几项在这台机器上没有跑，仓库里也没有对应的工具链：

- `yarn android` / Gradle：未安装 Android SDK。
- `yarn ios` / CocoaPods：没有 Xcode，且系统不是 macOS。

### 测试与静态检查的当前结果

这三项都执行过，目前都未通过，原因在现有 `App.tsx`，而不是缺脚本：

- `yarn test`（Jest，`--watchman=false --ci`）失败。模板测试只做 `renderer.create(<App />)`。组件挂载后的 `useEffect` 调用 `Animated.parallel` 时，Jest 环境已经拆掉，报 `Cannot read properties of undefined (reading 'parallel')`。
- `yarn lint` 失败：2 个 error、9 个 warning。error 是 `renderItem` 的 `item` 与 `onScroll` 的 `event` 未使用；warning 主要是内联样式，以及在渲染函数里定义了 `FlatListBody`。
- `npx tsc --noEmit` 失败。`flatListData` 被推断成 `never[]`，`forwardRef` 的 ref 与 `scrollToOffset` 的类型也对不上。`package.json` 没有单独的 `tsc` 脚本。

## 阅读代码时的几处行为

- `animatedValue` 写在 `FlatListDemo` 函数体里（`new Animated.Value(0)`），没有放进 `useRef`。组件每次重渲染都会换成一个新的、从 0 开始的动画值。
- 远程图片是 **http**。iOS `Info.plist` 里 `NSAllowsArbitraryLoads` 为 `false`；Android 清单只声明了 `INTERNET`，没有 `usesCleartextTraffic`。系统默认策略下这张图可能加载不出来。
- 下拉刷新只切换 `refreshing` 和标题，不改列表数据。
- Release 包仍用 debug keystore，对应 `android/app/build.gradle` 里模板留下的注释。

## 参考

- [React Native 0.74 文档](https://reactnative.dev/docs/0.74/getting-started)
- [环境搭建](https://reactnative.dev/docs/0.74/set-up-your-environment)
- [Metro](https://reactnative.dev/docs/0.74/metro)
- [Animated](https://reactnative.dev/docs/0.74/animated)
- [FlatList](https://reactnative.dev/docs/0.74/flatlist)
- [签名发布 Android 包](https://reactnative.dev/docs/0.74/signed-apk-android)
