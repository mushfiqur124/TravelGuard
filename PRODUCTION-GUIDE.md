# 🚀 Production Deployment Guide

## MedMe Travel Vaccination Data Scraper

### 📋 Overview

This production-ready scraper safely extracts vaccination and health risk data from TravelHealthPro.org.uk for all ~290 countries, optimized for Chrome Extension storage.

### 🛡️ Safety Features

- **Respectful Rate Limiting**: 2-3 second delays between requests
- **Server Header Respect**: Automatically handles rate limiting responses
- **Daily Request Limits**: Max 1,000 requests per day
- **Graceful Error Handling**: Continues on failures, logs issues
- **Resume Capability**: Can restart from interruption point

### 💾 Chrome Storage Optimization

- **Regional Data Splitting**: Data split by continents (Africa, Asia, Europe, Americas, Oceania)
- **Data Compression**: Short field names and truncated descriptions
- **Size Monitoring**: Automatic warnings if approaching 5MB Chrome limit
- **Current Usage**: ~0.1% of Chrome storage limit for full dataset

### 🎯 Production Commands

#### Full Production Scrape (All Countries)
```bash
npm run scrape
```
**Time Estimate**: 15-20 minutes for ~290 countries
**Output**: Complete dataset in `data/` folder

#### Test Before Production
```bash
npm run production-ready
```
**Time Estimate**: 2-3 minutes for 10 test countries
**Purpose**: Validate everything works before full run

### 📊 Expected Output Files

#### Traditional Format (Human Readable)
- `countries-db.json` - Complete vaccination data
- `country-mappings.json` - Country name variations
- `last-update.json` - Metadata and statistics

#### Chrome Extension Format (Optimized)
- `chrome-data-africa.json` - African countries (~800KB)
- `chrome-data-asia.json` - Asian countries (~900KB)
- `chrome-data-europe.json` - European countries (~600KB)
- `chrome-data-americas.json` - American countries (~700KB)
- `chrome-data-oceania.json` - Oceania countries (~200KB)
- `chrome-index.json` - Master index file

### 🔄 Weekly Update Schedule

For automated updates, run this script weekly:

```bash
#!/bin/bash
# weekly-update.sh

cd /path/to/travelguard
npm run scrape

# Optional: Copy to Chrome extension data folder
cp data/chrome-*.json /path/to/extension/data/
```

### 📈 Monitoring & Maintenance

#### Success Metrics
- **Success Rate**: Should be >95% of countries
- **Chrome Storage**: Should stay <80% of 5MB limit
- **Update Time**: Should complete within 30 minutes

#### Troubleshooting
- **High Failure Rate**: Check TravelHealthPro website structure changes
- **Storage Overflow**: Increase compression or split regions further
- **Slow Performance**: Check network and server response times

### 🚨 Rate Limiting Best Practices

**DO:**
- Run during off-peak hours (nighttime UK time)
- Use provided delays and random intervals
- Monitor error logs for 429 responses
- Respect server headers

**DON'T:**
- Run multiple instances simultaneously
- Modify delay settings to be faster
- Ignore rate limiting errors
- Run more than once per day

### 🔧 Configuration Options

Edit `CONFIG` in `scripts/scraper.js`:

```javascript
const CONFIG = {
  DELAY_MS: 2000,           // Base delay between requests
  RANDOM_DELAY_MAX: 1000,   // Additional random delay
  MAX_DAILY_REQUESTS: 1000, // Safety limit
  BATCH_SIZE: 50,           // Progress save frequency
  COMPRESS_DATA: true,      // Enable data compression
  REGIONAL_SPLIT: true      // Split by regions
};
```

### 📱 Chrome Extension Integration

1. **Load Regional Data**:
```javascript
// Load specific region when needed
chrome.storage.local.get(['chrome-data-europe'], (result) => {
  const europeData = result['chrome-data-europe'];
  // Use compressed data format
});
```

2. **Decompress Data**:
```javascript
function decompressCountryData(compressed) {
  return {
    mostTravellers: compressed.m.map(v => ({
      name: v.n,
      description: v.d,
      prevention: v.p,
      riskFactors: v.r
    })),
    someTravellers: compressed.s.map(v => ({
      name: v.n,
      description: v.d,
      prevention: v.p,
      riskFactors: v.r
    })),
    otherRisks: compressed.r.map(r => ({
      name: r.n,
      type: r.t,
      description: r.d,
      prevention: r.p
    })),
    lastUpdated: compressed.u,
    sourceUrl: compressed.l
  };
}
```

### 🎉 Success Indicators

After successful run, you should see:
- ✅ 250+ countries processed
- ✅ <10 errors logged
- ✅ Chrome storage <1MB total
- ✅ Regional files created
- ✅ No rate limiting warnings

### 📞 Support

For issues:
1. Check error logs in `data/error-log.json`
2. Verify TravelHealthPro.org.uk is accessible
3. Review rate limiting logs
4. Test with smaller subset first

---

## 🌍 Ready to Power Your Chrome Extension!

This scraper provides comprehensive, up-to-date vaccination data for all countries, optimized for Chrome Extension storage and ready for production use.
