# ProResume Builder (MERN Stack)

A professional, high-performance CV builder built with React, Node.js, Express, and MongoDB.

## Features

- **Modern UI**: Sleek, glassmorphism-based design with smooth animations (Framer Motion).
- **Live Preview**: Real-time CV preview as you type.
- **Rich Text Support**: Professional formatting for experience descriptions using a rich text editor.
- **Dual Export**: Export your CV in both **PDF** and **Word (.doc)** formats.
- **Section-based Editing**: Organized forms for Personal Info, Experience, Education, Skills, Projects, and Languages.
- **Template Consistency**: Pre-defined professional template ensuring perfect alignment and typography.

## Tech Stack

- **Frontend**: React (Vite), CSS3, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.
- **Database**: MongoDB (via Mongoose).
- **Libraries**: `react-to-print`, `react-quill`, `axios`.

## Getting Started

### Prerequisites

- Node.js installed.
- MongoDB running locally (default: `mongodb://localhost:27017/cvbuilder`).

### Running the Project

1. **Start the Server**:
   ```bash
   cd server
   npm install
   node index.js
   ```

2. **Start the Client**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## File Structure

- `/client`: React frontend application.
  - `/src/components`: UI components (ResumePreview, etc.).
  - `/src/pages`: Page layouts (Home, ResumeEditor).
  - `/src/index.css`: Global styles and design system.
- `/server`: Node.js/Express backend.
  - `index.js`: Main server file with API routes and MongoDB schema.
