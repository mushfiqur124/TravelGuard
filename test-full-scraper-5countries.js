#!/usr/bin/env node

/**
 * Test Full Scraper - 5 Random Countries
 * Comprehensive test of the enhanced scraper with malaria integration
 */

const VaccineDataScraper = require('./scripts/scraper.js');

async function testFullScraper() {
  console.log('🌍 Testing Enhanced Scraper with 5 Random Countries');
  console.log('=' .repeat(70));
  
  const scraper = new VaccineDataScraper();
  
  try {
    // 5 diverse countries with different characteristics:
    // - Thailand: Enhanced accordion content issue (Asia)
    // - Kenya: Has malaria data (Africa) 
    // - Bolivia: Has malaria data (South America)
    // - Brazil: Large country with malaria (South America)
    // - India: Large country, complex data (Asia)
    const testCountries = [
      {
        name: 'Thailand',
        url: 'https://travelhealthpro.org.uk/country/221/thailand',
        slug: 'thailand',
        notes: 'Testing enhanced accordion extraction (Chikungunya fix)'
      },
      {
        name: 'Kenya', 
        url: 'https://travelhealthpro.org.uk/country/117/kenya',
        slug: 'kenya',
        notes: 'Testing malaria data extraction'
      },
      {
        name: 'Bolivia',
        url: 'https://travelhealthpro.org.uk/country/30/bolivia', 
        slug: 'bolivia',
        notes: 'Testing malaria data extraction (South America)'
      },
      {
        name: 'Brazil',
        url: 'https://travelhealthpro.org.uk/country/34/brazil',
        slug: 'brazil',
        notes: 'Testing large country with malaria (FIXED URL)'
      },
      {
        name: 'India',
        url: 'https://travelhealthpro.org.uk/country/105/india',
        slug: 'india', 
        notes: 'Testing complex data structure + malaria extraction'
      }
    ];
    
    console.log(`📊 Testing Countries:`);
    testCountries.forEach((country, index) => {
      console.log(`   ${index + 1}. ${country.name} - ${country.notes}`);
    });
    console.log('');
    
    let totalSuccess = 0;
    let malariaCountries = 0;
    let enhancedDataCountries = 0;
    
    for (const [index, country] of testCountries.entries()) {
      console.log(`🔍 Testing ${index + 1}/5: ${country.name}`);
      console.log(`   URL: ${country.url}`);
      console.log(`   Focus: ${country.notes}`);
      
      try {
        // Scrape the country
        await scraper.scrapeCountryVaccines(country);
        
        // Analyze the results
        const countryData = scraper.vaccineData[country.name];
        
        if (!countryData) {
          console.log(`   ❌ No data found for ${country.name}`);
          continue;
        }
        
        console.log(`   ✅ Data extracted successfully`);
        console.log(`      Most Travellers: ${countryData.mostTravellers?.length || 0} vaccines`);
        console.log(`      Some Travellers: ${countryData.someTravellers?.length || 0} vaccines`);
        console.log(`      Other Risks: ${countryData.otherRisks?.length || 0} risks`);
        
        // Check for malaria data
        if (countryData.malaria) {
          malariaCountries++;
          console.log(`      🦟 Malaria: ✅ Available`);
          if (countryData.malaria.riskAreas) {
            const riskPreview = countryData.malaria.riskAreas.substring(0, 100);
            console.log(`         Risk Areas: "${riskPreview}${riskPreview.length < countryData.malaria.riskAreas.length ? '...' : ''}"`);
          }
          if (countryData.malaria.specialRiskGroups) {
            console.log(`         Special Risk Groups: Available`);
          }
        } else {
          console.log(`      🦟 Malaria: ❌ Not available`);
        }
        
        // Check for enhanced accordion data
        let hasEnhancedData = false;
        if (countryData.mostTravellers) {
          for (const vaccine of countryData.mostTravellers) {
            if (vaccine.countrySpecific || vaccine.vaccination || 
                (vaccine.additionalSections && vaccine.additionalSections.length > 0)) {
              hasEnhancedData = true;
              break;
            }
          }
        }
        
        if (hasEnhancedData) {
          enhancedDataCountries++;
          console.log(`      🎯 Enhanced Data: ✅ Detailed accordion content extracted`);
        } else {
          console.log(`      🎯 Enhanced Data: ❌ Only basic content`);
        }
        
        // Specific test for Thailand Chikungunya
        if (country.name === 'Thailand') {
          const chikungunya = countryData.mostTravellers?.find(v => 
            (v.name || v.n || '').toLowerCase().includes('chikungunya')
          ) || countryData.someTravellers?.find(v => 
            (v.name || v.n || '').toLowerCase().includes('chikungunya')
          );
          
          if (chikungunya) {
            const desc = chikungunya.description || chikungunya.d || '';
            if (desc.length > 300) {  // Should be much longer with enhanced extraction
              console.log(`      ✅ Chikungunya: Enhanced content captured (${desc.length} chars)`);
            } else {
              console.log(`      ⚠️  Chikungunya: Only basic content (${desc.length} chars)`);
            }
          }
        }
        
        totalSuccess++;
        
      } catch (error) {
        console.log(`   ❌ Error scraping ${country.name}: ${error.message}`);
      }
      
      console.log('');
    }
    
    // Summary
    console.log('📋 TEST SUMMARY');
    console.log('=' .repeat(50));
    console.log(`✅ Successful countries: ${totalSuccess}/${testCountries.length}`);
    console.log(`🦟 Countries with malaria data: ${malariaCountries}`);
    console.log(`🎯 Countries with enhanced accordion data: ${enhancedDataCountries}`);
    
    if (totalSuccess === testCountries.length) {
      console.log('\n🎉 ALL TESTS PASSED! Scraper is production ready!');
    } else {
      console.log('\n⚠️  Some tests failed. Check the errors above.');
    }
    
    // Show sample data structure
    if (totalSuccess > 0) {
      const firstCountry = Object.keys(scraper.vaccineData)[0];
      const sampleData = scraper.vaccineData[firstCountry];
      
      console.log('\n📋 SAMPLE DATA STRUCTURE:');
      console.log(JSON.stringify({
        country: firstCountry,
        structure: {
          mostTravellers: `${sampleData.mostTravellers?.length || 0} items`,
          someTravellers: `${sampleData.someTravellers?.length || 0} items`, 
          otherRisks: `${sampleData.otherRisks?.length || 0} items`,
          malaria: sampleData.malaria ? 'Available' : 'Not available',
          lastUpdated: sampleData.lastUpdated || 'Unknown',
          sourceUrl: sampleData.sourceUrl || 'Unknown'
        }
      }, null, 2));
      
      // Show a sample vaccine item with enhanced data
      if (sampleData.mostTravellers && sampleData.mostTravellers.length > 0) {
        const sampleVaccine = sampleData.mostTravellers.find(v => 
          v.countrySpecific || v.vaccination || (v.additionalSections && v.additionalSections.length > 0)
        ) || sampleData.mostTravellers[0];
        
        console.log('\n📋 SAMPLE VACCINE ITEM:');
        console.log(JSON.stringify({
          name: sampleVaccine.name,
          hasEnhancedData: !!(sampleVaccine.countrySpecific || sampleVaccine.vaccination || 
                             (sampleVaccine.additionalSections && sampleVaccine.additionalSections.length > 0)),
          fields: {
            description: sampleVaccine.description ? 'Available' : 'Not available',
            countrySpecific: sampleVaccine.countrySpecific ? 'Available' : 'Not available',
            prevention: sampleVaccine.prevention ? 'Available' : 'Not available',
            vaccination: sampleVaccine.vaccination ? 'Available' : 'Not available',
            additionalSections: sampleVaccine.additionalSections ? sampleVaccine.additionalSections.length + ' sections' : 'Not available'
          }
        }, null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  }
}

if (require.main === module) {
  testFullScraper().catch(console.error);
}

module.exports = testFullScraper;
