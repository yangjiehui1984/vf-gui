[![npm version](https://badge.fury.io/js/vf-gui.svg)](https://badge.fury.io/js/vf-gui)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/vf-gui)

## vf-gui

vf-gui简称`gui`是基于VFJS引擎，使用TypeScript语言开发的开源UI库。 为VFJS提供提供基础可靠的UI组件。


## 学习(Learn) 

* [示例(Examples)](https://vipkid-edu.github.io/vf-gui/play)

* [API](https://vipkid-edu.github.io/vf-gui/api)

* [源码(Github)](https://github.com/vipkid-edu/vf-gui/)


## 安装(Setup) 

```
<script src="http://unpkg.com/@vf.js/vf/dist/vf.min.js"></script>
<script src="http://unpkg.com/@vf.js/gui/dist/gui.min.js"></script>
```

### 创建方式(Usage)：

    let button = new  vf.gui.Button();


## 如何构建(How build)

1. git clone https://github.com/vipkid-edu/vf-gui
1. npm i
1. setup Visual Studio Code
1. setup Visual Studio Code Extension (Debugger for Chrome）
1. setup Visual Studio Code Extension (ESLint）
1. setup Visual Studio Code Extension (Live Server）
1. run Live Server
1. npm run test
1. view http://127.0.0.1:5501/


## 组件(Component)

使用示例：https://vipkid-edu.github.io/vf-gui/play

可使用组件：

| 导入方式    |      名称       |
|----------|-------------|
| vf.gui.Stage |  UI舞台 |
| vf.gui.Container | 容器 |
| vf.gui.ScrollingContainer | 可滑动的容器 |
| vf.gui.Image | 图片 |
| vf.gui.Label | 文本 |
| vf.gui.TextInput | 输入文本 |
| vf.gui.Graphics | 绘制矢量 |
| vf.gui.Rect | 绘制矢量矩形 |
| vf.gui.Circle | 绘制矢量圆形 |
| vf.gui.Button | 按钮 |
| vf.gui.CheckBox | 单选与复选 |
| vf.gui.SpriteAnimated | 序列图 |
| vf.gui.Slider | 滑动/进度条 |
| vf.gui.FollowLine | 跟随鼠标划线与擦除 |
| vf.gui.ConnectLine | 连线 |
| vf.gui.Ticker | 心跳 |
| vf.gui.Tween | 缓动 |
| vf.gui.Timeline | 缓动 |
| vf.gui.Utils | 工具类 |


计划中：

    Recording/Audio - 麦克风
    Spine/DB - 龙骨
    Video - 视频
    Particle - 粒子
    DialogueText - 字幕
    Sequence - 动画序列图
    Accordion - 手风琴
    Http/WebSocket - 网络


## 请提交时进行`eslint`检测

    npm run lint


## Other

Chrome debug - windows

Right click the Chrome shortcut, and select properties
In the "target" field, append --remote-debugging-port=9222
Or in a command prompt, execute <path to chrome>/chrome.exe --remote-debugging-port=9222

Chrome debug - mac

In a terminal, execute /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

### License

This content is released under the (http://opensource.org/licenses/MIT) MIT License.
