/**
 * MedMe Travel Vaccination Assistant - Data Scraper
 * Scrapes vaccination data from TravelHealthPro (https://travelhealthpro.org.uk)
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const { JSDOM } = require('jsdom');

// Configuration - Production Safe Settings
const CONFIG = {
  BASE_URL: 'https://travelhealthpro.org.uk',
  COUNTRIES_URL: 'https://travelhealthpro.org.uk/countries',
  OUTPUT_DIR: path.join(__dirname, '..', 'data'),
  
  // Safe scraping practices
  DELAY_MS: 2000, // 2 second delay between requests (more respectful)
  RANDOM_DELAY_MAX: 1000, // Add random 0-1s additional delay
  USER_AGENT: 'MedMe-HealthExtension/1.0 (Educational/Medical; +contact@medme.health)',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 15000, // 15 second timeout
  
  // Production settings
  BATCH_SIZE: 50, // Process countries in batches
  PROGRESS_SAVE_INTERVAL: 10, // Save progress every 10 countries
  MAX_FILE_SIZE_MB: 4, // Stay under Chrome 5MB limit
  
  // Safety limits
  MAX_DAILY_REQUESTS: 1000, // Don't exceed reasonable daily limits
  RESPECT_HEADERS: true,
  
  // Data optimization
  COMPRESS_DATA: true,
  REGIONAL_SPLIT: true
};

// Main scraper class
class VaccineDataScraper {
  constructor() {
    this.countries = [];
    this.vaccineData = {};
    this.countryMappings = {};
    this.errorLog = [];
    
    // Production tracking
    this.processedCount = 0;
    this.startTime = Date.now();
    this.requestCount = 0;
    this.lastProgressSave = 0;
    this.regions = {}; // For regional data splitting
  }

  /**
   * Main scraping process
   */
  async scrape() {
    console.log('🩺 MedMe Vaccine Data Scraper Starting...');
    console.log(`📡 Target: ${CONFIG.COUNTRIES_URL}`);
    
    try {
      // Step 1: Create output directory
      await this.ensureOutputDirectory();
      
      // Step 2: Get all country links
      console.log('\n📋 Step 1: Fetching country list...');
      await this.fetchCountryList();
      
      // Step 3: Scrape vaccine data for each country
      console.log(`\n💉 Step 2: Scraping vaccine data for ${this.countries.length} countries...`);
      await this.scrapeAllCountries();
      
      // Step 4: Save data to files
      console.log('\n💾 Step 3: Saving data...');
      await this.saveData();
      
      // Step 5: Generate summary report
      console.log('\n📊 Step 4: Generating summary...');
      this.generateSummary();
      
      console.log('\n✅ Scraping completed successfully!');
      
    } catch (error) {
      console.error('\n❌ Scraping failed:', error);
      await this.saveErrorLog();
      process.exit(1);
    }
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory() {
    try {
      await fs.mkdir(CONFIG.OUTPUT_DIR, { recursive: true });
      console.log(`📁 Output directory ready: ${CONFIG.OUTPUT_DIR}`);
    } catch (error) {
      throw new Error(`Failed to create output directory: ${error.message}`);
    }
  }

  /**
   * Fetch list of all countries from TravelHealthPro
   */
  async fetchCountryList() {
    try {
      const html = await this.fetchWithRetry(CONFIG.COUNTRIES_URL);
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      // Find all country links - updated selector for current website structure
      let countryLinks = document.querySelectorAll('.number_div a');
      
      // Fallback to alternative selectors if primary doesn't work
      if (countryLinks.length === 0) {
        console.log('⚠️  Primary selector (.number_div a) failed, trying fallback...');
        countryLinks = document.querySelectorAll('.country-list a');
      }
      
      if (countryLinks.length === 0) {
        console.log('⚠️  Secondary selector failed, trying final fallback...');
        countryLinks = document.querySelectorAll('a[href*="/country/"]');
      }
      
      countryLinks.forEach(link => {
        const href = link.getAttribute('href');
        const name = link.textContent.trim();
        
        if (href && name) {
          // Handle both absolute and relative URLs
          const url = href.startsWith('http') ? href : CONFIG.BASE_URL + href;
          
          this.countries.push({
            name: name,
            url: url,
            slug: this.generateSlug(name)
          });
        }
      });
      
      console.log(`✅ Found ${this.countries.length} countries`);
      
      if (this.countries.length === 0) {
        throw new Error('No countries found. Website structure may have changed.');
      }
      
    } catch (error) {
      throw new Error(`Failed to fetch country list: ${error.message}`);
    }
  }

  /**
   * Scrape vaccine data for all countries - PRODUCTION SAFE VERSION
   */
  async scrapeAllCountries() {
    const total = this.countries.length;
    let completed = 0;
    let errors = 0;
    let skipped = 0;

    console.log(`\n🚀 Production scraping: ${total} countries`);
    console.log(`⚙️  Rate limit: ${CONFIG.DELAY_MS}ms + random ${CONFIG.RANDOM_DELAY_MAX}ms`);
    console.log(`💾 Progress saves every ${CONFIG.PROGRESS_SAVE_INTERVAL} countries`);
    
    // Check for existing progress
    await this.loadProgress();

    for (let i = 0; i < total; i++) {
      const country = this.countries[i];
      
      // Skip if already processed (resume capability)
      if (this.vaccineData[country.name]) {
        skipped++;
        completed++;
        continue;
      }
      
      try {
        // Safety check: respect daily limits
        if (this.requestCount >= CONFIG.MAX_DAILY_REQUESTS) {
          console.log(`\n⚠️  Daily request limit reached (${CONFIG.MAX_DAILY_REQUESTS}). Stopping.`);
          break;
        }
        
        console.log(`\n[${completed + 1}/${total}] Processing: ${country.name}`);
        
        await this.scrapeCountryVaccinesSafe(country);
        completed++;
        this.processedCount++;
        
        // Progress indicator with ETA
        const progress = ((completed / total) * 100).toFixed(1);
        const eta = this.calculateETA(completed, total);
        console.log(`✅ ${country.name} - ${progress}% complete (ETA: ${eta})`);
        
        // Save progress periodically
        if (this.processedCount % CONFIG.PROGRESS_SAVE_INTERVAL === 0) {
          await this.saveProgress();
        }
        
        // Safe rate limiting with random delay
        if (completed < total) {
          const delay = CONFIG.DELAY_MS + Math.random() * CONFIG.RANDOM_DELAY_MAX;
          await this.delay(delay);
        }
        
      } catch (error) {
        errors++;
        const errorMsg = `Failed to scrape ${country.name}: ${error.message}`;
        console.error(`❌ ${errorMsg}`);
        this.errorLog.push({ 
          country: country.name, 
          error: errorMsg, 
          timestamp: new Date().toISOString() 
        });
        
        // Continue with next country
        completed++;
        
        // Extra delay after errors to be respectful
        await this.delay(CONFIG.DELAY_MS * 2);
      }
    }
    
    console.log(`\n📈 Scraping Summary: ${completed} processed, ${errors} errors, ${skipped} skipped`);
    
    // Final save
    await this.saveProgress();
  }

  /**
   * Safe wrapper for scraping country vaccines
   */
  async scrapeCountryVaccinesSafe(country) {
    this.requestCount++;
    
    // Add to regional data for better organization
    const region = this.getRegion(country.name);
    if (!this.regions[region]) {
      this.regions[region] = [];
    }
    
    await this.scrapeCountryVaccines(country);
    this.regions[region].push(country.name);
  }

  /**
   * Load existing progress for resume capability
   */
  async loadProgress() {
    try {
      const progressPath = path.join(CONFIG.OUTPUT_DIR, 'scraping-progress.json');
      const progressData = await fs.readFile(progressPath, 'utf8');
      const progress = JSON.parse(progressData);
      
      this.vaccineData = progress.vaccineData || {};
      this.processedCount = progress.processedCount || 0;
      this.requestCount = progress.requestCount || 0;
      this.regions = progress.regions || {};
      
      const resumeCount = Object.keys(this.vaccineData).length;
      if (resumeCount > 0) {
        console.log(`📁 Resuming from ${resumeCount} previously processed countries`);
      }
    } catch (error) {
      console.log('📁 No previous progress found, starting fresh');
    }
  }

  /**
   * Save progress for resume capability
   */
  async saveProgress() {
    const progressPath = path.join(CONFIG.OUTPUT_DIR, 'scraping-progress.json');
    const progress = {
      vaccineData: this.vaccineData,
      processedCount: this.processedCount,
      requestCount: this.requestCount,
      regions: this.regions,
      lastSaved: new Date().toISOString(),
      countriesProcessed: Object.keys(this.vaccineData).length
    };
    
    await fs.writeFile(progressPath, JSON.stringify(progress, null, 2));
    console.log(`💾 Progress saved (${Object.keys(this.vaccineData).length} countries)`);
  }

  /**
   * Calculate estimated time to completion
   */
  calculateETA(completed, total) {
    if (completed === 0) return 'calculating...';
    
    const elapsed = Date.now() - this.startTime;
    const avgTimePerCountry = elapsed / completed;
    const remaining = total - completed;
    const etaMs = remaining * avgTimePerCountry;
    
    const hours = Math.floor(etaMs / (1000 * 60 * 60));
    const minutes = Math.floor((etaMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }

  /**
   * Get region for a country (for data organization)
   */
  getRegion(countryName) {
    const regions = {
      'Africa': ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Comoros', 'Congo', 'Democratic Republic of the Congo', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
      'Asia': ['Afghanistan', 'Bangladesh', 'Bhutan', 'Brunei', 'Cambodia', 'China', 'India', 'Indonesia', 'Iran', 'Iraq', 'Japan', 'Jordan', 'Kazakhstan', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Malaysia', 'Maldives', 'Mongolia', 'Myanmar', 'Nepal', 'Oman', 'Pakistan', 'Palestinian Territories', 'Philippines', 'Qatar', 'Saudi Arabia', 'Singapore', 'Sri Lanka', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand', 'Turkey', 'Turkmenistan', 'United Arab Emirates', 'Uzbekistan', 'Vietnam', 'Yemen'],
      'Europe': ['Albania', 'Andorra', 'Austria', 'Belarus', 'Belgium', 'Bosnia and Herzegovina', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Kosovo', 'Latvia', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Malta', 'Moldova', 'Monaco', 'Montenegro', 'Netherlands', 'North Macedonia', 'Norway', 'Poland', 'Portugal', 'Romania', 'Russia', 'San Marino', 'Serbia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland', 'Ukraine', 'United Kingdom'],
      'Americas': ['Antigua and Barbuda', 'Argentina', 'Bahamas', 'Barbados', 'Belize', 'Bolivia', 'Brazil', 'Canada', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'Ecuador', 'El Salvador', 'Grenada', 'Guatemala', 'Guyana', 'Haiti', 'Honduras', 'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay', 'Peru', 'St Kitts and Nevis', 'St Lucia', 'St Vincent and the Grenadines', 'Suriname', 'Trinidad and Tobago', 'USA', 'Uruguay', 'Venezuela'],
      'Oceania': ['Australia', 'Fiji', 'Kiribati', 'Marshall Islands', 'Micronesia', 'Nauru', 'New Zealand', 'Palau', 'Papua New Guinea', 'Samoa', 'Solomon Islands', 'Tonga', 'Tuvalu', 'Vanuatu']
    };
    
    for (const [region, countries] of Object.entries(regions)) {
      if (countries.some(country => countryName.includes(country) || country.includes(countryName))) {
        return region;
      }
    }
    
    return 'Other'; // Default region
  }

  /**
   * Scrape vaccine data for a single country
   */
  async scrapeCountryVaccines(country) {
    // Set current country context for proper filtering
    this.setCurrentCountry(country.name);
    
    // Don't add hash fragment - it might cause issues
    const vaccineUrl = country.url;
    console.log(`📡 Fetching: ${vaccineUrl}`);
    const html = await this.fetchWithRetry(vaccineUrl);
    
    // Quick validation
    if (html.length < 50000) {
      console.log(`⚠️  Small page size (${html.length} chars) - might be error page`);
    }
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Find vaccine recommendations section - FLEXIBLE DETECTION
    let vaccineSection = document.querySelector('#Vaccine_Recommendations');
    
    if (!vaccineSection) {
      // Try alternative selectors
      const altSelectors = [
        '#vaccine_recommendations',
        '#vaccines', 
        '#Vaccines',
        '[id*="vaccine"]',
        '[id*="Vaccine"]',
        'h2:contains("Vaccine")',
        'h2:contains("vaccine")'
      ];
      
      for (const selector of altSelectors) {
        vaccineSection = document.querySelector(selector);
        if (vaccineSection) break;
      }
    }
    
    // If still not found, look for headings containing "vaccine"
    if (!vaccineSection) {
      const headings = document.querySelectorAll('h1, h2, h3');
      for (const heading of headings) {
        if (heading.textContent.toLowerCase().includes('vaccine')) {
          vaccineSection = heading.parentElement || heading;
          break;
        }
      }
    }
    
    if (!vaccineSection) {
      console.log(`⚠️  No vaccine section found for ${country.name}, validating page content...`);
      
      // VALIDATION 1: Check if we got the right country page
      const pageTitle = document.title.toLowerCase();
      const countryNameLower = country.name.toLowerCase();
      const titleMatchesCountry = pageTitle.includes(countryNameLower) || 
                                 countryNameLower.includes(pageTitle.split(' - ')[1]?.toLowerCase() || '');
      
      if (!titleMatchesCountry) {
        console.log(`   ⚠️  Page title "${document.title}" doesn't match "${country.name}" - possible redirect issue`);
      }
      
      // VALIDATION 2: Check for vaccine content more thoroughly
      const pageHTML = document.body.innerHTML.toLowerCase();
      const pageText = (document.body.textContent || document.body.innerText || '').toLowerCase();
      
      // Check both HTML and text for vaccine content
      const hasVaccineText = pageHTML.includes('vaccine') || pageHTML.includes('vaccination') || 
                           pageText.includes('vaccine') || pageText.includes('vaccination');
      const hasHealthContent = pageHTML.includes('health') || pageHTML.includes('disease') || pageHTML.includes('risk') ||
                              pageText.includes('health') || pageText.includes('disease') || pageText.includes('risk');
      
      console.log(`   🔍 Text extraction: HTML=${pageHTML.length} chars, Text=${pageText.length} chars`);
      
      console.log(`   📊 Page analysis: vaccine=${hasVaccineText}, health=${hasHealthContent}, title_match=${titleMatchesCountry}`);
      
      // FORCE PARSING: If we have vaccine sections, try to parse regardless of text detection
      const hasVaccineSection = !!document.querySelector('#Vaccine_Recommendations');
      const hasOtherRisksSection = !!document.querySelector('#Other_Risks');
      
      console.log(`   📋 Sections found: Vaccine=${hasVaccineSection}, OtherRisks=${hasOtherRisksSection}`);
      
      // ATTEMPT PARSING: Try to parse if we have content OR sections
      if (hasVaccineText || hasHealthContent || hasVaccineSection || hasOtherRisksSection) {
        console.log(`   📄 Attempting to parse full page content for ${country.name}...`);
        vaccineSection = document.body;
        
        // Try to parse sections and see if we get any results
        const testMostTravellers = this.parseVaccineSection(document, 'Most travellers');
        const testSomeTravellers = this.parseVaccineSection(document, 'Some travellers');
        const testOtherRisks = this.parseOtherRisksSection(document);
        
        console.log(`   🧪 Test parsing results: ${testMostTravellers.length} most, ${testSomeTravellers.length} some, ${testOtherRisks.length} risks`);
        
        // If we found any content, continue with parsing
        if (testMostTravellers.length > 0 || testSomeTravellers.length > 0 || testOtherRisks.length > 0) {
          console.log(`   ✅ Found parseable content for ${country.name}`);
        } else {
          console.log(`   ⚠️  No parseable content found despite text presence - may be wrong page or unusual structure`);
        }
      } else {
        // LAST RESORT: Only store empty data if truly no health content
        console.log(`   ℹ️  No health-related content found for ${country.name} - storing empty data`);
        
        this.vaccineData[country.name] = {
          mostTravellers: [],
          someTravellers: [],
          otherRisks: [],
          lastUpdated: new Date().toISOString(),
          sourceUrl: country.url,
          note: 'No health content found on page',
          pageTitle: document.title  // Add for debugging
        };
        
        return; // Exit early with empty data
      }
      
      // Use body as section if we reach here
      vaccineSection = document.body;
    }
    
    // Parse "Most travellers" and "Some travellers" sections
    console.log(`   🔍 Parsing sections for ${country.name}...`);
    const mostTravellers = this.parseVaccineSection(document, 'Most travellers');
    const someTravellers = this.parseVaccineSection(document, 'Some travellers');
    
    // Parse "Other Risks" section for additional health information
    const otherRisks = this.parseOtherRisksSection(document);
    
    // Parse Malaria information from the same document (much more efficient!)
    const malariaInfo = this.parseMalariaSectionFromDocument(document, country);
    
    console.log(`   📊 Found: ${mostTravellers.length} most, ${someTravellers.length} some, ${otherRisks.length} risks, ${malariaInfo ? 'malaria info available' : 'no malaria info'}`);
    
    // Store data
    this.vaccineData[country.name] = {
      mostTravellers,
      someTravellers,
      otherRisks,
      malaria: malariaInfo,
      lastUpdated: new Date().toISOString(),
      sourceUrl: country.url
    };
    
    // Add country mappings
    this.countryMappings[country.slug] = country.name;
    this.countryMappings[country.name.toLowerCase()] = country.name;
  }

  /**
   * Parse vaccine section (Most travellers / Some travellers) - FLEXIBLE APPROACH
   */
  parseVaccineSection(document, sectionTitle) {
    const vaccines = [];
    
    // Find the section heading using flexible approach
    const sectionHeading = this.findSectionHeading(document, sectionTitle);
    if (!sectionHeading) {
      return vaccines; // Section not found
    }
    
    // Try multiple strategies to find vaccines in this section
    const strategies = [
      () => this.findAccordionVaccines(sectionHeading),
      () => this.findClickableVaccines(sectionHeading), 
      () => this.findListVaccines(sectionHeading),
      () => this.findHeadingVaccines(sectionHeading),
      () => this.findLinkVaccines(sectionHeading)
    ];
    
    for (const strategy of strategies) {
      try {
        const foundVaccines = strategy();
        if (foundVaccines && foundVaccines.length > 0) {
          vaccines.push(...foundVaccines);
          break; // Use first successful strategy
        }
      } catch (error) {
        // Silently try next strategy
        continue;
      }
    }
    
    return vaccines;
  }

  /**
   * Parse vaccine from H4 heading and its content - ENHANCED VERSION
   */
  parseVaccineFromHeading(headingElement) {
    // Extract vaccine name from H4 heading
    const headingText = headingElement.textContent.trim();
    let name = headingText.replace(/\s+vaccination\s*$/i, '').trim();
    
    // Capitalize first letter
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Collect ALL content from following elements (including accordion content)
    let description = '';
    let prevention = null;
    let riskFactors = [];
    let countrySpecific = null;
    let vaccination = null;
    let additionalSections = [];
    
    let currentElement = headingElement.nextElementSibling;
    
    // Collect content until next H4 or H2
    while (currentElement && 
           currentElement.tagName !== 'H4' && 
           currentElement.tagName !== 'H2') {
      
      // Handle accordion/collapsible content
      if (this.isAccordionElement(currentElement)) {
        // Extract country name from heading to pass as expected country
        const expectedCountry = this.extractCountryFromHeading(headingElement);
        const accordionContent = this.extractFullAccordionContent(currentElement, expectedCountry);
        description += accordionContent.description + ' ';
        
        if (accordionContent.countrySpecific) {
          countrySpecific = accordionContent.countrySpecific;
        }
        if (accordionContent.prevention) {
          prevention = accordionContent.prevention;
        }
        if (accordionContent.vaccination) {
          vaccination = accordionContent.vaccination;
        }
        if (accordionContent.additionalSections) {
          additionalSections.push(...accordionContent.additionalSections);
        }
      }
      // Handle regular paragraphs
      else if (currentElement.tagName === 'P') {
        const pText = currentElement.textContent.trim();
        description += pText + ' ';
        
        // Check for country-specific information
        if (pText.toLowerCase().includes(' in ') && 
            (pText.toLowerCase().includes('country') || pText.toLowerCase().includes('this area'))) {
          countrySpecific = pText;
        }
      } 
      // Handle lists (including nested accordion content)
      else if (currentElement.tagName === 'UL') {
        const listContent = this.extractListContent(currentElement);
        description += listContent.text + ' ';
        riskFactors.push(...listContent.riskFactors);
        
        if (!prevention && listContent.prevention) {
          prevention = listContent.prevention;
        }
      }
      // Handle divs that might contain accordion content
      else if (currentElement.tagName === 'DIV') {
        const divContent = this.extractDivContent(currentElement);
        if (divContent.text.length > 10) {
          description += divContent.text + ' ';
          
          if (divContent.countrySpecific) {
            countrySpecific = divContent.countrySpecific;
          }
          if (divContent.prevention) {
            prevention = divContent.prevention;
          }
          if (divContent.vaccination) {
            vaccination = divContent.vaccination;
          }
        }
      }
      
      currentElement = currentElement.nextElementSibling;
    }
    
    if (!description.trim()) {
      return null;
    }
    
    const vaccine = {
      name: name,
      description: description.trim(),
      prevention: prevention,
      countrySpecific: countrySpecific,
      vaccination: vaccination
    };
    
    if (riskFactors.length > 0) {
      vaccine.riskFactors = riskFactors;
    }
    
    if (additionalSections.length > 0) {
      vaccine.additionalSections = additionalSections;
    }
    
    return vaccine;
  }

  /**
   * Check if element contains accordion/collapsible content
   */
  isAccordionElement(element) {
    if (!element) return false;
    
    // Check for accordion-related classes and attributes
    const accordionIndicators = [
      'accordion', 'collapsible', 'expandable', 'dropdown',
      'toggle', 'clickable', 'interactive'
    ];
    
    const className = element.className || '';
    const hasAccordionClass = accordionIndicators.some(indicator => 
      className.toLowerCase().includes(indicator)
    );
    
    // Check for accordion-related attributes
    const hasAccordionAttrs = element.hasAttribute('aria-expanded') ||
                             element.hasAttribute('data-toggle') ||
                             element.hasAttribute('data-target') ||
                             element.hasAttribute('aria-controls');
    
    // Check for clickable elements that might expand content
    const hasClickableElements = element.querySelector('button, a[href="#"], [onclick], [tabindex]');
    
    // Check for hidden/collapsed content
    const hasHiddenContent = element.querySelector('[style*="display: none"], [style*="hidden"], [aria-hidden="true"]');
    
    return hasAccordionClass || hasAccordionAttrs || hasClickableElements || hasHiddenContent;
  }

  /**
   * Extract full content from accordion element with proper country filtering and header parsing
   */
  extractFullAccordionContent(element, expectedCountry = null) {
    const content = {
      description: '',
      countrySpecific: null,
      prevention: null,
      vaccination: null,
      additionalSections: []
    };
    
    // Get all text content (including hidden elements)
    const allText = this.getAllTextContent(element);
    
    // Parse content by headers (H2, H3, H4, H5) to get structured sections
    const structuredSections = this.parseContentByHeaders(element, allText);
    
    // Extract main description (text before first header)
    content.description = structuredSections.description || allText.split('\n')[0] || '';
    
    // Process each structured section
    structuredSections.sections.forEach(section => {
      const headingLower = section.heading.toLowerCase();
      const contentText = section.content;
      
      // Country-specific section
      if (headingLower.includes(' in ') && expectedCountry && 
          headingLower.includes(expectedCountry.toLowerCase())) {
        content.countrySpecific = `${section.heading} ${contentText}`.trim();
      }
      // Prevention section
      else if (headingLower.includes('prevention')) {
        content.prevention = contentText;
      }
      // Vaccination section
      else if (headingLower.includes('vaccination')) {
        content.vaccination = contentText;
      }
      // Other sections go to additional
      else {
        content.additionalSections.push({
          heading: section.heading,
          content: contentText
        });
      }
    });
    
    // Fallback extraction if structured parsing didn't work
    if (!content.countrySpecific) {
      content.countrySpecific = this.extractCountrySpecificFallback(allText, expectedCountry);
    }
    if (!content.prevention) {
      content.prevention = this.extractPreventionFallback(allText);
    }
    if (!content.vaccination) {
      content.vaccination = this.extractVaccinationFallback(allText);
    }
    
    return content;
  }

  /**
   * Parse content by HTML headers to get structured sections
   */
  parseContentByHeaders(element, allText) {
    const result = {
      description: '',
      sections: []
    };
    
    // Find all headings in the element
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    if (headings.length === 0) {
      result.description = allText;
      return result;
    }
    
    // Get description before first heading
    const firstHeading = headings[0];
    let descriptionElement = firstHeading.previousElementSibling;
    let description = '';
    
    // Collect all content before first heading
    let walker = element.firstChild;
    while (walker && walker !== firstHeading) {
      if (walker.nodeType === 3 || walker.tagName === 'P') { // Text node or paragraph
        description += (walker.textContent || '').trim() + ' ';
      }
      walker = walker.nextSibling;
    }
    
    result.description = description.trim();
    
    // Process each heading and its content
    headings.forEach((heading, index) => {
      const headingText = heading.textContent.trim();
      let sectionContent = '';
      
      // Get content after this heading until next heading
      let currentElement = heading.nextElementSibling;
      const nextHeading = headings[index + 1];
      
      while (currentElement && currentElement !== nextHeading) {
        if (currentElement.textContent.trim()) {
          sectionContent += currentElement.textContent.trim() + ' ';
        }
        currentElement = currentElement.nextElementSibling;
      }
      
      result.sections.push({
        heading: headingText,
        content: sectionContent.trim(),
        level: parseInt(heading.tagName.charAt(1)) // H2 -> 2, H3 -> 3, etc.
      });
    });
    
    return result;
  }

  /**
   * Fallback country-specific extraction with filtering
   */
  extractCountrySpecificFallback(text, expectedCountry) {
    if (!expectedCountry) return null;
    
    // Look for risk statements that might be country-specific
    const riskPatterns = [
      /there is a.*?risk.*?in this country[^.]*\./i,
      /this country has.*?risk[^.]*\./i,
      /risk.*?in this country[^.]*\./i
    ];
    
    for (const pattern of riskPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return null;
  }

  /**
   * Fallback prevention extraction
   */
  extractPreventionFallback(text) {
    const preventionPatterns = [
      /travellers?\s+should[^.]*\./i,
      /prevention[^.]*\./i,
      /avoid[^.]*mosquito[^.]*\./i
    ];
    
    for (const pattern of preventionPatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    return null;
  }

  /**
   * Fallback vaccination extraction
   */
  extractVaccinationFallback(text) {
    const vaccinationPatterns = [
      /vaccination[^.]*considered[^.]*\./i,
      /vaccine.*may be[^.]*\./i
    ];
    
    for (const pattern of vaccinationPatterns) {
      const match = text.match(pattern);
      if (match) {
        // Get a longer excerpt for vaccination info
        const index = text.indexOf(match[0]);
        const extended = text.substring(index, index + 500);
        const sentences = extended.split(/\.\s+/);
        return sentences.slice(0, 3).join('. ') + '.';
      }
    }
    
    return null;
  }

  /**
   * Get all text content including from hidden elements
   */
  getAllTextContent(element) {
    let text = '';
    
    // Get direct text content
    text += element.textContent || element.innerText || '';
    
    // Look for hidden content in common hiding patterns
    const hiddenElements = element.querySelectorAll(
      '[style*="display: none"], [style*="hidden"], [aria-hidden="true"], .hidden, .collapsed'
    );
    
    hiddenElements.forEach(hiddenEl => {
      const hiddenText = hiddenEl.textContent || hiddenEl.innerText || '';
      if (hiddenText.trim() && !text.includes(hiddenText.trim())) {
        text += ' ' + hiddenText.trim();
      }
    });
    
    // Clean up the text
    return text.replace(/\s+/g, ' ').trim();
  }

  /**
   * Extract content from list elements
   */
  extractListContent(listElement) {
    const content = {
      text: '',
      riskFactors: [],
      prevention: null
    };
    
    const listItems = listElement.querySelectorAll('li');
    listItems.forEach(item => {
      const itemText = item.textContent.trim();
      content.text += itemText + ' ';
      
      // Look for risk factors and prevention advice
      if (itemText.toLowerCase().includes('risk') || 
          itemText.toLowerCase().includes('stay') ||
          itemText.toLowerCase().includes('work') ||
          itemText.toLowerCase().includes('travel')) {
        content.riskFactors.push(itemText);
      }
      
      if (!content.prevention && this.extractPreventionAdvice(itemText)) {
        content.prevention = this.extractPreventionAdvice(itemText);
      }
    });
    
    return content;
  }

  /**
   * Extract content from div elements (including accordion containers)
   */
  extractDivContent(divElement) {
    const content = {
      text: '',
      countrySpecific: null,
      prevention: null,
      vaccination: null
    };
    
    // Get all text from the div
    const allText = this.getAllTextContent(divElement);
    content.text = allText;
    
    // Look for specific patterns
    const lowerText = allText.toLowerCase();
    
    // Country-specific content
    if (lowerText.includes(' in ') && (lowerText.includes('country') || lowerText.includes('this area'))) {
      content.countrySpecific = allText;
    }
    
    // Prevention content
    if (lowerText.includes('prevention') || lowerText.includes('avoid') || lowerText.includes('travellers should')) {
      content.prevention = allText;
    }
    
    // Vaccination content
    if (lowerText.includes('vaccination') && lowerText.includes('consider')) {
      content.vaccination = allText;
    }
    
    return content;
  }

  /**
   * Extract subsections with headings
   */
  extractSubsections(element) {
    const subsections = [];
    
    // Look for headings within the element
    const headings = element.querySelectorAll('h3, h4, h5, h6, strong, .section-header');
    
    headings.forEach(heading => {
      const headingText = heading.textContent.trim();
      
      if (headingText.length > 5 && headingText.length < 100) {
        // Get content after this heading
        let content = '';
        let nextElement = heading.nextElementSibling;
        
        while (nextElement && !this.isHeadingElement(nextElement)) {
          const text = nextElement.textContent.trim();
          if (text) {
            content += text + ' ';
          }
          nextElement = nextElement.nextElementSibling;
        }
        
        if (content.trim().length > 10) {
          subsections.push({
            heading: headingText,
            content: content.trim()
          });
        }
      }
    });
    
    return subsections;
  }

  /**
   * Check if element is a heading
   */
  isHeadingElement(element) {
    if (!element || !element.tagName) return false;
    
    const headingTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
    const headingClasses = ['section-header', 'subsection', 'heading'];
    
    return headingTags.includes(element.tagName) || 
           (element.classList && headingClasses.some(cls => element.classList.contains(cls)));
  }

  /**
   * Parse Other Risks section for additional health information
   */
  parseOtherRisksSection(document) {
    const risks = [];
    
    // Find the "Other Risks" section heading
    const sectionHeading = this.findSectionHeading(document, 'Other Risks');
    if (!sectionHeading) {
      return risks; // Section not found
    }
    
    // Try the same flexible strategies as vaccines
    const strategies = [
      () => this.findAccordionRisks(sectionHeading),
      () => this.findClickableRisks(sectionHeading), 
      () => this.findListRisks(sectionHeading),
      () => this.findHeadingRisks(sectionHeading),
      () => this.findLinkRisks(sectionHeading)
    ];
    
    for (const strategy of strategies) {
      try {
        const foundRisks = strategy();
        if (foundRisks && foundRisks.length > 0) {
          risks.push(...foundRisks);
          break; // Use first successful strategy
        }
      } catch (error) {
        // Silently try next strategy
        continue;
      }
    }
    
    return risks;
  }

  /**
   * Parse Malaria section from the same document (OPTIMIZED VERSION)
   * @param {Document} document - Already fetched document 
   * @param {Object} country - Country object with name and url
   * @returns {Object|null} - Malaria information or null if not available
   */
  parseMalariaSectionFromDocument(document, country) {
    try {
      console.log(`   🦟 Checking for malaria information in same document for ${country.name}`);
      
      // Check if malaria section exists in the current document
      const malariaSection = document.querySelector('#Malaria') || 
                           document.querySelector('[id*="malaria" i]') ||
                           this.findSectionHeading(document, 'Malaria');
      
      if (!malariaSection) {
        console.log(`   ℹ️  No malaria section found for ${country.name}`);
        return null;
      }
      
      console.log(`   🦟 Found malaria section for ${country.name}`);
      
      // Extract malaria information from the same document
      const malariaData = {
        riskAreas: this.extractMalariaRiskAreas(document),
        specialRiskGroups: this.extractMalariaSpecialRiskGroups(document),
        generalInfo: this.extractMalariaGeneralInfo(document),
        sourceUrl: `${country.url}#Malaria`,
        lastUpdated: new Date().toISOString()
      };
      
      // Only return data if we found meaningful content
      if (malariaData.riskAreas || malariaData.specialRiskGroups || malariaData.generalInfo) {
        console.log(`   ✅ Extracted malaria data: ${malariaData.riskAreas ? 'risk areas, ' : ''}${malariaData.specialRiskGroups ? 'special groups, ' : ''}${malariaData.generalInfo ? 'general info' : ''}`);
        return malariaData;
      }
      
      return null;
      
    } catch (error) {
      console.log(`   ⚠️  Error parsing malaria information for ${country.name}: ${error.message}`);
      return null;
    }
  }

  /**
   * Extract Risk Areas section from malaria page (SIMPLIFIED)
   */
  extractMalariaRiskAreas(document) {
    const riskAreasHeading = this.findSectionHeading(document, 'Risk areas') || 
                           this.findSectionHeading(document, 'Risk Areas') ||
                           this.findSectionHeading(document, 'RISK AREAS');
    
    if (!riskAreasHeading) {
      return null;
    }
    
    // Simply extract all content until next major heading - no parsing
    const content = this.extractSectionContent(riskAreasHeading);
    if (!content || content.trim().length < 20) {
      return null;
    }
    
    // Return raw content preserving formatting
    return content.trim();
  }

  /**
   * Extract Special Risk Groups section from malaria page (SIMPLIFIED)
   */
  extractMalariaSpecialRiskGroups(document) {
    const specialGroupsHeading = this.findSectionHeading(document, 'Special risk groups') || 
                               this.findSectionHeading(document, 'Special Risk Groups') ||
                               this.findSectionHeading(document, 'SPECIAL RISK GROUPS');
    
    if (!specialGroupsHeading) {
      return null;
    }
    
    // Simply extract all content until next major heading - no parsing
    const content = this.extractSectionContent(specialGroupsHeading);
    if (!content || content.trim().length < 20) {
      return null;
    }
    
    // Return raw content preserving formatting
    return content.trim();
  }

  /**
   * Extract general malaria information (DISABLED - only need risk areas)
   */
  extractMalariaGeneralInfo(document) {
    // Disabled - we only need the specific risk areas content
    // which is already captured perfectly in riskAreas field
    return null;
  }

  /**
   * Parse risk areas content into structured format
   */
  parseRiskAreasContent(content, document, heading) {
    const riskAreas = [];
    
    // Get the container for this section
    const container = this.findSectionContainer(heading);
    if (!container) return content; // Fallback to raw content
    
    // Look for list items or bullet points describing risk areas
    const lists = container.querySelectorAll('ul, ol');
    
    for (const list of lists) {
      const items = list.querySelectorAll('li');
      for (const item of items) {
        const text = item.textContent?.trim();
        if (text && text.length > 20) {
          // Try to extract risk level and area description
          const riskArea = this.parseRiskAreaItem(text);
          if (riskArea) {
            riskAreas.push(riskArea);
          }
        }
      }
    }
    
    // If no structured data found, return the raw content
    return riskAreas.length > 0 ? riskAreas : content;
  }

  /**
   * Parse individual risk area item
   */
  parseRiskAreaItem(text) {
    // Common patterns for risk areas
    const patterns = [
      /there is (a )?(low|high|moderate|no) risk.*?in (.*?)[\.:]/i,
      /risk.*?(low|high|moderate|none).*?in (.*?)[\.:]/i,
      /(low|high|moderate|no) risk.*?areas?.*?(below|above|in) (.*?)[\.:]/i
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          riskLevel: match[1] || match[2] || 'unknown',
          area: match[3] || match[2] || 'unknown',
          fullDescription: text
        };
      }
    }
    
    // Fallback: if it mentions risk, include it
    if (text.toLowerCase().includes('risk')) {
      return {
        riskLevel: 'unknown',
        area: 'unknown',
        fullDescription: text
      };
    }
    
    return null;
  }

  /**
   * Parse special risk groups content
   */
  parseSpecialGroupsContent(content, document, heading) {
    const specialGroups = [];
    
    // Get the container for this section
    const container = this.findSectionContainer(heading);
    if (!container) return content; // Fallback to raw content
    
    // Look for paragraphs describing special groups
    const paragraphs = container.querySelectorAll('p, div');
    
    for (const para of paragraphs) {
      const text = para.textContent?.trim();
      if (text && text.length > 50) {
        // Try to identify special group descriptions
        const specialGroup = this.parseSpecialGroupItem(text);
        if (specialGroup) {
          specialGroups.push(specialGroup);
        }
      }
    }
    
    // If no structured data found, return the raw content
    return specialGroups.length > 0 ? specialGroups : content;
  }

  /**
   * Parse individual special group item
   */
  parseSpecialGroupItem(text) {
    // Look for mentions of specific groups
    const groupPatterns = [
      /travellers who are.*?(elderly|pregnant|immunosuppressed|spleen)/i,
      /(elderly|pregnant|immunosuppressed|children|spleen).*?travellers/i,
      /for (those|people|individuals) (who|with).*?(condition|risk)/i
    ];
    
    for (const pattern of groupPatterns) {
      const match = text.match(pattern);
      if (match) {
        return {
          group: match[1] || 'special group',
          recommendation: text,
          type: 'special_risk_group'
        };
      }
    }
    
    // Include if it mentions specific medical advice
    if (text.toLowerCase().includes('antimalarial') || 
        text.toLowerCase().includes('medication') ||
        text.toLowerCase().includes('consultation')) {
      return {
        group: 'general',
        recommendation: text,
        type: 'medical_advice'
      };
    }
    
    return null;
  }

  // ========= HELPER FUNCTIONS FOR MALARIA AND SECTION PARSING =========

  /**
   * Extract content from a section heading until the next major heading
   */
  extractSectionContent(sectionHeading) {
    if (!sectionHeading) return null;
    
    let content = '';
    let currentElement = sectionHeading.nextElementSibling;
    
    while (currentElement) {
      // Stop if we hit another major heading
      if (this.isMajorHeading(currentElement)) {
        break;
      }
      
      // Collect text content
      const text = currentElement.textContent?.trim();
      if (text) {
        content += text + '\n';
      }
      
      currentElement = currentElement.nextElementSibling;
    }
    
    return content.trim();
  }

  /**
   * Check if an element is a major heading (H1-H3)
   */
  isMajorHeading(element) {
    if (!element || !element.tagName) return false;
    
    const tagName = element.tagName.toLowerCase();
    return ['h1', 'h2', 'h3'].includes(tagName);
  }

  // ========= OTHER RISKS PARSING STRATEGIES =========

  findAccordionRisks(sectionHeading) {
    const risks = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return risks;
    
    // Same accordion selectors but looking for health risks
    const accordionSelectors = [
      '.accordion-item', '.collapsible', '.expandable',
      '[data-toggle]', '.dropdown-toggle', '[aria-expanded]',
      'button[aria-controls]', '.accordion-button',
      'a[href="#"]', 'a[data-target]'
    ];
    
    for (const selector of accordionSelectors) {
      const elements = container.querySelectorAll(selector);
      
      for (const element of elements) {
        const risk = this.extractRiskFromElement(element);
        if (risk) {
          risks.push(risk);
        }
      }
      
      if (risks.length > 0) break;
    }
    
    return risks;
  }

  findClickableRisks(sectionHeading) {
    const risks = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return risks;
    
    const clickableSelectors = ['a', 'button', '[onclick]', '[tabindex]'];
    
    for (const selector of clickableSelectors) {
      const elements = container.querySelectorAll(selector);
      
      for (const element of elements) {
    const text = element.textContent.trim();
        if (this.looksLikeHealthRisk(text)) {
          const risk = this.extractRiskFromElement(element);
          if (risk) {
            risks.push(risk);
          }
        }
      }
      
      if (risks.length > 0) break;
    }
    
    return risks;
  }

  findListRisks(sectionHeading) {
    const risks = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return risks;
    
    const lists = container.querySelectorAll('ul, ol, dl');
    
    for (const list of lists) {
      const items = list.querySelectorAll('li, dt, dd');
      for (const item of items) {
        const text = item.textContent.trim();
        if (this.looksLikeHealthRisk(text)) {
          const risk = this.extractRiskFromElement(item);
          if (risk) {
            risks.push(risk);
          }
        }
      }
    }
    
    return risks;
  }

  findHeadingRisks(sectionHeading) {
    const risks = [];
    
    const allHeadings = sectionHeading.ownerDocument.querySelectorAll('h2, h3, h4, h5');
    let foundSection = false;
    
    for (const heading of allHeadings) {
      if (heading === sectionHeading) {
        foundSection = true;
        continue;
      }
      
      if (foundSection) {
        const text = heading.textContent.trim();
        
        // Stop at next major section
        if (this.isMajorSection(text)) break;
        
        if (this.looksLikeHealthRisk(text)) {
          const risk = this.extractRiskFromHeading(heading);
          if (risk) {
            risks.push(risk);
          }
        }
      }
    }
    
    return risks;
  }

  findLinkRisks(sectionHeading) {
    const risks = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return risks;
    
    const links = container.querySelectorAll('a[href]');
    
    for (const link of links) {
      const text = link.textContent.trim();
      if (this.looksLikeHealthRisk(text)) {
        const risk = this.extractRiskFromElement(link);
        if (risk) {
          risks.push(risk);
        }
      }
    }
    
    return risks;
  }

  // ========= RISK EXTRACTION HELPERS =========

  looksLikeHealthRisk(text) {
    if (!text || text.length < 3 || text.length > 100) return false;
    
    const riskKeywords = [
      'infection', 'disease', 'virus', 'bacteria', 'parasite',
      'influenza', 'dengue', 'zika', 'malaria', 'schistosomiasis',
      'sexually transmitted', 'insect', 'tick', 'mosquito', 'bite',
      'air quality', 'pollution', 'heat', 'cold', 'water',
      'food', 'hygiene', 'safety', 'accident', 'injury'
    ];
    
    const lowerText = text.toLowerCase();
    
    // Check for health risk keywords
    if (riskKeywords.some(keyword => lowerText.includes(keyword))) {
      return true;
    }
    
    // Pattern matching for risk-like topics
    if (/^[a-z\s]+(infection|disease|virus|risk)s?$/i.test(text)) {
      return true;
    }
    
    return false;
  }

  extractRiskFromElement(element) {
    const fullText = element.textContent.trim();
    if (!fullText) return null;
    
    // Extract risk name from first line/heading
    const lines = fullText.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length === 0) return null;
    
    let name = lines[0];
    
    // Clean up the risk name
    name = name
      .replace(/\s+in\s+\w+.*$/i, '') // Remove " in [Country]"
      .replace(/^\s*[\d\.\-\*]+\s*/, '') // Remove list markers
      .split(/[:\-\(]/)[0] // Take first part before punctuation
      .trim();
    
    if (!name || name.length < 2 || name.length > 60) return null;
    
    // Capitalize properly
    name = name.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Clean and structure the description
    const cleanedText = fullText
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
    
    // Extract prevention advice
    const prevention = this.extractPreventionAdvice(cleanedText);
    
    // Create description from first few sentences
    const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const description = sentences.slice(0, 4).join('. ').trim();
    
    return {
      name: name,
      type: 'health_risk',
      description: description || `Health risk information for ${name}`,
      prevention: prevention
    };
  }

  extractRiskFromHeading(headingElement) {
    // Similar to extractVaccineFromElement but for health risks
    const headingText = headingElement.textContent.trim();
    let name = headingText
      .replace(/\s+in\s+\w+.*$/i, '')
      .trim();
    
    // Capitalize properly
    name = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Collect description from following elements
    let description = '';
    let prevention = null;
    
    let currentElement = headingElement.nextElementSibling;
    
    // Collect content until next heading
    while (currentElement && 
           !['H2', 'H3', 'H4', 'H5'].includes(currentElement.tagName)) {
      
      if (currentElement.tagName === 'P') {
        description += currentElement.textContent.trim() + ' ';
      } else if (currentElement.tagName === 'UL') {
        const listItems = currentElement.querySelectorAll('li');
        listItems.forEach(item => {
          const itemText = item.textContent.trim();
          description += itemText + ' ';
          
          if (!prevention && this.extractPreventionAdvice(itemText)) {
            prevention = this.extractPreventionAdvice(itemText);
          }
        });
      }
      
      currentElement = currentElement.nextElementSibling;
    }
    
    if (!description.trim()) {
      return null;
    }
    
    return {
      name: name,
      type: 'health_risk',
      description: description.trim(),
      prevention: prevention
    };
  }

  // ========= FLEXIBLE PARSING STRATEGIES =========

  findSectionHeading(document, sectionTitle) {
    // Try multiple ways to find the section heading
    const selectors = [
      'h2', 'h3', 'h4', 
      '[data-section]', '.section-header', '.vaccine-section',
      '.accordion-header', '.collapsible-header'
    ];
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (element.textContent.trim() === sectionTitle) {
          return element;
        }
      }
    }
    
    return null;
  }

  findAccordionVaccines(sectionHeading) {
    const vaccines = [];
    
    // Look for accordion/collapsible elements after the section
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return vaccines;
    
    // Common accordion selectors
    const accordionSelectors = [
      '.accordion-item', '.collapsible', '.expandable',
      '[data-toggle]', '.dropdown-toggle', '[aria-expanded]',
      'button[aria-controls]', '.accordion-button',
      'a[href="#"]', 'a[data-target]'
    ];
    
    for (const selector of accordionSelectors) {
      const elements = container.querySelectorAll(selector);
      
      for (const element of elements) {
        const vaccine = this.extractVaccineFromElement(element);
        if (vaccine) {
          vaccines.push(vaccine);
        }
      }
      
      if (vaccines.length > 0) break; // Use first successful selector
    }
    
    return vaccines;
  }

  findClickableVaccines(sectionHeading) {
    const vaccines = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return vaccines;
    
    // Look for clickable elements that might be vaccines
    const clickableSelectors = [
      'a', 'button', '[onclick]', '[tabindex]',
      '.clickable', '.interactive', '.vaccine-link'
    ];
    
    for (const selector of clickableSelectors) {
      const elements = container.querySelectorAll(selector);
      
      for (const element of elements) {
    const text = element.textContent.trim();
        if (this.looksLikeVaccineName(text)) {
          const vaccine = this.extractVaccineFromElement(element);
          if (vaccine) {
            vaccines.push(vaccine);
          }
        }
      }
      
      if (vaccines.length > 0) break;
    }
    
    return vaccines;
  }

  findListVaccines(sectionHeading) {
    const vaccines = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return vaccines;
    
    // Look for list items
    const lists = container.querySelectorAll('ul, ol, dl');
    
    for (const list of lists) {
      const items = list.querySelectorAll('li, dt, dd');
      for (const item of items) {
        const text = item.textContent.trim();
        if (this.looksLikeVaccineName(text)) {
          const vaccine = this.extractVaccineFromElement(item);
          if (vaccine) {
            vaccines.push(vaccine);
          }
        }
      }
    }
    
    return vaccines;
  }

  findHeadingVaccines(sectionHeading) {
    const vaccines = [];
    
    // This is the original H2-based approach
    const allHeadings = sectionHeading.ownerDocument.querySelectorAll('h2, h3, h4, h5');
    let foundSection = false;
    
    for (const heading of allHeadings) {
      if (heading === sectionHeading) {
        foundSection = true;
        continue;
      }
      
      if (foundSection) {
        const text = heading.textContent.trim();
        
        // Stop at next major section
        if (this.isMajorSection(text)) break;
        
        if (this.isVaccineHeading(text)) {
          const vaccine = this.parseVaccineFromH2Heading(heading);
          if (vaccine) {
            vaccines.push(vaccine);
          }
        }
      }
    }
    
    return vaccines;
  }

  findLinkVaccines(sectionHeading) {
    const vaccines = [];
    
    const container = this.findSectionContainer(sectionHeading);
    if (!container) return vaccines;
    
    // Look for links that might lead to vaccine details
    const links = container.querySelectorAll('a[href]');
    
    for (const link of links) {
      const text = link.textContent.trim();
      const href = link.getAttribute('href');
      
      if (this.looksLikeVaccineName(text) || 
          (href && href.includes('vaccine'))) {
        const vaccine = this.extractVaccineFromElement(link);
        if (vaccine) {
          vaccines.push(vaccine);
        }
      }
    }
    
    return vaccines;
  }

  // ========= HELPER METHODS =========

  findSectionContainer(sectionHeading) {
    // Try to find the container that holds the section content
    let container = sectionHeading.nextElementSibling;
    
    // Look for next sibling that's a container
    while (container && container.tagName && 
           !['DIV', 'SECTION', 'ARTICLE'].includes(container.tagName)) {
      container = container.nextElementSibling;
    }
    
    // If no container found, use parent or create a virtual container
    if (!container) {
      container = sectionHeading.parentElement;
    }
    
    return container;
  }

  looksLikeVaccineName(text) {
    if (!text || text.length < 3 || text.length > 50) return false;
    
    const vaccineKeywords = [
      'hepatitis', 'tetanus', 'typhoid', 'rabies', 'measles', 'mumps', 
      'rubella', 'dengue', 'zika', 'yellow fever', 'japanese encephalitis',
      'tick-borne', 'meningococcal', 'pneumococcal', 'influenza', 
      'cholera', 'polio', 'diphtheria', 'lyssavirus', 'covid'
    ];
    
    const lowerText = text.toLowerCase();
    
    // Direct keyword match
    if (vaccineKeywords.some(keyword => lowerText.includes(keyword))) {
      return true;
    }
    
    // Pattern matching for vaccine-like names
    if (/^[a-z\s]+\s*(vaccination?|vaccine)$/i.test(text)) {
      return true;
    }
    
    // Single word that looks medical
    if (/^[a-z]{4,15}$/i.test(text) && !this.isCommonWord(lowerText)) {
      return true;
    }
    
    return false;
  }

  isCommonWord(text) {
    const commonWords = [
      'prevention', 'information', 'details', 'more', 'click', 'here',
      'about', 'general', 'country', 'travel', 'health', 'advice'
    ];
    return commonWords.includes(text);
  }

  isMajorSection(text) {
    const majorSections = [
      'Most travellers', 'Some travellers', 'Other Risks', 
      'Certificate requirements', 'Malaria', 'Health risks',
      'General Information', 'Resources', 'News', 'Outbreaks',
      'All travellers', 'Vaccine Recommendations'
    ];
    return majorSections.includes(text);
  }

  extractVaccineFromElement(element) {
    // Enhanced extraction that handles accordion content
    const name = this.extractVaccineNameFromElement(element);
    if (!name) return null;
    
    // Check if this is an accordion element
    if (this.isAccordionElement(element)) {
      // Try to extract country context from the element or its parents
      const expectedCountry = this.extractCountryFromContext(element);
      const accordionContent = this.extractFullAccordionContent(element, expectedCountry);
      
      return {
        name: name,
        description: accordionContent.description || `Information about ${name}`,
        prevention: accordionContent.prevention,
        countrySpecific: accordionContent.countrySpecific,
        vaccination: accordionContent.vaccination,
        additionalSections: accordionContent.additionalSections
      };
    }
    
    // Fallback to original logic for non-accordion elements
    const fullText = this.getAllTextContent(element);
    if (!fullText) return null;
    
    // Extract prevention advice
    const prevention = this.extractPreventionAdvice(fullText);
    
    // Create a cleaner description by taking first few sentences
    const sentences = fullText.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const description = sentences.slice(0, 3).join('. ').trim();
    
    return {
      name: name,
      description: description || `Information about ${name}`,
      prevention: prevention
    };
  }

  /**
   * Extract vaccine name from element using multiple strategies
   */
  extractVaccineNameFromElement(element) {
    const fullText = element.textContent.trim();
    if (!fullText) return null;
    
    // Strategy 1: Look for clickable/header elements with vaccine names
    const clickableElements = element.querySelectorAll('button, a, .clickable, .vaccine-name, h4, h3, strong');
    for (const clickable of clickableElements) {
      const text = clickable.textContent.trim();
      if (this.looksLikeVaccineName(text)) {
        return this.cleanVaccineName(text);
      }
    }
    
    // Strategy 2: Extract from first line of text
    const lines = fullText.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length > 0) {
      let name = lines[0];
      
      // Clean up the vaccine name more aggressively
      name = name
        .replace(/\s+vaccination?\s*$/i, '')
        .replace(/\s+in\s+\w+.*$/i, '')
        .replace(/^\s*[\d\.\-\*]+\s*/, '') // Remove list markers
        .replace(/\s+\(.+\)\s*$/, '') // Remove parenthetical info if at end
        .split(/[:\-\(]/)[0] // Take only first part before colons, dashes, or parens
        .trim();
      
      if (this.looksLikeVaccineName(name)) {
        return this.cleanVaccineName(name);
      }
    }
    
    // Strategy 3: Look for vaccine keywords in the full text
    const vaccineKeywords = [
      'hepatitis a', 'hepatitis b', 'tetanus', 'typhoid', 'rabies', 'dengue', 
      'zika', 'yellow fever', 'japanese encephalitis', 'meningococcal',
      'pneumococcal', 'influenza', 'cholera', 'polio', 'diphtheria', 'lyssavirus',
      'chikungunya'
    ];
    
    for (const keyword of vaccineKeywords) {
      if (fullText.toLowerCase().includes(keyword)) {
        return this.cleanVaccineName(keyword);
      }
    }
    
    return null;
  }

  /**
   * Clean vaccine name
   */
  cleanVaccineName(name) {
    if (!name) return null;
    
    const cleaned = name
      .replace(/\s+vaccination?\s*$/i, '')
      .replace(/\s+in\s+\w+.*$/i, '')
      .replace(/^\s*[\d\.\-\*]+\s*/, '')
      .split(/[:\-\(]/)[0]
      .trim();
    
    if (cleaned.length < 2 || cleaned.length > 30) return null;
    
    // Capitalize properly
    return cleaned.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Extract prevention advice from vaccine text
   */
  extractPreventionAdvice(text) {
    // Look for common prevention keywords
    const preventionKeywords = [
      'take care with',
      'avoid',
      'use',
      'clean',
      'seek medical',
      'prevention'
    ];
    
    const sentences = text.split('.').map(s => s.trim());
    
    for (const sentence of sentences) {
      const lowerSentence = sentence.toLowerCase();
      
      for (const keyword of preventionKeywords) {
        if (lowerSentence.includes(keyword)) {
          return sentence;
        }
      }
    }
    
    return null;
  }

  /**
   * Check if element is a section heading
   */
  isNextSection(element) {
    if (!element) return true;
    
    const tagName = element.tagName;
    if (!['H3', 'H4', 'H5'].includes(tagName)) return false;
    
    const text = element.textContent.toLowerCase();
    const sectionKeywords = [
      'travellers',
      'recommendations',
      'certificates',
      'outbreak',
      'health risks'
    ];
    
    return sectionKeywords.some(keyword => text.includes(keyword));
  }

  /**
   * Save all data to JSON files + Chrome-optimized format
   */
  async saveData() {
    // Traditional format
    const files = [
      {
        name: 'countries-db.json',
        data: this.vaccineData
      },
      {
        name: 'country-mappings.json',
        data: this.countryMappings
      },
      {
        name: 'last-update.json',
        data: {
          timestamp: new Date().toISOString(),
          countriesCount: Object.keys(this.vaccineData).length,
          version: '1.0.0',
          regions: Object.keys(this.regions),
          totalSize: JSON.stringify(this.vaccineData).length
        }
      }
    ];
    
    for (const file of files) {
      const filePath = path.join(CONFIG.OUTPUT_DIR, file.name);
      await fs.writeFile(filePath, JSON.stringify(file.data, null, 2));
      console.log(`💾 Saved: ${file.name}`);
    }
    
    // Chrome-optimized format
    await this.saveChromeOptimizedData();
  }

  /**
   * Save data optimized for Chrome Extension storage
   */
  async saveChromeOptimizedData() {
    console.log('\n🔧 Creating Chrome-optimized storage format...');
    
    // Compress and split data by regions
    for (const [region, countryNames] of Object.entries(this.regions)) {
      const regionData = {};
      
      countryNames.forEach(countryName => {
        if (this.vaccineData[countryName]) {
          regionData[countryName] = this.compressCountryData(this.vaccineData[countryName]);
        }
      });
      
      const regionFile = {
        name: `chrome-data-${region.toLowerCase()}.json`,
        data: {
          region: region,
          countries: regionData,
          metadata: {
            lastUpdated: new Date().toISOString(),
            countryCount: Object.keys(regionData).length,
            version: '1.0.0'
          }
        }
      };
      
      const filePath = path.join(CONFIG.OUTPUT_DIR, regionFile.name);
      const jsonData = JSON.stringify(regionFile.data);
      const sizeKB = (jsonData.length / 1024).toFixed(1);
      
      await fs.writeFile(filePath, jsonData);
      console.log(`💾 Chrome format: ${regionFile.name} (${sizeKB}KB)`);
      
      // Warn if approaching Chrome limits
      if (jsonData.length > 800000) { // 800KB warning threshold
        console.log(`⚠️  ${regionFile.name} is large (${sizeKB}KB) - consider further splitting`);
      }
    }
    
    // Create master index for Chrome extension
    const masterIndex = {
      regions: Object.keys(this.regions),
      totalCountries: Object.keys(this.vaccineData).length,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      dataFiles: Object.keys(this.regions).map(region => `chrome-data-${region.toLowerCase()}.json`)
    };
    
    const indexPath = path.join(CONFIG.OUTPUT_DIR, 'chrome-index.json');
    await fs.writeFile(indexPath, JSON.stringify(masterIndex, null, 2));
    console.log(`💾 Chrome index: chrome-index.json`);
  }

  /**
   * Compress country data for Chrome storage
   */
  compressCountryData(countryData) {
    return {
      m: this.compressVaccines(countryData.mostTravellers || []),       // most travellers
      s: this.compressVaccines(countryData.someTravellers || []),       // some travellers  
      r: this.compressRisks(countryData.otherRisks || []),              // other risks
      malaria: countryData.malaria || null,                            // malaria data (keep full)
      u: countryData.lastUpdated,                                       // last updated
      l: countryData.sourceUrl                                          // source link
    };
  }

  /**
   * Compress vaccine data
   */
  compressVaccines(vaccines) {
    return vaccines.map(vaccine => ({
      n: vaccine.name,                                    // name
      d: vaccine.description?.substring(0, 200) || '',   // description (truncated for display)
      p: vaccine.prevention?.substring(0, 100) || null,  // prevention (truncated for display)
      r: vaccine.riskFactors?.slice(0, 3) || null,       // risk factors (max 3)
      // Enhanced fields (keep full for expansion)
      countrySpecific: vaccine.countrySpecific || null,
      vaccination: vaccine.vaccination || null,
      additionalSections: vaccine.additionalSections || null,
      // Keep full fields for expansion
      description: vaccine.description || null,          // full description
      prevention: vaccine.prevention || null             // full prevention
    }));
  }

  /**
   * Compress risk data 
   */
  compressRisks(risks) {
    return risks.map(risk => ({
      n: risk.name,                                     // name
      t: risk.type,                                     // type
      d: risk.description?.substring(0, 150) || '',    // description (truncated)
      p: risk.prevention?.substring(0, 80) || null     // prevention (truncated)
    }));
  }

  /**
   * Save error log
   */
  async saveErrorLog() {
    if (this.errorLog.length > 0) {
      const errorPath = path.join(CONFIG.OUTPUT_DIR, 'error-log.json');
      await fs.writeFile(errorPath, JSON.stringify(this.errorLog, null, 2));
      console.log(`📝 Error log saved: ${errorPath}`);
    }
  }

  /**
   * Generate summary report
   */
  generateSummary() {
    const totalCountries = Object.keys(this.vaccineData).length;
    const totalErrors = this.errorLog.length;
    const successRate = ((totalCountries / this.countries.length) * 100).toFixed(1);
    
    // Calculate totals
    let totalMostTravellers = 0;
    let totalSomeTravellers = 0;
    let totalOtherRisks = 0;
    
    Object.values(this.vaccineData).forEach(countryData => {
      totalMostTravellers += countryData.mostTravellers?.length || 0;
      totalSomeTravellers += countryData.someTravellers?.length || 0;
      totalOtherRisks += countryData.otherRisks?.length || 0;
    });
    
    console.log('\n📊 SCRAPING SUMMARY');
    console.log('==================');
    console.log(`Countries processed: ${totalCountries}`);
    console.log(`Errors encountered: ${totalErrors}`);
    console.log(`Success rate: ${successRate}%`);
    console.log(`Data saved to: ${CONFIG.OUTPUT_DIR}`);
    console.log('\n📋 Data Statistics:');
    console.log(`  💉 Most Travellers vaccines: ${totalMostTravellers}`);
    console.log(`  💉 Some Travellers vaccines: ${totalSomeTravellers}`);
    console.log(`  ⚠️  Other Health Risks: ${totalOtherRisks}`);
    console.log(`  📊 Total health entries: ${totalMostTravellers + totalSomeTravellers + totalOtherRisks}`);
    
    if (totalErrors > 0) {
      console.log('\n❌ Countries with errors:');
      this.errorLog.forEach(error => {
        console.log(`  - ${error.country}: ${error.error}`);
      });
    }
  }

  /**
   * HTTP request with retry logic
   */
  async fetchWithRetry(url, retries = CONFIG.MAX_RETRIES) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await this.fetchHtml(url);
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }
        console.log(`⚠️  Attempt ${attempt} failed, retrying...`);
        await this.delay(1000 * attempt); // Exponential backoff
      }
    }
  }

  /**
   * Fetch HTML content from URL - PRODUCTION SAFE VERSION with working browser headers
   */
  fetchHtml(url) {
    return new Promise((resolve, reject) => {
      const request = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache'
        }
      }, (response) => {
        // Respect server headers
        if (CONFIG.RESPECT_HEADERS) {
          const retryAfter = response.headers['retry-after'];
          if (retryAfter) {
            const delay = parseInt(retryAfter) * 1000;
            console.log(`⏳ Server requested ${retryAfter}s delay`);
            setTimeout(() => this.fetchHtml(url).then(resolve).catch(reject), delay);
            return;
          }
        }
        
        let data = '';
        
        response.on('data', chunk => {
          data += chunk;
        });
        
        response.on('end', () => {
          if (response.statusCode === 200) {
            resolve(data);
          } else if (response.statusCode === 429) {
            // Rate limited - wait and retry
            console.log(`⚠️  Rate limited for ${url}, waiting...`);
            setTimeout(() => this.fetchHtml(url).then(resolve).catch(reject), 5000);
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          }
        });
      });
      
      request.on('error', reject);
      request.setTimeout(CONFIG.TIMEOUT_MS, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  /**
   * Generate URL-friendly slug
   */
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  /**
   * Extract country from heading element context
   */
  extractCountryFromHeading(headingElement) {
    if (!headingElement) return null;
    
    // Look for country name in the heading text
    const headingText = headingElement.textContent || '';
    const countryMatch = headingText.match(/([A-Za-z\s]+)\s+vaccination?\s*$/i);
    if (countryMatch) {
      return countryMatch[1].trim();
    }
    
    return null;
  }

  /**
   * Extract country context from element or page context
   */
  extractCountryFromContext(element) {
    // Method 1: Look for country info in the page URL or title
    if (typeof window !== 'undefined') {
      const url = window.location?.href || '';
      const title = document.title || '';
      
      // Extract from URL patterns like /country/220/thailand
      const urlMatch = url.match(/\/country\/\d+\/([^\/\?]+)/i);
      if (urlMatch) {
        return urlMatch[1].replace(/[-_]/g, ' ');
      }
      
      // Extract from page title
      const titleMatch = title.match(/([A-Za-z\s]+)\s*-\s*Travel/i);
      if (titleMatch) {
        return titleMatch[1].trim();
      }
    }
    
    // Method 2: Look in the current scraping context
    if (this.currentCountry) {
      return this.currentCountry;
    }
    
    // Method 3: Look for country headings on the page
    const countryHeadings = element.ownerDocument?.querySelectorAll('h1, h2, h3');
    if (countryHeadings) {
      for (const heading of countryHeadings) {
        const text = heading.textContent || '';
        if (text.includes('Thailand') || text.includes('tanzania') || text.includes('country')) {
          const words = text.split(/\s+/);
          for (const word of words) {
            if (word.length > 3 && /^[A-Z][a-z]+$/.test(word) && 
                !['Travel', 'Health', 'Country', 'Information'].includes(word)) {
              return word;
            }
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Set current country context for scraping
   */
  setCurrentCountry(countryName) {
    this.currentCountry = countryName;
  }

  /**
   * Delay execution
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run scraper if called directly
if (require.main === module) {
  const scraper = new VaccineDataScraper();
  scraper.scrape().catch(console.error);
}

module.exports = VaccineDataScraper;
