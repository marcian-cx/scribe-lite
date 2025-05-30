import React, { useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

function EditorArea({ files, currentFile, onFileSelect, onSaveFile, onContentChange }) {
  const editorRef = useRef(null)
  const currentContent = useRef('')

  const currentFileData = currentFile ? files.get(currentFile) : null

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor

    // Configure Monaco for poetry writing
    monaco.editor.defineTheme('poetry-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        {
          token: 'comment',
          foreground: '6a9955'
        },
        {
          token: 'keyword',
          foreground: '569cd6'
        }
      ],
      colors: {
        'editor.background': '#1e1e1e',
        'editor.foreground': '#d4d4d4',
        'editorLineNumber.foreground': '#858585',
        'editorLineNumber.activeForeground': '#c6c6c6',
        'editor.selectionBackground': '#264f78',
        'editor.selectionHighlightBackground': '#264f7820',
        'editorCursor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#2a2d2e20',
        'editorWhitespace.foreground': '#404040'
      }
    })

    monaco.editor.setTheme('poetry-dark')

    // Configure markdown language features
    monaco.languages.setLanguageConfiguration('markdown', {
      wordPattern: /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,
    })

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave()
    })

    // Track content changes
    editor.onDidChangeModelContent(() => {
      const newContent = editor.getValue()
      currentContent.current = newContent
      
      // Notify parent of content change for modified state tracking
      if (currentFile && onContentChange) {
        onContentChange(currentFile, newContent)
      }
    })

    // Set focus
    editor.focus()
  }

  const handleSave = async () => {
    if (!currentFile || !editorRef.current) return

    const content = editorRef.current.getValue()
    try {
      await onSaveFile(currentFile, content)
    } catch (error) {
      // Error handling is managed by parent component
    }
  }

  // Update editor content when current file changes
  useEffect(() => {
    if (editorRef.current && currentFileData) {
      const currentValue = editorRef.current.getValue()
      if (currentValue !== currentFileData.content) {
        editorRef.current.setValue(currentFileData.content)
      }
    }
  }, [currentFileData])

  if (!currentFile || !currentFileData) {
    return (
      <div className="editor-container">
        <div className="editor-header">
          <div className="file-tabs"></div>
        </div>
        <div className="editor-area" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#858585',
          fontSize: '16px'
        }}>
          Select a file to start editing
        </div>
      </div>
    )
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="file-tabs">
          <div className="tab active">
            <span>{currentFileData.modified ? '● ' : ''}{currentFileData.name}</span>
          </div>
        </div>
      </div>
      
      <div className="editor-area">
        <Editor
          height="100%"
          language="markdown"
          value={currentFileData.content}
          onMount={handleEditorDidMount}
          options={{
            // Font configuration - CRITICAL for cursor alignment
            fontFamily: 'SF Mono, Monaco, Menlo, Consolas, "Courier New", monospace',
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
            letterSpacing: 0, // CRITICAL: Must be 0 to prevent cursor drift
            fontLigatures: false, // Disable ligatures to prevent cursor issues
            
            // Poetry-focused settings
            wordWrap: 'on',
            wordWrapColumn: 80,
            minimap: { enabled: false },
            lineNumbers: 'off',
            glyphMargin: false,
            folding: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 20, bottom: 20, left: 20, right: 20 },
            
            // Clean UI
            renderWhitespace: 'none',
            renderControlCharacters: false,
            hideCursorInOverviewRuler: true,
            overviewRulerBorder: false,
            renderLineHighlight: 'line',
            
            // Scrollbar styling
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
              useShadows: false,
            },
            
            // Disable distracting features
            suggest: {
              showWords: false,
              showSnippets: false,
            },
            quickSuggestions: false,
            parameterHints: { enabled: false },
            hover: { enabled: false },
            contextmenu: false,
            
            // Performance optimizations
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            cursorBlinking: 'smooth',
          }}
        />
      </div>
    </div>
  )
}

export default EditorArea 