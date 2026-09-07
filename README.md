# Premium Markdown Notes

A premium, modern Markdown Notes web application.

## Features

- **Premium UI/UX:** 2026-era design with glassmorphism, depth effects, and smooth animations.
- **Markdown Editor:** Live preview, syntax highlighting, and toolbar for quick formatting.
- **Persistence:** All notes are saved locally in the browser's `localStorage`.
- **Theme Support:** Polished Light and Dark modes.
- **Responsiveness:** Works beautifully on desktop, tablet, and mobile devices.
- **Micro-interactions:** Interactive cursor, animated cards, and responsive UI elements.
- **Keyboard Shortcuts:** Efficient keyboard-driven workflow.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion (Animations)
- React Markdown (Rendering)

## Local Development

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Build

Build the application for production:

```bash
npm run build
```

## Docker

Build and run the application using Docker:

```bash
docker build -t markdown-notes .
docker run -p 80:80 markdown-notes
```
