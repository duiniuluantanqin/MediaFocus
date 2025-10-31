# 📹 MediaFocus

基于 React 和 FFmpeg WebAssembly 构建的网页版媒体信息解析工具。

[English](README.md) | 简体中文

## 🌟 特性

- **网页版应用**：无需安装，完全在浏览器中运行
- **FFmpeg WebAssembly**：使用编译为 WebAssembly 的 FFmpeg 进行强大的媒体分析
- **全面解析**：从视频和音频文件中提取详细信息，包括：
  - 文件名、大小和类型
  - 时长、分辨率和宽高比
  - 视频/音频编解码器
  - 帧率和比特率
  - 音频采样率
  - 更多元数据
- **文件上传**：支持拖放或点击上传媒体文件
- **现代化界面**：美观、响应式的界面，流畅的动画效果
- **注重隐私**：所有处理都在浏览器本地进行 - 不会将数据上传到任何服务器

## 🚀 快速开始

### 前置要求

- Node.js 18 或更高版本
- npm 或 yarn

### 安装

1. 克隆仓库：
```bash
git clone https://github.com/duiniuluantanqin/MediaFocus.git
cd MediaFocus
```

2. 安装依赖：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

4. 在浏览器中访问 `http://localhost:5173`

## 📦 构建

构建生产版本：

```bash
npm run build
```

构建后的文件将位于 `dist` 目录中。

## 🛠️ 技术栈

- **前端框架**：React 19
- **构建工具**：Vite 7
- **媒体处理**：FFmpeg WebAssembly (@ffmpeg/ffmpeg)
- **样式**：CSS3 现代特性

## 📖 使用方法

1. 等待 FFmpeg 加载（首次加载可能需要几秒钟）
2. 点击上传区域或拖放媒体文件
3. 点击"分析媒体"按钮来分析文件
4. 查看提取的媒体信息，包括编解码器、分辨率、比特率等
5. 点击"解析其他文件"来分析不同的文件

## 🎨 功能详情

### 支持的文件类型

- 视频文件：MP4、AVI、MOV、MKV、WebM、FLV 等
- 音频文件：MP3、WAV、AAC、FLAC、OGG、M4A 等

FFmpeg 支持几乎所有媒体格式，使该工具具有很高的通用性。

### 提取的信息

- **文件名**：原始文件名
- **文件大小**：以字节、KB、MB 或 GB 为单位的大小
- **文件类型**：文件的 MIME 类型
- **时长**：媒体的长度
- **分辨率**：宽度 x 高度（视频文件）
- **宽高比**：计算的宽高比（视频文件）
- **视频编解码器**：视频流的编码格式
- **音频编解码器**：音频流的编码格式
- **帧率**：视频文件的 FPS
- **比特率**：媒体的数据速率
- **采样率**：音频采样率（Hz）
- **最后修改时间**：文件最后修改的日期和时间

## 🔧 开发

### 脚本命令

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run preview` - 预览生产构建
- `npm run lint` - 运行 ESLint

### 项目结构

```
MediaFocus/
├── public/
│   └── ffmpeg/       # FFmpeg WASM 核心文件
├── src/
│   ├── App.jsx      # 主应用组件
│   ├── App.css      # 应用样式
│   ├── main.jsx     # 入口文件
│   └── index.css    # 全局样式
├── index.html       # HTML 模板
├── package.json     # 依赖和脚本
└── vite.config.js   # Vite 配置
```

## 📝 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

## 🙏 致谢

- [FFmpeg](https://ffmpeg.org/) - 强大的多媒体框架
- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - 编译为 WebAssembly 的 FFmpeg
- [React](https://react.dev/) - 用于构建 Web 和原生用户界面的库
- [Vite](https://vitejs.dev/) - 下一代前端工具

