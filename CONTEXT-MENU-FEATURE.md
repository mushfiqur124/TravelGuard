# 🎯 TravelGuard Context Menu Feature

## Overview

The TravelGuard extension now supports **right-click context menu activation** for pharmacists working with patient intake forms. This feature allows healthcare providers to quickly search for vaccination information by simply highlighting travel destinations in patient documents.

## 🌟 Key Features

- **Right-click activation**: Select travel destinations and right-click to activate TravelGuard
- **Smart text parsing**: Automatically detects cities and countries from selected text
- **Multiple format support**: Handles various text formats commonly found in intake forms
- **Instant results**: Opens sidebar with vaccination information already loaded
- **User feedback**: Shows status messages for found/not found destinations

## 🚀 How to Use

### Step 1: Select Travel Destinations
Highlight text containing travel destinations in any of these formats:
- `Bangkok, Thailand; Paris, France; Tokyo, Japan`
- `Mumbai, Delhi, Bangkok, Singapore`
- `Brazil, Argentina, Peru, Colombia`
- `Rome, Italy and Barcelona, Spain`
- Mixed cities and countries

### Step 2: Right-Click
Right-click on the highlighted text to open the context menu.

### Step 3: Choose TravelGuard
Click **"Search travel destinations with TravelGuard"** from the context menu.

### Step 4: View Results
The TravelGuard sidebar opens automatically with vaccination information for the detected destinations.

## 📝 Supported Text Formats

The feature intelligently parses various text formats commonly found in patient intake forms:

### Format Examples
```
✅ "Bangkok, Thailand; Paris, France; Tokyo, Japan"
✅ "Mumbai, Delhi, Bangkok, Singapore"  
✅ "Brazil, Argentina, Peru and Colombia"
✅ "traveling to Rome, Italy and Barcelona"
✅ "vacation in Cancun, Mexico or Nassau, Bahamas"
✅ "visiting Bangkok (2 weeks); Mumbai (1 week)"
```

### Separators Recognized
- Commas (`,`)
- Semicolons (`;`)
- "and" / "or" keywords
- Line breaks
- Parentheses for durations

## 🏙️ City Recognition

The extension includes a comprehensive city-to-country mapping covering:

### Medical Tourism Destinations
- Bangkok, Phuket → Thailand
- Mumbai, Delhi, Bangalore → India
- Seoul, Busan → South Korea
- Istanbul, Ankara → Turkey
- Singapore → Singapore
- Dubai, Abu Dhabi → UAE

### Popular Vacation Destinations
- Paris, Nice, Lyon → France
- Rome, Florence, Venice → Italy
- Barcelona, Madrid, Seville → Spain
- London, Edinburgh → United Kingdom
- Tokyo, Kyoto, Osaka → Japan

### Caribbean & Americas
- Nassau → Bahamas
- Kingston, Montego Bay → Jamaica
- Cancun, Mexico City → Mexico
- São Paulo, Rio de Janeiro → Brazil

## ⚠️ Error Handling

### Unknown Destinations
If destinations cannot be found, the extension:
- Shows a warning message listing unrecognized locations
- Still displays results for any recognized destinations
- Provides clear feedback about what was/wasn't found

### Example Error Message
```
Found vaccination info for: Thailand, France

Could not find: Atlantis, Middle Earth
```

## 🔧 Technical Implementation

### Files Modified
- `manifest.json` - Added `contextMenus` permission
- `background/data-updater.js` - Added context menu creation and handling
- `content-scripts/sidebar.js` - Added `searchMultipleDestinations()` method

### Key Functions
- `parseDestinations()` - Extracts cities/countries from selected text
- `searchMultipleDestinations()` - Processes multiple destinations in sidebar
- `showStatusMessage()` - Displays user feedback

## 🧪 Testing

Use the included `test-context-menu.html` file to test various scenarios:

1. Open `test-context-menu.html` in Chrome
2. Ensure TravelGuard extension is enabled
3. Highlight different test cases
4. Right-click and select TravelGuard option
5. Verify sidebar opens with correct destinations

### Test Cases Included
- Mixed cities and countries
- Cities only
- Countries only
- Medical tourism destinations
- Vacation destinations
- Complex realistic formats
- Invalid destinations (error handling)

## 🩺 Pharmacist Workflow

### Before
1. Read patient intake form
2. Manually open TravelGuard extension
3. Manually type each destination
4. Search one by one

### After
1. Read patient intake form
2. Highlight travel destinations
3. Right-click → "Search travel destinations with TravelGuard"
4. ✅ Done! All destinations loaded automatically

## 💡 Pro Tips

### For Best Results
- Select complete phrases including city and country when available
- Include punctuation in selection (commas, semicolons)
- Don't worry about perfect formatting - the parser is flexible

### Keyboard Shortcuts
- `Ctrl+A` / `Cmd+A` - Select all text
- `Shift+Click` - Extend selection
- `Double-click` - Select word
- `Triple-click` - Select paragraph

## 🔍 Troubleshooting

### Context Menu Doesn't Appear
- Ensure text is properly selected/highlighted
- Check that TravelGuard extension is enabled
- Refresh the page and try again
- Verify you're right-clicking on the selected text

### No Destinations Found
- Check spelling of city/country names
- Try selecting more context around the destination names
- Use country names instead of obscure city names
- Check the console (F12) for parsing details

### Sidebar Doesn't Open
- Ensure extension has permission to run on the website
- Check browser console for JavaScript errors
- Try clicking the extension icon first to initialize scripts

## 🚀 Future Enhancements

### Planned Improvements
- Fuzzy matching for misspelled destinations
- Support for airline codes (LAX, JFK, etc.)
- Integration with travel booking sites
- Automatic date detection for travel timing
- Multi-language destination support

### Feedback Welcome
This feature is designed based on real pharmacist workflows. Please provide feedback on:
- Text formats we should support
- Additional cities/countries to include
- UI improvements
- Performance optimizations

---

**🩺 TravelGuard - Professional travel health extension for healthcare providers**
