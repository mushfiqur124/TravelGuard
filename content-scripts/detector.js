/**
 * TravelGuard - Country Detector
 * Detects travel destinations in DOM and triggers vaccination recommendations
 */

class CountryDetector {
  constructor() {
    this.countries = [];
    this.isActive = false;
    this.observer = null;
    
    // Initialize detection when DOM is ready
    this.init();
  }

  async init() {
    console.log('📋 TravelGuard - Country Detector Initialized (AUTO-DETECTION DISABLED)');
    
    // AUTO-DETECTION DISABLED
    // No DOM observation or automatic scanning
    // Users must manually search and select countries
    console.log('⚠️ Auto-detection disabled - Manual entry only');
  }

  startDOMObserver() {
    // AUTO-DETECTION DISABLED
    // No DOM observation to prevent automatic country detection
    console.log('⚠️ DOM Observer disabled - Manual entry only');
    return;
  }

  scanForCountries() {
    console.log('⚠️ AUTO-DETECTION DISABLED - Manual entry only');
    // AUTO-DETECTION COMPLETELY DISABLED
    // Users must manually search and select countries
    // This prevents false positives and unwanted pre-selections
    return;
  }

  isRelevantPage() {
    const url = window.location.href.toLowerCase();
    const title = document.title.toLowerCase();
    
    // Only auto-detect on medical/travel health pages
    const relevantKeywords = [
      'medical', 'health', 'clinic', 'doctor', 'vaccination', 'vaccine', 'immunization',
      'travel health', 'travel medicine', 'medme', 'travel clinic'
    ];
    
    const isRelevant = relevantKeywords.some(keyword => 
      url.includes(keyword) || title.includes(keyword)
    );
    
    console.log(`🔍 Page relevance check: ${isRelevant ? 'RELEVANT' : 'NOT RELEVANT'}`);
    return isRelevant;
  }

  scanFormFields(countries) {
    const detectedCountries = [];
    
    // Look for countries in form field values
    const inputs = document.querySelectorAll('input[type="text"], select, textarea');
    
    inputs.forEach(input => {
      const value = input.value.toLowerCase();
      const placeholder = (input.placeholder || '').toLowerCase();
      
      countries.forEach(country => {
        const countryLower = country.toLowerCase();
        
        // Check if country appears in form field value or placeholder that suggests travel
        if (value.includes(countryLower) || placeholder.includes(countryLower)) {
          const fieldContext = `${input.name || ''} ${input.id || ''} ${placeholder}`.toLowerCase();
          
          // Only detect if field seems travel-related
          if (fieldContext.includes('destination') || fieldContext.includes('country') || 
              fieldContext.includes('travel') || fieldContext.includes('visiting')) {
            if (!detectedCountries.includes(country)) {
              detectedCountries.push(country);
            }
          }
        }
      });
    });
    
    return detectedCountries;
  }

  notifySidebar(countries) {
    // AUTO-DETECTION DISABLED
    // No automatic sidebar notifications
    console.log('⚠️ Sidebar notification disabled - Manual entry only');
    return;
  }

  // Manual country addition (fallback method)
  addCountry(countryName) {
    if (!this.countries.includes(countryName)) {
      this.countries.push(countryName);
      this.notifySidebar(this.countries);
    }
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Initialize detector when script loads
console.log('TravelGuard: Detector script loading...');
console.log('TravelGuard: Detector script execution starting...');

try {
  const countryDetector = new CountryDetector();
  window.countryDetector = countryDetector;
  console.log('TravelGuard: CountryDetector instance created and added to window');
} catch (error) {
  console.error('TravelGuard: Error creating CountryDetector:', error);
}
