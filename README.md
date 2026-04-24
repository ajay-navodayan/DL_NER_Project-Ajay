# Clinical NER - Medical Entity Recognition Website

## Overview
A modern, aesthetic single-page web application for medical Named Entity Recognition (NER) using BioBERT. The application extracts diseases, symptoms, and medical conditions from clinical text and PDF documents.

## Features

### 🏠 Home Section
- Hero section with engaging visuals
- Clear call-to-action buttons
- Statistics showcase (BioBERT model, 95%+ accuracy, real-time processing)
- Floating animated cards
- Smooth scroll navigation

### 🔬 Research Section
- Comprehensive project overview
- Model architecture details
- Technical implementation explanation
- Key features list
- Dataset and training information
- Real-world applications
- Processing pipeline visualization
- Technology stack badges

### ⚙️ Process Section
- **Text Input Tab**: Paste clinical notes for instant analysis
- **PDF Upload Tab**: Upload medical PDF documents
- Real-time entity highlighting
- Detailed entity table with:
  - Entity name
  - Entity type (Disease, Symptom, Sign)
  - Confidence score
  - Position in text
- Visual feedback with loading states
- Error handling

## Technology Stack

### Frontend
- React 18
- Modern CSS with CSS Variables
- Google Fonts (Inter, Space Grotesk)
- Responsive design
- Smooth animations

### Backend
- Flask REST API
- BioBERT (Transformers)
- PDFPlumber for PDF processing
- CORS enabled

## Design Features

### UI/UX
- Light, clean background (#fafafa)
- Gradient accents (purple, blue, green)
- Smooth scroll behavior
- Fixed navigation with scroll effects
- Hover animations
- Responsive design for mobile/tablet
- Accessible color contrast
- Modern card-based layouts

### Color Palette
- Primary: #6366f1 (Indigo)
- Secondary: #10b981 (Emerald)
- Accent: #f59e0b (Amber)
- Background: #fafafa (Light gray)
- Text: #1f2937 (Dark gray)

## File Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main app component
│   ├── App.css         # Global styles
│   ├── Navigation.js   # Fixed navigation bar
│   ├── Home.js         # Hero/landing section
│   ├── Research.js     # Research details section
│   ├── Process.js      # Text/PDF processing section
│   ├── Chat.js         # (Legacy - can be removed)
│   ├── Upload.js       # (Legacy - can be removed)
│   └── index.js        # React entry point
└── package.json
```

## Navigation

The website uses smooth scroll navigation with three main sections:
1. **Home** - Landing page with overview
2. **Research** - Detailed project information
3. **Process** - Interactive text/PDF analysis tool

Click navigation links or buttons to smoothly scroll to each section.

## Functionality Preserved

All original functionality has been maintained:
- ✅ Text input processing
- ✅ PDF upload and processing
- ✅ Entity highlighting in text
- ✅ Entity table with scores
- ✅ Error handling
- ✅ Loading states
- ✅ Backend API integration (http://127.0.0.1:5000)

## Running the Application

### Backend
```bash
cd backend
python app.py
```

### Frontend
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Responsive Breakpoints
- Desktop: 1024px+
- Tablet: 768px - 1023px
- Mobile: < 768px

## Future Enhancements
- Dark mode toggle
- Export results to CSV/JSON
- Batch PDF processing
- User authentication
- Result history
- Advanced filtering options
