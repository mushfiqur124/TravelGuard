# TravelGuard Chrome Extension

🩺 **Professional Chrome extension that automatically detects travel destinations and provides instant vaccination recommendations for healthcare providers.**

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Load Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this project folder
4. The TravelGuard extension should appear in your extensions list

### 3. Test the Extension
1. Navigate to any healthcare portal page
2. The extension will automatically detect travel destinations
3. Click the extension icon to access manual controls

## Development

### 🚀 Production Data Collection
```bash
# TEST FIRST: Validate scraper with 10 countries (2-3 min)
npm run production-ready

# PRODUCTION: Scrape all ~290 countries (15-20 min)
npm run scrape

# Alternative: Full pipeline
npm run prepare-data
```

**✅ Production Ready**: Safe, respectful scraping with Chrome storage optimization
**📊 Output**: Regional files optimized for Chrome Extension storage (5MB limit)
**🔄 Schedule**: Run weekly for fresh data

See `PRODUCTION-GUIDE.md` for complete deployment instructions.

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint
```

### Building
```bash
# Build for production
npm run build
```

## Project Structure

```
├── manifest.json              # Chrome Extension v3 manifest
├── content-scripts/           # Scripts injected into web pages
│   ├── detector.js           # Detects travel destinations
│   ├── sidebar.js            # Manages vaccination sidebar
│   └── content.css           # Sidebar styling
├── background/               # Background service worker
│   └── data-updater.js       # Handles data updates
├── popup/                    # Extension popup interface
│   ├── popup.html
│   ├── popup.js
│   └── popup.css
├── data/                     # Vaccine database
│   ├── countries-db.json     # Main vaccine data
│   ├── country-mappings.json # Country name variations
│   └── last-update.json      # Data freshness tracking
├── scripts/                  # Build and data scripts
│   └── scraper.js            # TravelHealthPro scraper
└── tests/                    # Test suite
    ├── unit/
    ├── integration/
    └── e2e/
```

## Features

### ✅ Completed
- [x] Chrome Extension v3 manifest and structure
- [x] Basic content script framework
- [x] Cursor-style sidebar UI
- [x] Professional design system implementation
- [x] Background service worker
- [x] Popup interface
- [x] **🚀 Production-ready data scraper** for TravelHealthPro
- [x] **📊 Chrome storage optimization** (regional splitting, compression)
- [x] **🛡️ Safe scraping practices** (rate limiting, error handling)
- [x] **🔄 Resume capability** and progress tracking
- [x] Test framework setup

### 🚧 In Development
- [ ] Country detection algorithm
- [ ] Risk-based prioritization system
- [ ] Full DOM scanning implementation
- [ ] Data integration and storage
- [ ] Comprehensive testing

### 📋 Planned
- [ ] Performance optimization
- [ ] Accessibility features
- [ ] Chrome Web Store deployment

## Data Source

Vaccine recommendations are sourced from [TravelHealthPro](https://travelhealthpro.org.uk/), the UK's official source of travel health information.

## Design System

- **Primary Color**: `#063E54` (Healthcare blue)
- **Background**: `#FFFFFF`
- **Text**: `#000000`
- **Secondary**: `#F5F5F5`
- **Font**: Montserrat

## Security

- ✅ No external API dependencies
- ✅ Local data storage only
- ✅ Content Security Policy implemented
- ✅ Domain restrictions for MedMe portals only
- ✅ Data validation and sanitization

## Browser Support

- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## License

UNLICENSED - Private healthcare project

---

**Built with ❤️ for healthcare professionals**
