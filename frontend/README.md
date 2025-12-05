# LaTeX Resume Builder - Setup Instructions

## Project Structure

```
resume-builder/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── InputPanel.jsx
│   │   ├── CodeEditor.jsx
│   │   └── PreviewPanel.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Setup Steps

### 1. Create React App

```bash
npx create-react-app resume-builder
cd resume-builder
```

### 2. Create Component Directory

```bash
mkdir src/components
```

### 3. Create Component Files

Create the following files in `src/components/`:
- `Header.jsx`
- `Sidebar.jsx`
- `InputPanel.jsx`
- `CodeEditor.jsx`
- `PreviewPanel.jsx`

Copy the code from the artifacts above into each respective file.

### 4. Replace App Files

Replace the contents of:
- `src/App.jsx` with the App.jsx artifact code
- `src/App.css` with the App.css artifact code

### 5. Update index.css (Optional)

Replace `src/index.css` with:

```css
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
```

### 6. Update index.js

Make sure `src/index.js` looks like this:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7. Install Dependencies (if needed)

The basic setup doesn't require additional dependencies, but for future enhancements you might want:

```bash
# For API calls to LLM
npm install axios

# For better code editing
npm install react-codemirror2 codemirror

# For LaTeX to PDF conversion (optional)
npm install latex.js
```

### 8. Run the Application

```bash
npm start
```

The app should open at `http://localhost:3000`

## Next Steps - Backend Integration

To connect with an LLM for LaTeX generation:

### 1. Create API Endpoint

```javascript
// In your backend (Node.js/Express example)
app.post('/api/generate-resume', async (req, res) => {
  const { jobDescription, oldResume, template } = req.body;
  
  // Call OpenAI/Claude API
  const response = await callLLMAPI({
    prompt: `Generate LaTeX resume code based on:
    Job Description: ${jobDescription}
    Old Resume: ${oldResume}
    Template: ${template}`,
  });
  
  res.json({ latexCode: response });
});
```

### 2. Update Frontend to Call API

In `App.jsx`, modify the `handleGenerate` function:

```javascript
const handleGenerate = async () => {
  setIsGenerating(true);
  try {
    const response = await fetch('/api/generate-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobDescription,
        oldResume,
        template: selectedTemplate,
      }),
    });
    const data = await response.json();
    setLatexCode(data.latexCode);
  } catch (error) {
    console.error('Error generating resume:', error);
  }
  setIsGenerating(false);
};
```

## Features to Add

1. **LaTeX to PDF Compilation**: Integrate LaTeX.js or use a backend service
2. **Real-time Preview**: Better LaTeX parser or iframe preview
3. **Template Management**: Load different LaTeX templates
4. **Export Options**: Download as .tex, .pdf, or .docx
5. **User Authentication**: Save and manage multiple resumes
6. **AI Integration**: Connect to Claude/GPT-4 API

## Troubleshooting

- **Module not found**: Make sure all files are in the correct directories
- **Styles not loading**: Check that App.css is imported in App.jsx
- **Components not rendering**: Verify all imports are correct

## Resources

- [Overleaf LaTeX Documentation](https://www.overleaf.com/learn)
- [React Documentation](https://react.dev)
- [LaTeX Resume Templates](https://www.overleaf.com/gallery/tagged/cv)