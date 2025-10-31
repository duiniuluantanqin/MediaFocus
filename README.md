# 📹 Media Info Parser

A web-based media information parsing tool built with React and HTML5 Web APIs.

## 🌟 Features

- **Web-based**: No installation required, runs entirely in the browser
- **Native Browser APIs**: Uses HTML5 Media APIs for fast and efficient parsing
- **File Upload**: Drag and drop or click to upload media files
- **Media Information**: Extract detailed information from video and audio files including:
  - File name, size, and type
  - Duration (for audio/video files)
  - Resolution and aspect ratio (for video files)
  - MIME type
  - Last modified date
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
- **Media Processing**: HTML5 Media APIs (native browser capabilities)
- **Styling**: CSS3 with modern features

## 📖 Usage

1. Open the application in your web browser
2. Click on the upload area or drag and drop a media file
3. Click "Parse Media Info" to analyze the file
4. View the extracted media information including duration, resolution, and more
5. Click "Parse Another File" to analyze a different file

## 🎨 Features in Detail

### Supported File Types

- Video files: MP4, AVI, MOV, MKV, WebM, and more
- Audio files: MP3, WAV, AAC, FLAC, OGG, and more

Any media format supported by your browser will work with this tool.

### Information Extracted

- **File name**: Original filename
- **File size**: Size in bytes, KB, MB, or GB
- **File type**: MIME type of the file
- **Duration**: Length of the media (for audio/video)
- **Resolution**: Width x Height (for video files)
- **Aspect Ratio**: Calculated aspect ratio (for video files)
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

## 📸 Screenshots

### Main Interface
![Media Info Parser Interface](https://github.com/user-attachments/assets/62101fb2-c0fc-4e12-a089-b6222c957748)

### Parsed Results
![Parsed Media Information](https://github.com/user-attachments/assets/92cf208d-cfe2-4782-ac91-bb08317a76aa)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [React](https://react.dev/) - The library for web and native user interfaces
- [Vite](https://vitejs.dev/) - Next generation frontend tooling
- HTML5 Media APIs - Native browser capabilities for media processing
