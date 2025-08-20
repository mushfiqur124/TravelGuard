/**
 * Production readiness test - validates scraper with 5 countries
 */

const VaccineDataScraper = require('./scraper.js');

async function productionTest() {
  console.log('🧪 PRODUCTION READINESS TEST');
  console.log('============================');
  console.log('Testing scraper with 5 diverse countries...\n');
  
  const scraper = new VaccineDataScraper();
  
  try {
    // Get country list
    console.log('📋 Step 1: Fetching country list...');
    await scraper.fetchCountryList();
    
    // Test with 5 diverse countries
    const testCountries = ['Brazil', 'Japan', 'Kenya', 'France', 'Australia'];
    const foundCountries = scraper.countries.filter(country => 
      testCountries.some(testName => 
        country.name.toLowerCase().includes(testName.toLowerCase())
      )
    );
    
    if (foundCountries.length < 3) {
      throw new Error(`Only found ${foundCountries.length}/5 test countries`);
    }
    
    // Limit to found test countries
    scraper.countries = foundCountries.slice(0, 5);
    
    console.log(`✅ Total countries available: ${scraper.countries.length}`);
    console.log(`🎯 Testing with: ${scraper.countries.map(c => c.name).join(', ')}\n`);
    
    // Test scraping
    console.log('📋 Step 2: Testing scraping functionality...');
    await scraper.scrapeAllCountries();
    
    // Analyze results
    console.log('\n📋 Step 3: Analyzing results...');
    const countries = Object.keys(scraper.vaccineData);
    let successCount = 0;
    let totalVaccines = 0;
    let totalRisks = 0;
    
    countries.forEach(countryName => {
      const data = scraper.vaccineData[countryName];
      const mostCount = data.mostTravellers?.length || 0;
      const someCount = data.someTravellers?.length || 0;
      const riskCount = data.otherRisks?.length || 0;
      
      totalVaccines += mostCount + someCount;
      totalRisks += riskCount;
      
      if (mostCount > 0 || someCount > 0 || riskCount > 0) {
        successCount++;
        console.log(`✅ ${countryName}: ${mostCount} most, ${someCount} some, ${riskCount} risks`);
      } else {
        console.log(`⚠️  ${countryName}: No data extracted`);
      }
    });
    
    console.log('\n📊 TEST RESULTS:');
    console.log('================');
    console.log(`Countries tested: ${countries.length}`);
    console.log(`Successful extractions: ${successCount}`);
    console.log(`Success rate: ${((successCount / countries.length) * 100).toFixed(1)}%`);
    console.log(`Total vaccines found: ${totalVaccines}`);
    console.log(`Total health risks found: ${totalRisks}`);
    console.log(`Errors: ${scraper.errorLog.length}`);
    
    // Validate success criteria
    const successRate = (successCount / countries.length) * 100;
    
    if (successRate >= 80) {
      console.log('\n🎉 PRODUCTION TEST PASSED!');
      console.log('✅ Scraper is ready for full production run');
      console.log('🚀 Use "npm run scrape" to scrape all ~290 countries\n');
    } else {
      throw new Error(`Success rate ${successRate.toFixed(1)}% is below 80% threshold`);
    }
    
  } catch (error) {
    console.error('\n❌ PRODUCTION TEST FAILED!');
    console.error(`Error: ${error.message}`);
    console.error('🔧 Please fix issues before running full scrape\n');
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  productionTest().catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
}
