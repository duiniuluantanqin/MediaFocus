# 📹 Media Info Parser

A web-based media information parsing tool built with React and FFmpeg WebAssembly.

## 🌟 Features

- **Web-based**: No installation required, runs entirely in the browser
- **FFmpeg WebAssembly**: Powerful media analysis using FFmpeg compiled to WebAssembly
- **File Upload**: Drag and drop or click to upload media files
- **Media Information**: Extract detailed information from video and audio files
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Privacy-focused**: All processing happens locally in your browser

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/duiniuluantanqin/MediaInfo.git
cd MediaInfo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 📦 Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Media Processing**: FFmpeg WebAssembly (@ffmpeg/ffmpeg)
- **Styling**: CSS3 with modern features

## 📖 Usage

1. Wait for FFmpeg to load (first-time loading may take a few moments)
2. Click on the upload area or drag and drop a media file
3. Click "Parse Media Info" to analyze the file
4. View the extracted media information
5. Click "Parse Another File" to analyze a different file

## 🎨 Features in Detail

### Supported File Types

- Video files: MP4, AVI, MOV, MKV, WebM, etc.
- Audio files: MP3, WAV, AAC, FLAC, OGG, etc.

### Information Extracted

- File name
- File size
- File type/MIME type
- Last modified date
- Media metadata (when available)

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
MediaInfo/
├── public/           # Static assets
├── src/
│   ├── App.jsx      # Main application component
│   ├── App.css      # Application styles
│   ├── main.jsx     # Entry point
│   └── index.css    # Global styles
├── index.html       # HTML template
├── package.json     # Dependencies and scripts
└── vite.config.js   # Vite configuration
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [FFmpeg](https://ffmpeg.org/) - The powerful multimedia framework
- [FFmpeg.wasm](https://github.com/ffmpegwasm/ffmpeg.wasm) - FFmpeg compiled to WebAssembly
- [React](https://react.dev/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
