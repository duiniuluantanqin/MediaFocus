# 📹 Media Info Parser

A web-based media information parsing tool built with React and FFmpeg WebAssembly.

## 🌟 Features

- **Web-based**: No installation required, runs entirely in the browser
- **FFmpeg WebAssembly**: Powerful media analysis using FFmpeg compiled to WebAssembly
- **Comprehensive Parsing**: Extract detailed information from video and audio files including:
  - File name, size, and type
  - Duration, resolution, and aspect ratio
  - Video/Audio codecs
  - Frame rate and bitrate
  - Sample rate for audio
  - And more metadata
- **File Upload**: Drag and drop or click to upload media files
- **Modern UI**: Beautiful, responsive interface with smooth animations
- **Privacy-focused**: All processing happens locally in your browser - no data is uploaded to any server

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
4. View the extracted media information including codecs, resolution, bitrate, and more
5. Click "Parse Another File" to analyze a different file

## 🎨 Features in Detail

### Supported File Types

- Video files: MP4, AVI, MOV, MKV, WebM, FLV, and more
- Audio files: MP3, WAV, AAC, FLAC, OGG, M4A, and more

FFmpeg supports virtually all media formats, making this tool highly versatile.

### Information Extracted

- **File name**: Original filename
- **File size**: Size in bytes, KB, MB, or GB
- **File type**: MIME type of the file
- **Duration**: Length of the media
- **Resolution**: Width x Height (for video files)
- **Aspect Ratio**: Calculated aspect ratio (for video files)
- **Video Codec**: Encoding format for video stream
- **Audio Codec**: Encoding format for audio stream
- **Frame Rate**: FPS for video files
- **Bitrate**: Data rate of the media
- **Sample Rate**: Audio sample rate in Hz
- **Last modified**: Date and time the file was last modified

## 🔧 Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
MediaInfo/
├── public/
│   └── ffmpeg/       # FFmpeg WASM core files
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
