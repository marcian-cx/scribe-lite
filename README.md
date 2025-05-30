# SCRIBE-AI

A minimal poetry IDE built with React, Electron, and Monaco Editor for distraction-free creative writing.

## ✨ Features

- **📁 Direct Folder Integration** - Connect to any folder on your computer
- **📝 Monaco Editor** - Professional code editor optimized for poetry writing
- **🎨 Beautiful UI** - Clean, dark theme designed for focus
- **💾 Auto-Save** - Files save directly to your chosen folder
- **🗂️ File Management** - Create, rename, delete, and organize your .md files
- **⌨️ Keyboard Shortcuts** - `Cmd+S` to save, `Cmd+N` for new file
- **🖥️ Desktop App** - Native Electron app for macOS, Windows, and Linux

## 🛠 Tech Stack

- **React** - Modern UI framework for component-based architecture
- **Electron** - Cross-platform desktop app framework
- **Vite** - Fast development server and build tool
- **Monaco Editor** - VS Code's editor for syntax highlighting and editing
- **Lucide React** - Beautiful icon library

## 🚀 Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server (React + Electron)
npm run electron:dev

# Build for production
npm run build

# Package as desktop app
npm run pack
```

### Available Scripts

- `npm run dev` - Start Vite development server only
- `npm run electron:dev` - Start both Vite and Electron in development mode
- `npm run build` - Build for production
- `npm run pack` - Package as desktop app (no publishing)
- `npm run dist` - Build and distribute (with publishing)

## 📁 Project Structure

```
scribe-ai/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.js          # Main Electron process
│   │   └── preload.js       # Preload script for secure IPC
│   ├── renderer/            # React UI (renderer process)
│   │   ├── App.jsx          # Main React component
│   │   ├── main.jsx         # React entry point
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useProjectFolder.js
│   │   │   └── useNotifications.js
│   │   └── styles/
│   │       └── global.css   # Global styles
│   └── components/          # React components
│       ├── WelcomeScreen.jsx
│       ├── LoadingScreen.jsx
│       ├── Sidebar.jsx
│       ├── FileItem.jsx
│       └── EditorArea.jsx
├── package.json
├── vite.config.js           # Vite configuration
└── index.html              # Main HTML file
```

## 🎯 Usage

1. **Launch the app** - Run `npm run electron:dev` or use the built desktop app
2. **Connect a folder** - Choose a folder where your poetry files live
3. **Start writing** - Create new .md files or edit existing ones
4. **Save your work** - Press `Cmd+S` or use the "Save Current" button
5. **Organize files** - Rename, delete, or create new files as needed

## 🔧 Configuration

### Editor Settings

The Monaco editor is configured for poetry writing with:
- Crimson Text font for beautiful typography
- Word wrap enabled
- Line numbers disabled for distraction-free writing
- Dark theme optimized for long writing sessions
- Markdown syntax highlighting

### File Management

- Only `.md` (Markdown) files are displayed and managed
- Files are saved directly to your chosen folder
- Automatic welcome file creation for empty folders
- Real-time file tree updates

## 🚧 Future Features

- **AI Assistant** - Integration with OpenAI for writing assistance
- **REFLECT Mode** - AI-powered poetry analysis and feedback
- **Export Options** - PDF, HTML, and other format exports
- **Themes** - Multiple editor themes and typography options
- **Plugin System** - Extensible architecture for custom features

## 🤝 Contributing

This is a personal poetry writing tool, but contributions are welcome! Please feel free to:

- Report bugs or issues
- Suggest new features
- Submit pull requests
- Share feedback on the writing experience

## 📄 License

MIT License - feel free to use this for your own creative writing projects!

---

**Happy writing! 🎭✨** 