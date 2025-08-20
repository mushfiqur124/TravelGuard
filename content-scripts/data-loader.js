/**
 * TravelGuard - Data Loader Utility
 * Loads and decompresses vaccination data from Chrome-optimized regional files
 */

class VaccineDataLoader {
  constructor() {
    this.cachedData = {};
    this.cachedCountryList = null;
    this.cachedMappings = null;
    this.loadPromises = {}; // Prevent duplicate loads
  }

  /**
   * Get the complete list of all available countries
   */
  async getAllCountries() {
    if (this.cachedCountryList) {
      return this.cachedCountryList;
    }

    try {
      // Strategy 1: Try loading from regional files (scraped data)
      console.log('📊 Attempting to load countries from regional files...');
      const indexData = await this.loadDataFile('chrome-index.json');
      
      if (indexData && indexData.regions) {
        const allCountries = new Set();
        
        for (const region of indexData.regions) {
          const regionFile = `chrome-data-${region.toLowerCase()}.json`;
          try {
            const regionData = await this.loadDataFile(regionFile);
            
            if (regionData && regionData.countries) {
              Object.keys(regionData.countries).forEach(country => {
                allCountries.add(country);
              });
            }
          } catch (regionError) {
            console.warn(`⚠️ Could not load region ${region}:`, regionError);
          }
        }

        if (allCountries.size > 0) {
          this.cachedCountryList = Array.from(allCountries).sort();
          console.log(`📋 Loaded ${this.cachedCountryList.length} countries from regional data`);
          return this.cachedCountryList;
        }
      }
    } catch (error) {
      console.warn('⚠️ Regional files not available:', error);
    }

    try {
      // Strategy 2: Try Chrome storage (background script data)
      console.log('📊 Attempting to load countries from Chrome storage...');
      
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        const response = await chrome.runtime.sendMessage({
          action: 'getVaccineData',
          countries: [] // Request all available
        });
        
        if (response && response.success && response.data) {
          const storageCountries = Object.keys(response.data);
          if (storageCountries.length > 0) {
            this.cachedCountryList = storageCountries.sort();
            console.log(`📋 Loaded ${this.cachedCountryList.length} countries from Chrome storage`);
            return this.cachedCountryList;
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Chrome storage not available:', error);
    }

    // Strategy 3: Fallback to comprehensive country list
    console.log('📊 Using fallback country list...');
    this.cachedCountryList = [
      'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
      'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Bolivia', 'Bosnia and Herzegovina', 'Brazil', 'Bulgaria',
      'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
      'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia',
      'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Guatemala',
      'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
      'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
      'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
      'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway',
      'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
      'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
      'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
      'Venezuela', 'Vietnam'
    ].sort();
    
    console.log(`📋 Using fallback list with ${this.cachedCountryList.length} countries`);
    return this.cachedCountryList;
  }

  /**
   * Get country name mappings for fuzzy matching
   */
  async getCountryMappings() {
    if (this.cachedMappings) {
      return this.cachedMappings;
    }

    try {
      this.cachedMappings = await this.loadDataFile('country-mappings.json');
      console.log(`🗺️ Loaded ${Object.keys(this.cachedMappings).length} country mappings`);
      return this.cachedMappings;
    } catch (error) {
      console.error('❌ Error loading country mappings:', error);
      return {};
    }
  }

  /**
   * Get vaccination data for specific countries
   */
  async getVaccineData(countries) {
    if (!Array.isArray(countries)) {
      countries = [countries];
    }

    const result = {};

    try {
      // Group countries by region to minimize file loads
      const countryRegionMap = await this.getCountryRegionMapping();
      const regionCountries = {};

      // Group countries by their regions
      for (const country of countries) {
        const region = countryRegionMap[country];
        if (region) {
          if (!regionCountries[region]) {
            regionCountries[region] = [];
          }
          regionCountries[region].push(country);
        }
      }

      // Load data from each required region
      for (const [region, regionCountryList] of Object.entries(regionCountries)) {
        const regionData = await this.loadRegionData(region);
        
        for (const country of regionCountryList) {
          if (regionData && regionData[country]) {
            result[country] = this.decompressCountryData(regionData[country]);
          }
        }
      }

      console.log(`📊 Loaded vaccination data for ${Object.keys(result).length}/${countries.length} countries`);
      return result;

    } catch (error) {
      console.error('❌ Error loading vaccine data:', error);
      return {};
    }
  }

  /**
   * Search for countries matching a query
   */
  async searchCountries(query, limit = 10) {
    if (!query.trim()) {
      const allCountries = await this.getAllCountries();
      return allCountries.slice(0, limit);
    }

    try {
      const allCountries = await this.getAllCountries();
      const mappings = await this.getCountryMappings();
      const queryLower = query.toLowerCase();

      // Score matches for better ranking
      const matches = [];

      allCountries.forEach(country => {
        const countryLower = country.toLowerCase();
        
        // Exact match gets highest score
        if (countryLower === queryLower) {
          matches.push({ country, score: 100 });
          return;
        }

        // Starts with query gets high score
        if (countryLower.startsWith(queryLower)) {
          matches.push({ country, score: 90 });
          return;
        }

        // Contains query gets medium score
        if (countryLower.includes(queryLower)) {
          matches.push({ country, score: 70 });
          return;
        }

        // Check mappings for alternative names
        const alternativeNames = Object.keys(mappings).filter(key => 
          mappings[key] === country && key.includes(queryLower)
        );
        
        if (alternativeNames.length > 0) {
          matches.push({ country, score: 60 });
        }
      });

      // Sort by score and return top matches
      return matches
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(match => match.country);

    } catch (error) {
      console.error('❌ Error searching countries:', error);
      return [];
    }
  }

  /**
   * Get mapping of country names to their regions
   */
  async getCountryRegionMapping() {
    // Return cached if available
    if (this.countryRegionMap) {
      return this.countryRegionMap;
    }

    try {
      const indexData = await this.loadDataFile('chrome-index.json');
      const countryRegionMap = {};

      for (const region of indexData.regions) {
        const regionFile = `chrome-data-${region.toLowerCase()}.json`;
        const regionData = await this.loadDataFile(regionFile);
        
        if (regionData && regionData.countries) {
          Object.keys(regionData.countries).forEach(country => {
            countryRegionMap[country] = region.toLowerCase();
          });
        }
      }

      this.countryRegionMap = countryRegionMap;
      return countryRegionMap;

    } catch (error) {
      console.error('❌ Error building country-region mapping:', error);
      return {};
    }
  }

  /**
   * Load data from a specific region
   */
  async loadRegionData(region) {
    const regionKey = region.toLowerCase();
    
    if (this.cachedData[regionKey]) {
      return this.cachedData[regionKey];
    }

    try {
      const regionFile = `chrome-data-${regionKey}.json`;
      const regionFileData = await this.loadDataFile(regionFile);
      
      if (regionFileData && regionFileData.countries) {
        this.cachedData[regionKey] = regionFileData.countries;
        console.log(`📁 Loaded ${Object.keys(regionFileData.countries).length} countries from ${regionKey} region`);
        return this.cachedData[regionKey];
      }

      return {};

    } catch (error) {
      console.error(`❌ Error loading region data for ${region}:`, error);
      return {};
    }
  }

  /**
   * Load a data file from the extension data directory
   */
  async loadDataFile(fileName) {
    // Prevent duplicate loads
    if (this.loadPromises[fileName]) {
      return this.loadPromises[fileName];
    }

    this.loadPromises[fileName] = this.fetchDataFile(fileName);
    return this.loadPromises[fileName];
  }

  /**
   * Fetch data file - handles both extension context and web context
   */
  async fetchDataFile(fileName) {
    try {
      // Try Chrome extension API first
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
        const url = chrome.runtime.getURL(`data/${fileName}`);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      }

      // Fallback to relative path (for testing)
      const response = await fetch(`../data/${fileName}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();

    } catch (error) {
      console.error(`❌ Error fetching ${fileName}:`, error);
      throw error;
    }
  }

  /**
   * Decompress country data from storage format to display format
   */
  decompressCountryData(compressed) {
    try {
      const decompressVaccine = (vaccine) => ({
        name: vaccine.n || '',
        description: vaccine.description || vaccine.d || '',  // Use full description if available
        prevention: vaccine.prevention || vaccine.p || '',    // Use full prevention if available
        riskFactors: vaccine.r || null,
        // Enhanced fields from new scraper
        countrySpecific: vaccine.countrySpecific || null,
        vaccination: vaccine.vaccination || null,
        additionalSections: vaccine.additionalSections || null
      });

      return {
        mostTravellers: (compressed.m || []).map(decompressVaccine),
        someTravellers: (compressed.s || []).map(decompressVaccine),
        otherRisks: (compressed.r || []).map(risk => ({
          name: risk.n || '',
          type: risk.t || '',
          description: risk.d || '',
          prevention: risk.p || ''
        })),
        malaria: compressed.malaria || null,              // Include malaria data
        lastUpdated: compressed.u || null,
        sourceUrl: compressed.l || null
      };
    } catch (error) {
      console.error('❌ Error decompressing country data:', error);
      return {
        mostTravellers: [],
        someTravellers: [],
        otherRisks: [],
        malaria: null,
        lastUpdated: null,
        sourceUrl: null
      };
    }
  }

  /**
   * Clear all cached data (useful for testing or manual refresh)
   */
  clearCache() {
    this.cachedData = {};
    this.cachedCountryList = null;
    this.cachedMappings = null;
    this.countryRegionMap = null;
    this.loadPromises = {};
    console.log('🗑️ Data loader cache cleared');
  }

  /**
   * Get cache statistics for debugging
   */
  getCacheStats() {
    return {
      regionsLoaded: Object.keys(this.cachedData).length,
      countriesLoaded: this.cachedCountryList?.length || 0,
      mappingsLoaded: this.cachedMappings ? Object.keys(this.cachedMappings).length : 0,
      activePromises: Object.keys(this.loadPromises).length
    };
  }
}

// Create global instance
if (typeof window !== 'undefined') {
  window.vaccineDataLoader = new VaccineDataLoader();
  console.log('📊 VaccineDataLoader initialized and available at window.vaccineDataLoader');

  // Debug functions for development
  window.testDataLoader = async () => {
    console.log('🧪 Testing data loader...');
    
    const countries = await window.vaccineDataLoader.getAllCountries();
    console.log(`Countries loaded: ${countries.length}`);
    console.log(`Sample countries:`, countries.slice(0, 10));
    
    const testData = await window.vaccineDataLoader.getVaccineData(['Argentina', 'Japan', 'Brazil']);
    console.log('Test data for Argentina, Japan, Brazil:', testData);
    
    const searchResults = await window.vaccineDataLoader.searchCountries('Arg');
    console.log('Search results for "Arg":', searchResults);
    
    const stats = window.vaccineDataLoader.getCacheStats();
    console.log('Cache stats:', stats);
  };

  console.log('🧪 Test with: window.testDataLoader()');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VaccineDataLoader;
}
