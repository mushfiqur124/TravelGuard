/**
 * TravelGuard - Background Service Worker
 * Handles data updates and storage management
 */

// Extension lifecycle
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('🩺 TravelGuard installed');
  
  if (details.reason === 'install') {
    // First time installation
    await initializeExtension();
  } else if (details.reason === 'update') {
    // Extension updated
    await checkDataUpdate();
  }
});

chrome.runtime.onStartup.addListener(() => {
  console.log('TravelGuard: Background service worker started');
  checkDataUpdate();
});

/**
 * Initialize extension on first install
 */
async function initializeExtension() {
  console.log('🚀 Initializing TravelGuard extension...');
  
  try {
    await loadInitialData();
    console.log('✅ Extension initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize extension:', error);
  }
}

// Force initialization when background script loads
console.log('🩺 TravelGuard background script loading...');
setTimeout(async () => {
  console.log('🔄 Forcing data initialization...');
  try {
    await checkDataUpdate();
    console.log('✅ Background script initialization complete');
  } catch (error) {
    console.error('❌ Background script initialization failed:', error);
  }
}, 1000);

// Handle extension icon click - INJECT SCRIPTS MANUALLY!
chrome.action.onClicked.addListener(async (tab) => {
  console.log('TravelGuard: Extension icon clicked on tab:', tab.url);
  
  try {
    // Step 1: Check if scripts are already loaded
    console.log('🔍 Checking if scripts are loaded...');
    
    const checkResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        console.log('🔍 Checking for existing sidebar...');
        console.log('window.vaccinationSidebar:', window.vaccinationSidebar);
        
        if (window.vaccinationSidebar) {
          return {
            exists: true,
            isVisible: window.vaccinationSidebar.isVisible,
            isMinimized: window.vaccinationSidebar.isMinimized
          };
        }
        return { exists: false };
      }
    });
    
    const sidebarState = checkResult[0].result;
    
    if (!sidebarState.exists) {
      console.log('🔧 Scripts not loaded, injecting them manually...');
      
      // Step 2: Inject CSS first
      console.log('💉 Injecting CSS...');
      await chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['content-scripts/content.css']
      });
      
      // Step 3: Inject JS scripts in correct order
      console.log('💉 Injecting data-loader.js...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-scripts/data-loader.js']
      });
      
      console.log('💉 Injecting detector.js...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-scripts/detector.js']
      });
      
      console.log('💉 Injecting sidebar.js...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-scripts/sidebar.js']
      });
      
      console.log('💉 Injecting integration-tests.js...');
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content-scripts/integration-tests.js']
      });
      
      // Wait a bit for scripts to initialize
      console.log('⏳ Waiting for scripts to initialize...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      console.log('✅ Scripts already loaded');
      console.log('📊 Sidebar state:', sidebarState);
    }
    
    // Step 4: Handle sidebar based on its current state
    console.log('🚀 Handling sidebar...');
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        console.log('🔍 Final check for sidebar...');
        console.log('window.vaccinationSidebar:', window.vaccinationSidebar);
        
        if (window.vaccinationSidebar) {
          console.log('✅ Found sidebar, opening/expanding...');
          window.vaccinationSidebar.openSidebar();
        } else if (window.showTravelGuardSidebar) {
          console.log('✅ Found test function, calling...');
          window.showTravelGuardSidebar();
        } else {
          console.log('❌ Still no sidebar found, creating manually...');
          
          // Last resort: create sidebar inline
          const sidebar = document.createElement('div');
          sidebar.id = 'emergency-sidebar';
          sidebar.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 300px !important;
            height: 100vh !important;
            background: white !important;
            border-left: 3px solid #063E54 !important;
            box-shadow: -5px 0 20px rgba(0,0,0,0.3) !important;
            z-index: 2147483647 !important;
            padding: 20px !important;
            font-family: Arial, sans-serif !important;
          `;
          
          sidebar.innerHTML = `
            <div style="background: #063E54; color: white; padding: 15px; margin: -20px -20px 20px -20px;">
              <h2 style="margin: 0;">✚ TravelGuard</h2>
              <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 15px; right: 15px; background: none; border: none; color: white; font-size: 18px; cursor: pointer;">✕</button>
            </div>
            <div>
              <h3 style="color: #063E54; margin-top: 0;">🎉 Emergency Sidebar!</h3>
              <p>This sidebar was created as a last resort. The main scripts didn't load properly.</p>
              <button onclick="alert('Emergency button works!')" style="background: #063E54; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer;">Test Button</button>
            </div>
          `;
          
          document.body.appendChild(sidebar);
          console.log('🆘 Emergency sidebar created!');
        }
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('🆘 Trying emergency fallback...');
    
    // Emergency fallback
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          alert('TravelGuard Extension: Unable to load properly. Please refresh the page and try again.');
        }
      });
    } catch (e) {
      console.error('❌ Even emergency fallback failed:', e);
    }
  }
});

/**
 * Initialize extension with default data
 */
async function initializeExtension() {
  try {
    console.log('🔧 Initializing TravelGuard extension...');
    
    // Set default data structure
    const defaultData = {
      lastUpdate: null,
      version: '1.0.0',
      countries: {},
      countryMappings: {}
    };
    
    await chrome.storage.local.set({
      medmeData: defaultData,
      medmeSettings: {
        autoDetection: true,
        showHighPriorityFirst: true,
        dataUpdateFrequency: 'monthly'
      }
    });
    
    console.log('✅ TravelGuard extension initialized successfully');
    
    // Load initial vaccine data
    await loadInitialData();
    
  } catch (error) {
    console.error('❌ Error initializing extension:', error);
  }
}

/**
 * Load initial vaccine data from bundled files
 */
async function loadInitialData() {
  try {
    console.log('📊 Loading initial vaccine data from scraped files...');
    
    // Try to load from scraped regional files first
    try {
      const allCountriesData = await loadAllScrapedData();
      
      if (Object.keys(allCountriesData).length > 0) {
        console.log(`✅ Loaded ${Object.keys(allCountriesData).length} countries from scraped data`);
        
        const result = await chrome.storage.local.get(['medmeData']);
        const currentData = result.medmeData || {};
        
        currentData.countries = allCountriesData;
        currentData.lastUpdate = new Date().toISOString();
        currentData.dataSource = 'scraped-regional-files';
        currentData.totalCountries = Object.keys(allCountriesData).length;
        
        await chrome.storage.local.set({ medmeData: currentData });
        
        console.log('✅ Successfully loaded scraped vaccination data');
        return;
      }
    } catch (scrapedError) {
      console.error('❌ Failed to load scraped data:', scrapedError);
      console.error('❌ Error details:', {
        message: scrapedError.message,
        stack: scrapedError.stack,
        name: scrapedError.name
      });
      console.warn('⚠️ Falling back to test data...');
    }
    
    // Fallback to test data if scraped data fails
    console.log('📊 Loading fallback test data...');
    const testData = {
      "Argentina": {
        "mostTravellers": [
          {
            "name": "Hepatitis A",
            "description": "Recommended for all previously unvaccinated travellers",
            "prevention": "Take care with personal, food and water hygiene"
          },
          {
            "name": "Tetanus",
            "description": "Booster recommended if >10 years since last dose",
            "prevention": "Clean wounds thoroughly, seek medical attention for injuries"
          }
        ],
        "someTravellers": [
          {
            "name": "Rabies",
            "description": "For increased risk activities or long-stay travel",
            "riskFactors": ["Long-stay (>1 month)", "Cycling/running", "Limited medical access"]
          }
        ],
        "otherRisks": [],
        "lastUpdated": new Date().toISOString(),
        "sourceUrl": "https://travelhealthpro.org.uk/country/11/argentina"
      },
      "Japan": {
        "mostTravellers": [
          {
            "name": "Hepatitis A",
            "description": "Recommended for all previously unvaccinated travellers",
            "prevention": "Take care with personal, food and water hygiene"
          },
          {
            "name": "Tetanus",
            "description": "Booster recommended if >10 years since last dose",
            "prevention": "Clean wounds thoroughly, seek medical attention for injuries"
          }
        ],
        "someTravellers": [
          {
            "name": "Japanese Encephalitis",
            "description": "For rural areas or long-stay travel",
            "riskFactors": ["Rural areas", "Long-stay (>1 month)", "Outdoor activities"]
          }
        ],
        "otherRisks": [],
        "lastUpdated": new Date().toISOString(),
        "sourceUrl": "https://travelhealthpro.org.uk/country/110/japan"
      },
      "Morocco": {
        "mostTravellers": [
          {
            "name": "Hepatitis A",
            "description": "Recommended for all previously unvaccinated travellers",
            "prevention": "Take care with personal, food and water hygiene"
          },
          {
            "name": "Typhoid",
            "description": "Recommended for all travellers",
            "prevention": "Take care with personal, food and water hygiene"
          }
        ],
        "someTravellers": [
          {
            "name": "Hepatitis B",
            "description": "For increased risk travellers",
            "riskFactors": ["Healthcare work", "Sexual activity", "Tattoos/piercings"]
          }
        ],
        "otherRisks": [],
        "lastUpdated": new Date().toISOString(),
        "sourceUrl": "https://travelhealthpro.org.uk/country/145/morocco"
      },
      "Brazil": {
        "mostTravellers": [
          {
            "name": "Hepatitis A",
            "description": "Recommended for all previously unvaccinated travellers",
            "prevention": "Take care with personal, food and water hygiene"
          },
          {
            "name": "Yellow Fever",
            "description": "Required for certain areas",
            "prevention": "Vaccination required for travel to risk areas"
          }
        ],
        "someTravellers": [
          {
            "name": "Rabies",
            "description": "For increased risk activities",
            "riskFactors": ["Animal contact", "Rural areas", "Adventure travel"]
          }
        ],
        "otherRisks": [],
        "lastUpdated": new Date().toISOString(),
        "sourceUrl": "https://travelhealthpro.org.uk/country/31/brazil"
      }
    };
    
    const result = await chrome.storage.local.get(['medmeData']);
    const currentData = result.medmeData || {};
    
    currentData.countries = testData;
    currentData.lastUpdate = new Date().toISOString();
    currentData.dataSource = 'fallback-test-data';
    currentData.totalCountries = Object.keys(testData).length;
    
    await chrome.storage.local.set({ medmeData: currentData });
    
    console.log('✅ Fallback test data loaded');
    
  } catch (error) {
    console.error('❌ Error loading initial data:', error);
  }
}

/**
 * Load all scraped data from regional files
 */
async function loadAllScrapedData() {
  try {
    console.log('📋 Loading scraped data from regional files...');
    
    // Load index to get regions
    const indexUrl = chrome.runtime.getURL('data/chrome-index.json');
    const indexResponse = await fetch(indexUrl);
    
    if (!indexResponse.ok) {
      throw new Error(`Failed to load index: ${indexResponse.status}`);
    }
    
    const indexData = await indexResponse.json();
    console.log(`📊 Found ${indexData.totalCountries} countries in ${indexData.regions.length} regions`);
    
    const allCountriesData = {};
    
    // Load each regional file
    for (const region of indexData.regions) {
      try {
        const regionFile = `chrome-data-${region.toLowerCase()}.json`;
        const regionUrl = chrome.runtime.getURL(`data/${regionFile}`);
        
        console.log(`📁 Loading ${regionFile}...`);
        const regionResponse = await fetch(regionUrl);
        
        if (!regionResponse.ok) {
          console.warn(`⚠️ Failed to load ${regionFile}: ${regionResponse.status}`);
          continue;
        }
        
        const regionData = await regionResponse.json();
        
        if (regionData.countries) {
          // Decompress and add all countries from this region
          Object.keys(regionData.countries).forEach(countryName => {
            const compressedData = regionData.countries[countryName];
            allCountriesData[countryName] = decompressCountryData(compressedData);
          });
          
          console.log(`✅ Loaded ${Object.keys(regionData.countries).length} countries from ${region}`);
        }
        
      } catch (regionError) {
        console.warn(`⚠️ Error loading region ${region}:`, regionError);
      }
    }
    
    console.log(`📊 Total countries loaded: ${Object.keys(allCountriesData).length}`);
    return allCountriesData;
    
  } catch (error) {
    console.error('❌ Error loading scraped data:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw error;
  }
}

/**
 * Decompress country data from storage format to display format
 */
function decompressCountryData(compressed) {
  try {
    return {
      mostTravellers: (compressed.m || []).map(vaccine => ({
        name: vaccine.n || '',
        description: vaccine.d || '',
        prevention: vaccine.p || '',
        riskFactors: vaccine.r || null
      })),
      someTravellers: (compressed.s || []).map(vaccine => ({
        name: vaccine.n || '',
        description: vaccine.d || '',
        prevention: vaccine.p || '',
        riskFactors: vaccine.r || null
      })),
      otherRisks: (compressed.r || []).map(risk => ({
        name: risk.n || '',
        type: risk.t || '',
        description: risk.d || '',
        prevention: risk.p || ''
      })),
      lastUpdated: compressed.u || null,
      sourceUrl: compressed.l || null
    };
  } catch (error) {
    console.error('❌ Error decompressing country data:', error);
    return {
      mostTravellers: [],
      someTravellers: [],
      otherRisks: [],
      lastUpdated: null,
      sourceUrl: null
    };
  }
}

/**
 * Check if data needs updating
 */
async function checkDataUpdate() {
  try {
    const result = await chrome.storage.local.get(['medmeData']);
    const data = result.medmeData;
    
    if (!data || !data.lastUpdate) {
      console.log('🔄 No data found, initializing...');
      await loadInitialData();
      return;
    }
    
    const lastUpdate = new Date(data.lastUpdate);
    const now = new Date();
    const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
    
    // Update if older than 30 days
    if (daysSinceUpdate > 30) {
      console.log('🔄 Data is outdated, scheduling update...');
      // TODO: Implement actual data update from TravelHealthPro
      await scheduleDataUpdate();
    } else {
      console.log('✅ Data is current');
    }
    
  } catch (error) {
    console.error('❌ Error checking data update:', error);
  }
}

/**
 * Schedule data update (placeholder)
 */
async function scheduleDataUpdate() {
  console.log('📅 Data update scheduled (not implemented yet)');
  // TODO: Implement actual scraping and update logic
}

/**
 * Handle messages from content scripts
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVaccineData') {
    getVaccineData(request.countries)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Keep message channel open
  }
  
  if (request.action === 'updateSettings') {
    updateSettings(request.settings)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

/**
 * Get vaccine data for specified countries
 */
async function getVaccineData(countries) {
  try {
    const result = await chrome.storage.local.get(['medmeData']);
    const data = result.medmeData;
    
    if (!data || !data.countries) {
      throw new Error('No vaccine data available');
    }
    
    // If no countries specified, return all available countries
    if (!countries || countries.length === 0) {
      console.log('📋 Returning all available countries from storage');
      return data.countries;
    }
    
    const vaccineData = {};
    
    countries.forEach(country => {
      if (data.countries[country]) {
        vaccineData[country] = data.countries[country];
      }
    });
    
    return vaccineData;
    
  } catch (error) {
    console.error('❌ Error getting vaccine data:', error);
    throw error;
  }
}

/**
 * Update extension settings
 */
async function updateSettings(newSettings) {
  try {
    const result = await chrome.storage.local.get(['medmeSettings']);
    const currentSettings = result.medmeSettings || {};
    
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    await chrome.storage.local.set({ medmeSettings: updatedSettings });
    
    console.log('✅ Settings updated:', updatedSettings);
    
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    throw error;
  }
}
