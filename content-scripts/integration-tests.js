/**
 * TravelGuard - Integration Tests
 * Tests the complete data pipeline from scraped files to sidebar display
 */

class TravelGuardIntegrationTests {
  constructor() {
    this.testResults = [];
    this.startTime = null;
  }

  async runAllTests() {
    console.log('🧪 TravelGuard Integration Tests Starting...');
    console.log('='.repeat(50));
    
    this.startTime = Date.now();
    this.testResults = [];

    const tests = [
      { name: 'Data Loader Initialization', fn: () => this.testDataLoaderInit() },
      { name: 'Country List Loading', fn: () => this.testCountryListLoading() },
      { name: 'Country Search Functionality', fn: () => this.testCountrySearch() },
      { name: 'Vaccine Data Loading', fn: () => this.testVaccineDataLoading() },
      { name: 'Data Decompression', fn: () => this.testDataDecompression() },
      { name: 'Country Detection', fn: () => this.testCountryDetection() },
      { name: 'Sidebar Integration', fn: () => this.testSidebarIntegration() },
      { name: 'Background Script Integration', fn: () => this.testBackgroundIntegration() },
      { name: 'End-to-End Workflow', fn: () => this.testEndToEndWorkflow() }
    ];

    for (const test of tests) {
      try {
        console.log(`\n🔬 Running: ${test.name}...`);
        const result = await test.fn();
        this.testResults.push({ name: test.name, status: 'PASS', result });
        console.log(`✅ ${test.name}: PASSED`);
      } catch (error) {
        this.testResults.push({ name: test.name, status: 'FAIL', error: error.message });
        console.error(`❌ ${test.name}: FAILED`, error);
      }
    }

    this.printTestSummary();
    return this.testResults;
  }

  async testDataLoaderInit() {
    if (!window.vaccineDataLoader) {
      throw new Error('VaccineDataLoader not found on window object');
    }

    const dataLoader = window.vaccineDataLoader;
    
    // Test cache stats
    const stats = dataLoader.getCacheStats();
    if (typeof stats !== 'object') {
      throw new Error('getCacheStats() should return an object');
    }

    return { dataLoaderExists: true, stats };
  }

  async testCountryListLoading() {
    const dataLoader = window.vaccineDataLoader;
    const countries = await dataLoader.getAllCountries();
    
    if (!Array.isArray(countries)) {
      throw new Error('getAllCountries() should return an array');
    }

    if (countries.length < 50) {
      throw new Error(`Expected at least 50 countries, got ${countries.length}`);
    }

    // Test that we have some expected countries
    const expectedCountries = ['Argentina', 'Brazil', 'Japan', 'Germany', 'Australia'];
    const foundExpected = expectedCountries.filter(country => countries.includes(country));
    
    if (foundExpected.length !== expectedCountries.length) {
      throw new Error(`Missing expected countries. Found: ${foundExpected.join(', ')}`);
    }

    return { 
      totalCountries: countries.length, 
      sampleCountries: countries.slice(0, 10),
      expectedFound: foundExpected.length
    };
  }

  async testCountrySearch() {
    const dataLoader = window.vaccineDataLoader;
    
    // Test exact match
    const exactResults = await dataLoader.searchCountries('Argentina', 5);
    if (!exactResults.includes('Argentina')) {
      throw new Error('Exact search for "Argentina" should return Argentina');
    }

    // Test partial match
    const partialResults = await dataLoader.searchCountries('Arg', 5);
    if (partialResults.length === 0) {
      throw new Error('Partial search for "Arg" should return results');
    }

    // Test case insensitive
    const caseResults = await dataLoader.searchCountries('brazil', 5);
    if (!caseResults.some(country => country.toLowerCase().includes('brazil'))) {
      throw new Error('Case insensitive search should work');
    }

    return {
      exactSearch: exactResults.length,
      partialSearch: partialResults.length,
      caseInsensitive: caseResults.length
    };
  }

  async testVaccineDataLoading() {
    const dataLoader = window.vaccineDataLoader;
    const testCountries = ['Argentina', 'Brazil', 'Japan'];
    
    const vaccineData = await dataLoader.getVaccineData(testCountries);
    
    if (typeof vaccineData !== 'object') {
      throw new Error('getVaccineData() should return an object');
    }

    const loadedCountries = Object.keys(vaccineData);
    if (loadedCountries.length === 0) {
      throw new Error('No vaccine data loaded for test countries');
    }

    // Check data structure
    for (const country of loadedCountries) {
      const data = vaccineData[country];
      if (!data.mostTravellers || !data.someTravellers || !data.otherRisks) {
        throw new Error(`Invalid data structure for ${country}`);
      }
    }

    return {
      requestedCountries: testCountries.length,
      loadedCountries: loadedCountries.length,
      sampleData: loadedCountries.reduce((acc, country) => {
        const data = vaccineData[country];
        acc[country] = {
          mostTravellers: data.mostTravellers.length,
          someTravellers: data.someTravellers.length,
          otherRisks: data.otherRisks.length
        };
        return acc;
      }, {})
    };
  }

  async testDataDecompression() {
    const dataLoader = window.vaccineDataLoader;
    
    // Test the decompression utility directly
    const mockCompressedData = {
      m: [{ n: 'Hepatitis A', d: 'Test description', p: 'Test prevention', r: null }],
      s: [{ n: 'Rabies', d: 'Risk description', p: 'Risk prevention', r: ['animals'] }],
      r: [{ n: 'Food poisoning', t: 'health', d: 'Food risk', p: 'Be careful' }],
      u: '2025-08-18T01:00:00Z',
      l: 'https://test.com'
    };

    const decompressed = dataLoader.decompressCountryData(mockCompressedData);
    
    if (!decompressed.mostTravellers || !decompressed.someTravellers || !decompressed.otherRisks) {
      throw new Error('Decompression failed - missing required fields');
    }

    if (decompressed.mostTravellers[0].name !== 'Hepatitis A') {
      throw new Error('Decompression failed - incorrect vaccine name');
    }

    return {
      mostTravellers: decompressed.mostTravellers.length,
      someTravellers: decompressed.someTravellers.length,
      otherRisks: decompressed.otherRisks.length,
      lastUpdated: decompressed.lastUpdated
    };
  }

  async testCountryDetection() {
    if (!window.countryDetector) {
      throw new Error('CountryDetector not found on window object');
    }

    const detector = window.countryDetector;
    
    // Test text extraction
    const testText = 'I am traveling to Argentina and Brazil next month for vacation.';
    const extractedCountries = detector.extractCountriesFromText(testText);
    
    if (!Array.isArray(extractedCountries)) {
      throw new Error('extractCountriesFromText should return an array');
    }

    if (!extractedCountries.includes('Argentina') || !extractedCountries.includes('Brazil')) {
      throw new Error('Failed to extract expected countries from test text');
    }

    return {
      testText: testText,
      extractedCountries: extractedCountries,
      detectorActive: detector.isActive
    };
  }

  async testSidebarIntegration() {
    if (!window.vaccinationSidebar) {
      throw new Error('VaccinationSidebar not found on window object');
    }

    const sidebar = window.vaccinationSidebar;
    
    // Test data loader connection
    if (!sidebar.dataLoader) {
      throw new Error('Sidebar should be connected to data loader');
    }

    // Test available countries
    if (!sidebar.availableCountries || sidebar.availableCountries.length === 0) {
      throw new Error('Sidebar should have available countries loaded');
    }

    return {
      sidebarExists: true,
      dataLoaderConnected: !!sidebar.dataLoader,
      availableCountries: sidebar.availableCountries.length,
      isVisible: sidebar.isVisible,
      isMinimized: sidebar.isMinimized
    };
  }

  async testBackgroundIntegration() {
    try {
      // Test chrome.runtime.sendMessage
      const response = await chrome.runtime.sendMessage({
        action: 'getVaccineData',
        countries: ['Argentina', 'Brazil']
      });

      if (!response) {
        throw new Error('No response from background script');
      }

      if (!response.success) {
        throw new Error(`Background script error: ${response.error}`);
      }

      const data = response.data;
      if (!data || Object.keys(data).length === 0) {
        throw new Error('Background script returned no data');
      }

      return {
        backgroundResponds: true,
        dataReceived: Object.keys(data).length,
        sampleCountries: Object.keys(data)
      };

    } catch (error) {
      // If chrome.runtime is not available, this is expected in non-extension context
      if (error.message.includes('chrome.runtime')) {
        return {
          backgroundResponds: false,
          reason: 'Running outside extension context',
          expected: true
        };
      }
      throw error;
    }
  }

  async testEndToEndWorkflow() {
    // Test the complete workflow
    const dataLoader = window.vaccineDataLoader;
    const detector = window.countryDetector;
    const sidebar = window.vaccinationSidebar;

    // 1. Search for a country
    const searchResults = await dataLoader.searchCountries('Argentina', 1);
    if (searchResults.length === 0) {
      throw new Error('Country search failed');
    }

    const testCountry = searchResults[0];

    // 2. Load vaccine data
    const vaccineData = await dataLoader.getVaccineData([testCountry]);
    if (!vaccineData[testCountry]) {
      throw new Error('Failed to load vaccine data');
    }

    // 3. Test country detection
    const detectionText = `Planning a trip to ${testCountry} for medical conference.`;
    const detectedCountries = detector.extractCountriesFromText(detectionText);
    if (!detectedCountries.includes(testCountry)) {
      throw new Error('Country detection failed');
    }

    // 4. Test sidebar can handle the data
    sidebar.selectedCountries = [testCountry];
    sidebar.countryData[testCountry] = vaccineData[testCountry];
    
    const generatedHTML = sidebar.generateCountryResults(testCountry);
    if (!generatedHTML.includes(testCountry)) {
      throw new Error('Sidebar failed to generate country results');
    }

    return {
      searchWorked: true,
      dataLoadWorked: true,
      detectionWorked: true,
      sidebarWorked: true,
      testCountry: testCountry,
      vaccineCount: vaccineData[testCountry].mostTravellers.length + vaccineData[testCountry].someTravellers.length
    };
  }

  printTestSummary() {
    const endTime = Date.now();
    const duration = endTime - this.startTime;
    
    console.log('\n' + '='.repeat(50));
    console.log('🧪 INTEGRATION TEST SUMMARY');
    console.log('='.repeat(50));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    
    console.log(`📊 Results: ${passed}/${this.testResults.length} tests passed`);
    console.log(`⏱️  Duration: ${duration}ms`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults.filter(r => r.status === 'FAIL').forEach(test => {
        console.log(`  - ${test.name}: ${test.error}`);
      });
    }
    
    if (passed === this.testResults.length) {
      console.log('\n🎉 ALL TESTS PASSED! TravelGuard integration is working correctly.');
      console.log('✅ The scraped vaccination data is now fully connected to the frontend.');
    }
    
    console.log('='.repeat(50));
  }
}

// Create global test instance
if (typeof window !== 'undefined') {
  window.travelGuardTests = new TravelGuardIntegrationTests();
  
  // Global test function
  window.runTravelGuardTests = async () => {
    return await window.travelGuardTests.runAllTests();
  };

  console.log('🧪 Integration tests available at window.runTravelGuardTests()');
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TravelGuardIntegrationTests;
}
