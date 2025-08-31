/**
 * TravelGuard - Simple Sidebar Interface
 * Just focus on getting it to show up first!
 */

class VaccinationSidebar {
  constructor() {
    this.isVisible = false;
    this.isMinimized = false;
    this.sidebarElement = null;
    this.selectedCountries = [];
    this.lastCountriesKey = ''; // Track countries to prevent unnecessary AI summary clearing
    this.countryData = {};
    this.availableCountries = [];
    this.dataLoader = null;
    this.lastUpdateInfo = null;
    
    // Comprehensive city-to-country mapping for Canadian medical travelers
    this.cityToCountryMapping = {
      // --- Medical Tourism Destinations ---
      "bangkok": "Thailand",
      "phuket": "Thailand",
      "chiang mai": "Thailand",
      "pattaya": "Thailand",
      "mumbai": "India",
      "bombay": "India",
      "delhi": "India",
      "new delhi": "India",
      "chennai": "India",
      "madras": "India",
      "bangalore": "India",
      "bengaluru": "India",
      "hyderabad": "India",
      "kolkata": "India",
      "calcutta": "India",
      "goa": "India",
      "mexico city": "Mexico",
      "ciudad de mexico": "Mexico",
      "tijuana": "Mexico",
      "cancun": "Mexico",
      "puerto vallarta": "Mexico",
      "istanbul": "Turkey",
      "constantinople": "Turkey",
      "ankara": "Turkey",
      "antalya": "Turkey",
      "seoul": "South Korea",
      "busan": "South Korea",
      "singapore": "Singapore",
      "kuala lumpur": "Malaysia",
      "penang": "Malaysia",
      "manila": "Philippines",
      "san jose": "Costa Rica",
      "bogota": "Colombia",
      "medellin": "Colombia",
      "cartagena": "Colombia",
      "dubai": "United Arab Emirates",
      "abu dhabi": "United Arab Emirates",
      "sao paulo": "Brazil",
      "rio de janeiro": "Brazil",
      "taipei": "Taiwan",
      "budapest": "Hungary",
      "prague": "Czech Republic",

      // --- Popular Canadian Vacation Destinations ---
      "nassau": "Bahamas",
      "bridgetown": "Barbados",
      "port of spain": "Trinidad and Tobago",
      "kingston": "Jamaica",
      "montego bay": "Jamaica",
      "negril": "Jamaica",
      "ocho rios": "Jamaica",
      "santo domingo": "Dominican Republic",
      "punta cana": "Dominican Republic",
      "puerto plata": "Dominican Republic",
      "havana": "Cuba",
      "varadero": "Cuba",
      "cayo coco": "Cuba",
      "paris": "France",
      "nice": "France",
      "cannes": "France",
      "lyon": "France",
      "marseille": "France",
      "london": "United Kingdom",
      "edinburgh": "United Kingdom",
      "manchester": "United Kingdom",
      "dublin": "Ireland",
      "cork": "Ireland",
      "rome": "Italy",
      "florence": "Italy",
      "venice": "Italy",
      "milan": "Italy",
      "naples": "Italy",
      "palermo": "Italy",
      "barcelona": "Spain",
      "madrid": "Spain",
      "seville": "Spain",
      "valencia": "Spain",
      "bilbao": "Spain",
      "lisbon": "Portugal",
      "porto": "Portugal",
      "amsterdam": "Netherlands",
      "the hague": "Netherlands",
      "rotterdam": "Netherlands",
      "berlin": "Germany",
      "munich": "Germany",
      "hamburg": "Germany",
      "cologne": "Germany",
      "frankfurt": "Germany",
      "zurich": "Switzerland",
      "geneva": "Switzerland",
      "bern": "Switzerland",
      "vienna": "Austria",
      "salzburg": "Austria",
      "innsbruck": "Austria",
      "brussels": "Belgium",
      "antwerp": "Belgium",
      "bruges": "Belgium",
      "copenhagen": "Denmark",
      "stockholm": "Sweden",
      "gothenburg": "Sweden",
      "oslo": "Norway",
      "bergen": "Norway",
      "helsinki": "Finland",
      "reykjavik": "Iceland",

      // --- Major US Cities ---
      "new york": "United States",
      "nyc": "United States",
      "manhattan": "United States",
      "brooklyn": "United States",
      "queens": "United States",
      "bronx": "United States",
      "los angeles": "United States",
      "la": "United States",
      "hollywood": "United States",
      "beverly hills": "United States",
      "santa monica": "United States",
      "chicago": "United States",
      "houston": "United States",
      "phoenix": "United States",
      "philadelphia": "United States",
      "san antonio": "United States",
      "san diego": "United States",
      "dallas": "United States",
      "san jose": "United States",
      "austin": "United States",
      "jacksonville": "United States",
      "fort worth": "United States",
      "columbus": "United States",
      "charlotte": "United States",
      "san francisco": "United States",
      "sf": "United States",
      "indianapolis": "United States",
      "seattle": "United States",
      "denver": "United States",
      "washington": "United States",
      "dc": "United States",
      "boston": "United States",
      "el paso": "United States",
      "detroit": "United States",
      "nashville": "United States",
      "portland": "United States",
      "memphis": "United States",
      "oklahoma city": "United States",
      "las vegas": "United States",
      "vegas": "United States",
      "louisville": "United States",
      "baltimore": "United States",
      "milwaukee": "United States",
      "albuquerque": "United States",
      "tucson": "United States",
      "fresno": "United States",
      "sacramento": "United States",
      "kansas city": "United States",
      "mesa": "United States",
      "atlanta": "United States",
      "colorado springs": "United States",
      "raleigh": "United States",
      "omaha": "United States",
      "miami": "United States",
      "oakland": "United States",
      "minneapolis": "United States",
      "tulsa": "United States",
      "cleveland": "United States",
      "wichita": "United States",
      "arlington": "United States",
      "new orleans": "United States",
      "bakersfield": "United States",
      "tampa": "United States",
      "honolulu": "United States",
      "anaheim": "United States",
      "aurora": "United States",
      "santa ana": "United States",
      "st louis": "United States",
      "riverside": "United States",
      "corpus christi": "United States",
      "lexington": "United States",
      "pittsburgh": "United States",
      "anchorage": "United States",
      "stockton": "United States",
      "cincinnati": "United States",
      "saint paul": "United States",
      "toledo": "United States",
      "newark": "United States",
      "greensboro": "United States",
      "plano": "United States",
      "henderson": "United States",
      "lincoln": "United States",
      "buffalo": "United States",
      "jersey city": "United States",
      "chula vista": "United States",
      "fort wayne": "United States",
      "orlando": "United States",
      "st petersburg": "United States",
      "chandler": "United States",
      "laredo": "United States",
      "norfolk": "United States",
      "durham": "United States",
      "madison": "United States",
      "lubbock": "United States",
      "irvine": "United States",
      "winston salem": "United States",
      "glendale": "United States",
      "garland": "United States",
      "hialeah": "United States",
      "reno": "United States",
      "chesapeake": "United States",
      "gilbert": "United States",
      "baton rouge": "United States",
      "irving": "United States",
      "scottsdale": "United States",
      "north las vegas": "United States",
      "fremont": "United States",
      "boise": "United States",
      "richmond": "United States",
      "san bernardino": "United States",
      "birmingham": "United States",
      "spokane": "United States",
      "rochester": "United States",
      "des moines": "United States",
      "modesto": "United States",
      "fayetteville": "United States",
      "tacoma": "United States",
      "oxnard": "United States",
      "fontana": "United States",
      "columbus": "United States",
      "montgomery": "United States",
      "moreno valley": "United States",
      "shreveport": "United States",
      "aurora": "United States",
      "yonkers": "United States",
      "akron": "United States",
      "huntington beach": "United States",
      "little rock": "United States",
      "augusta": "United States",
      "amarillo": "United States",
      "glendale": "United States",
      "mobile": "United States",
      "grand rapids": "United States",
      "salt lake city": "United States",
      "tallahassee": "United States",
      "huntsville": "United States",
      "grand prairie": "United States",
      "knoxville": "United States",
      "worcester": "United States",
      "newport news": "United States",
      "brownsville": "United States",
      "overland park": "United States",
      "santa clarita": "United States",
      "providence": "United States",
      "garden grove": "United States",
      "chattanooga": "United States",
      "oceanside": "United States",
      "jackson": "United States",
      "fort lauderdale": "United States",
      "santa rosa": "United States",
      "rancho cucamonga": "United States",
      "port st lucie": "United States",
      "tempe": "United States",
      "ontario": "United States",
      "vancouver": "United States",
      "cape coral": "United States",
      "sioux falls": "United States",
      "springfield": "United States",
      "peoria": "United States",
      "pembroke pines": "United States",
      "elk grove": "United States",
      "salem": "United States",
      "lancaster": "United States",
      "corona": "United States",
      "eugene": "United States",
      "palmdale": "United States",
      "salinas": "United States",
      "springfield": "United States",
      "pasadena": "United States",
      "fort collins": "United States",
      "hayward": "United States",
      "pomona": "United States",
      "cary": "United States",
      "rockford": "United States",
      "alexandria": "United States",
      "escondido": "United States",
      "mckinney": "United States",
      "kansas city": "United States",
      "joliet": "United States",
      "sunnyvale": "United States",
      "torrance": "United States",
      "bridgeport": "United States",
      "lakewood": "United States",
      "hollywood": "United States",
      "paterson": "United States",
      "naperville": "United States",
      "syracuse": "United States",
      "mesquite": "United States",
      "dayton": "United States",
      "savannah": "United States",
      "clarksville": "United States",
      "orange": "United States",
      "pasadena": "United States",
      "fullerton": "United States",
      "killeen": "United States",
      "frisco": "United States",
      "hampton": "United States",
      "mcallen": "United States",
      "warren": "United States",
      "bellevue": "United States",
      "west valley city": "United States",
      "columbia": "United States",
      "olathe": "United States",
      "sterling heights": "United States",
      "new haven": "United States",
      "miramar": "United States",
      "waco": "United States",
      "thousand oaks": "United States",
      "cedar rapids": "United States",
      "charleston": "United States",
      "visalia": "United States",
      "topeka": "United States",
      "elizabeth": "United States",
      "gainesville": "United States",
      "thornton": "United States",
      "roseville": "United States",
      "carrollton": "United States",
      "coral springs": "United States",
      "stamford": "United States",
      "simi valley": "United States",
      "concord": "United States",
      "hartford": "United States",
      "kent": "United States",
      "lafayette": "United States",
      "midland": "United States",
      "surprise": "United States",
      "denton": "United States",
      "victorville": "United States",
      "evansville": "United States",
      "santa clara": "United States",
      "abilene": "United States",
      "athens": "United States",
      "vallejo": "United States",
      "allentown": "United States",
      "norman": "United States",
      "beaumont": "United States",
      "independence": "United States",
      "murfreesboro": "United States",
      "ann arbor": "United States",
      "springfield": "United States",
      "berkeley": "United States",
      "peoria": "United States",
      "provo": "United States",
      "el monte": "United States",
      "columbia": "United States",
      "lansing": "United States",
      "fargo": "United States",
      "downey": "United States",
      "costa mesa": "United States",
      "wilmington": "United States",
      "arvada": "United States",
      "inglewood": "United States",
      "miami gardens": "United States",
      "carlsbad": "United States",
      "westminster": "United States",
      "rochester": "United States",
      "pearland": "United States",
      "clearwater": "United States",
      "pueblo": "United States",
      "santa maria": "United States",
      "west jordan": "United States",
      "richardson": "United States",
      "norwalk": "United States",
      "centennial": "United States",
      "high point": "United States",
      "waterbury": "United States",
      "manchester": "United States",
      "albuquerque": "United States",
      "lowell": "United States",
      "cambridge": "United States",
      "elgin": "United States",
      "woodbridge": "United States",
      "odessa": "United States",
      "columbia": "United States",
      "burbank": "United States",
      "south bend": "United States",
      "amarillo": "United States",

      // --- Family Visit / Immigration Destinations ---
      "karachi": "Pakistan",
      "lahore": "Pakistan",
      "islamabad": "Pakistan",
      "rawalpindi": "Pakistan",
      "faisalabad": "Pakistan",
      "multan": "Pakistan",
      "peshawar": "Pakistan",
      "quetta": "Pakistan",
      "tehran": "Iran",
      "isfahan": "Iran",
      "mashhad": "Iran",
      "tabriz": "Iran",
      "shiraz": "Iran",
      "beirut": "Lebanon",
      "tripoli": "Lebanon",
      "sidon": "Lebanon",
      "damascus": "Syria",
      "aleppo": "Syria",
      "amman": "Jordan",
      "zarqa": "Jordan",
      "irbid": "Jordan",
      "baghdad": "Iraq",
      "basra": "Iraq",
      "mosul": "Iraq",
      "erbil": "Iraq",
      "lagos": "Nigeria",
      "kano": "Nigeria",
      "ibadan": "Nigeria",
      "abuja": "Nigeria",
      "port harcourt": "Nigeria",
      "benin city": "Nigeria",
      "maiduguri": "Nigeria",
      "zaria": "Nigeria",
      "aba": "Nigeria",
      "jos": "Nigeria",
      "ilorin": "Nigeria",
      "oyo": "Nigeria",
      "enugu": "Nigeria",
      "kaduna": "Nigeria",
      "nairobi": "Kenya",
      "mombasa": "Kenya",
      "nakuru": "Kenya",
      "eldoret": "Kenya",
      "kisumu": "Kenya",
      "thika": "Kenya",
      "malindi": "Kenya",
      "garissa": "Kenya",
      "kitale": "Kenya",
      "machakos": "Kenya",
      "meru": "Kenya",
      "cairo": "Egypt",
      "alexandria": "Egypt",
      "giza": "Egypt",
      "shubra el kheima": "Egypt",
      "port said": "Egypt",
      "suez": "Egypt",
      "luxor": "Egypt",
      "mansoura": "Egypt",
      "el mahalla el kubra": "Egypt",
      "tanta": "Egypt",
      "aswan": "Egypt",
      "ismailia": "Egypt",
      "fayyum": "Egypt",
      "zagazig": "Egypt",
      "assiut": "Egypt",
      "damietta": "Egypt",
      "damanhur": "Egypt",
      "minya": "Egypt",
      "beni suef": "Egypt",
      "hurghada": "Egypt",
      "qena": "Egypt",
      "sohag": "Egypt",
      "shibin el kom": "Egypt",
      "banha": "Egypt",
      "arish": "Egypt",
      "mallawi": "Egypt",
      "bilbays": "Egypt",
      "marsa matruh": "Egypt",
      "idfu": "Egypt",
      "mit ghamr": "Egypt",
      "al hawamidiyah": "Egypt",
      "desouk": "Egypt",
      "qalyub": "Egypt",
      "abu kabir": "Egypt",
      "kafr el sheikh": "Egypt",
      "dikirnis": "Egypt",
      "ras gharib": "Egypt",
      "casablanca": "Morocco",
      "rabat": "Morocco",
      "fez": "Morocco",
      "marrakech": "Morocco",
      "agadir": "Morocco",
      "tangier": "Morocco",
      "meknes": "Morocco",
      "oujda": "Morocco",
      "kenitra": "Morocco",
      "tetouan": "Morocco",
      "safi": "Morocco",
      "mohammedia": "Morocco",
      "khouribga": "Morocco",
      "el jadida": "Morocco",
      "beni mellal": "Morocco",
      "nador": "Morocco",
      "taza": "Morocco",
      "settat": "Morocco",
      "berrechid": "Morocco",
      "khemisset": "Morocco",
      "inezgane": "Morocco",
      "ksar el kebir": "Morocco",
      "larache": "Morocco",
      "guelmim": "Morocco",
      "errachidia": "Morocco",
      "ouarzazate": "Morocco",
      "tiznit": "Morocco",
      "taroudannt": "Morocco",
      "sidi kacem": "Morocco",
      "youssoufia": "Morocco",
      "tan-tan": "Morocco",
      "al hoceima": "Morocco",
      "sidi slimane": "Morocco",
      "midelt": "Morocco",
      "azrou": "Morocco",
      "fquih ben salah": "Morocco",
      "kalaat magouna": "Morocco",
      "chefchaouen": "Morocco",
      "essaouira": "Morocco",
      "dakhla": "Morocco",
      "laayoune": "Morocco",
      "ouezzane": "Morocco",

      // --- Business/Conference Cities ---
      "tokyo": "Japan",
      "osaka": "Japan",
      "kyoto": "Japan",
      "yokohama": "Japan",
      "kobe": "Japan",
      "sapporo": "Japan",
      "fukuoka": "Japan",
      "kawasaki": "Japan",
      "saitama": "Japan",
      "hiroshima": "Japan",
      "sendai": "Japan",
      "kitakyushu": "Japan",
      "chiba": "Japan",
      "beijing": "China",
      "shanghai": "China",
      "guangzhou": "China",
      "shenzhen": "China",
      "tianjin": "China",
      "wuhan": "China",
      "dongguan": "China",
      "chengdu": "China",
      "nanjing": "China",
      "chongqing": "China",
      "xi'an": "China",
      "shenyang": "China",
      "hangzhou": "China",
      "hong kong": "Hong Kong",
      "kowloon": "Hong Kong",
      "sha tin": "Hong Kong",
      "sydney": "Australia",
      "melbourne": "Australia",
      "brisbane": "Australia",
      "perth": "Australia",
      "adelaide": "Australia",
      "gold coast": "Australia",
      "canberra": "Australia",
      "newcastle": "Australia",
      "wollongong": "Australia",
      "geelong": "Australia",
      "hobart": "Australia",
      "townsville": "Australia",
      "cairns": "Australia",
      "darwin": "Australia",
      "toowoomba": "Australia",
      "ballarat": "Australia",
      "bendigo": "Australia",
      "albury": "Australia",
      "launceston": "Australia",
      "mackay": "Australia",
      "rockhampton": "Australia",
      "bunbury": "Australia",
      "coffs harbour": "Australia",
      "bundaberg": "Australia",
      "wagga wagga": "Australia",
      "hervey bay": "Australia",
      "mildura": "Australia",
      "shepparton": "Australia",
      "gladstone": "Australia",
      "tamworth": "Australia",
      "orange": "Australia",
      "dubbo": "Australia",
      "geraldton": "Australia",
      "port macquarie": "Australia",
      "caloundra": "Australia",
      "warrnambool": "Australia",
      "kalgoorlie": "Australia",
      "devonport": "Australia",
      "mount gambier": "Australia",
      "lismore": "Australia",
      "nelson bay": "Australia",
      "auckland": "New Zealand",
      "wellington": "New Zealand",
      "christchurch": "New Zealand",
      "hamilton": "New Zealand",
      "tauranga": "New Zealand",
      "dunedin": "New Zealand",
      "palmerston north": "New Zealand",
      "hastings": "New Zealand",
      "napier": "New Zealand",
      "rotorua": "New Zealand",
      "new plymouth": "New Zealand",
      "whangarei": "New Zealand",
      "invercargill": "New Zealand",
      "nelson": "New Zealand",
      "queenstown": "New Zealand",

      // --- Canadian cities (for reference) ---
      "toronto": "Canada",
      "montreal": "Canada",
      "vancouver": "Canada",
      "calgary": "Canada",
      "edmonton": "Canada",
      "ottawa": "Canada",
      "winnipeg": "Canada",
      "quebec city": "Canada",
      "hamilton": "Canada",
      "kitchener": "Canada",
      "london": "Canada",
      "victoria": "Canada",
      "halifax": "Canada",
      "oshawa": "Canada",
      "windsor": "Canada",
      "saskatoon": "Canada",
      "regina": "Canada",
      "sherbrooke": "Canada",
      "barrie": "Canada",
      "kelowna": "Canada",
      "abbotsford": "Canada",
      "kingston": "Canada",
      "sudbury": "Canada",
      "trois-rivieres": "Canada",
      "guelph": "Canada",
      "cambridge": "Canada",
      "whitby": "Canada",
      "brantford": "Canada",
      "thunder bay": "Canada",
      "saint john": "Canada",
      "moncton": "Canada",
      "st john's": "Canada"
    };
    
    this.init();
  }

  loadGoogleFonts() {
    console.log('TravelGuard: Loading Google Fonts Montserrat...');
    
    // Check if already loaded
    if (document.querySelector('link[href*="fonts.googleapis.com"][href*="Montserrat"]')) {
      console.log('TravelGuard: Google Fonts already loaded');
      return;
    }

    // Create preconnect links for faster loading
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(preconnect1);

    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect2);

    // Load Google Fonts Montserrat
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap';
    fontLink.onload = () => {
      console.log('TravelGuard: Google Fonts Montserrat loaded successfully');
      // Force font refresh on sidebar if it exists
      if (this.sidebarElement) {
        this.sidebarElement.style.fontFamily = '"Montserrat", sans-serif';
      }
    };
    fontLink.onerror = () => {
      console.log('TravelGuard: Failed to load Google Fonts, using fallback');
    };
    document.head.appendChild(fontLink);
  }

  async init() {
    console.log('TravelGuard: Sidebar initialized');
    
    // Initialize data loading
    await this.initializeData();
    
    // Load Google Fonts Montserrat properly
    this.loadGoogleFonts();
    
    // Create sidebar with slight delay to ensure font loads
    setTimeout(() => {
    this.createSidebar();
    }, 100);
    
    // Test function - make sidebar visible globally for debugging
    window.showTravelGuardSidebar = () => {
      console.log('🧪 Manual sidebar test triggered');
      this.openSidebar();
    };
    
    console.log('✅ Sidebar created, test with: window.showTravelGuardSidebar()');
  }

  async loadLastUpdateInfo() {
    try {
      // Try to load last update information
      const response = await fetch(chrome.runtime.getURL('data/last-update.json'));
      if (response.ok) {
        this.lastUpdateInfo = await response.json();
        console.log('🕰️ Loaded last update info:', this.lastUpdateInfo.timestamp);
      }
    } catch (error) {
      console.warn('⚠️ Could not load last update info:', error);
      // Fallback to current date if we can't load the file
      this.lastUpdateInfo = { timestamp: new Date().toISOString() };
    }
  }

  formatLastUpdateDate() {
    if (!this.lastUpdateInfo || !this.lastUpdateInfo.timestamp) {
      return 'Recently';
    }
    
    try {
      const date = new Date(this.lastUpdateInfo.timestamp);
      const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.warn('⚠️ Error formatting date:', error);
      return 'Recently';
    }
  }

  async initializeData() {
    try {
      console.log('📊 Sidebar: Initializing data...');
      
      // Load last update information
      await this.loadLastUpdateInfo();
      
      // Strategy 1: Try data loader if available
      if (window.vaccineDataLoader) {
        this.dataLoader = window.vaccineDataLoader;
        console.log('📊 Sidebar: Using data loader');
        
        try {
          this.availableCountries = await this.dataLoader.getAllCountries();
          console.log(`📋 Sidebar: Loaded ${this.availableCountries.length} countries from data loader`);
          return;
        } catch (dataError) {
          console.warn('⚠️ Data loader failed:', dataError);
        }
      }
      
      // Strategy 2: Try background script
      try {
        console.log('📡 Sidebar: Trying background script...');
        const response = await chrome.runtime.sendMessage({
          action: 'getVaccineData',
          countries: [] // Get all available
        });
        
        if (response && response.success && response.data) {
          this.availableCountries = Object.keys(response.data).sort();
          console.log(`📋 Sidebar: Loaded ${this.availableCountries.length} countries from background`);
          return;
        }
      } catch (bgError) {
        console.warn('⚠️ Background script failed:', bgError);
      }
      
      // Strategy 3: Fallback list
      console.log('📋 Sidebar: Using fallback country list');
      this.availableCountries = [
        'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 
        'Bahrain', 'Bangladesh', 'Belgium', 'Bolivia', 'Brazil', 'Bulgaria',
        'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Czech Republic',
        'Denmark', 'Ecuador', 'Egypt', 'Estonia', 'Ethiopia',
        'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
        'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
        'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
        'Latvia', 'Lebanon', 'Lithuania', 'Luxembourg',
        'Malaysia', 'Mexico', 'Morocco', 'Netherlands', 'New Zealand', 'Norway',
        'Pakistan', 'Peru', 'Philippines', 'Poland', 'Portugal',
        'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland',
        'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States',
        'Venezuela', 'Vietnam'
      ].sort();
      
      console.log(`✅ Sidebar: Ready with ${this.availableCountries.length} countries`);
      
    } catch (error) {
      console.error('❌ Sidebar: Error initializing data:', error);
      // Minimal fallback
      this.availableCountries = ['Argentina', 'Brazil', 'Japan', 'Morocco'];
    }
  }

  createSidebar() {
    console.log('🔧 Creating sidebar element...');
    
    // Create sidebar container
    this.sidebarElement = document.createElement('div');
    this.sidebarElement.id = 'travelhealth-sidebar';
    this.sidebarElement.className = 'th-sidebar hidden';
    
    // Professional medical sidebar with country selection
    this.sidebarElement.innerHTML = `
      <!-- Main Sidebar -->
      <div class="th-sidebar-main">
        <!-- Header -->
        <div class="th-header">
          <div class="th-header-content">
            <div class="th-logo">
          <span class="th-logo-icon">✚</span>
              <span class="th-logo-text">TravelGuard</span>
        </div>
        <div class="th-header-controls">
              <button class="th-control-btn th-settings-btn" id="th-settings-btn" title="Settings">⚙</button>
              <button class="th-control-btn th-refresh-btn" id="th-refresh-btn" title="Refresh Extension">↻</button>
              <button class="th-control-btn th-minimize-btn" id="th-minimize-btn" title="Minimize">−</button>
              <button class="th-control-btn th-close-btn" id="th-close-btn" title="Close">×</button>
      </div>
        </div>
      </div>
      
        <!-- Settings Overlay -->
        <div class="th-settings-overlay hidden" id="th-settings-overlay">
          <div class="th-settings-modal">
            <div class="th-settings-header">
              <div class="th-settings-title">
                <h3>TravelGuard Settings</h3>
                <p>Configure AI-powered features and preferences</p>
              </div>
              <button class="th-settings-close" id="th-settings-close" title="Close Settings">×</button>
            </div>
            <div class="th-settings-content">
              <div class="th-settings-section">
                <h4>AI-Powered Health Summaries</h4>
                <p class="th-settings-desc">Generate consolidated health summaries when multiple countries are selected</p>
                
                <div class="th-setting-item">
                  <div class="th-setting-info">
                    <span class="th-setting-label">Enable AI Summaries</span>
                    <span class="th-setting-note">Requires Chrome with built-in AI features</span>
                  </div>
                  <label class="th-toggle-switch">
                    <input type="checkbox" id="th-ai-toggle">
                    <span class="th-toggle-slider"></span>
                  </label>
                </div>

                <div class="th-ai-status" id="th-ai-status">
                  <!-- AI status messages will appear here -->
                </div>

                <div class="th-ai-test-section" id="th-ai-test-section">
                  <button class="th-test-ai-btn" id="th-test-ai-btn">🧪 Test AI Connection</button>
                </div>
              </div>

              <div class="th-settings-section">
                <h4>System Requirements</h4>
                <div class="th-requirements-list">
                  <div class="th-requirement-item">
                    <span class="th-req-icon">💻</span>
                    <span class="th-req-text">Chrome 128+ with AI features enabled</span>
                    <span class="th-req-status" id="th-req-chrome">Checking...</span>
                  </div>
                  <div class="th-requirement-item">
                    <span class="th-req-icon">🧠</span>
                    <span class="th-req-text">AI model availability</span>
                    <span class="th-req-status" id="th-req-model">Checking...</span>
                  </div>
                  <div class="th-requirement-item">
                    <span class="th-req-icon">💾</span>
                    <span class="th-req-text">Sufficient storage (22GB+)</span>
                    <span class="th-req-status" id="th-req-storage">Unknown</span>
                  </div>
                </div>
              </div>

              <div class="th-settings-section" id="th-help-section">
                <h4>Need Help Enabling AI Features?</h4>
                <div class="th-help-content">
                  <p><strong>If AI features aren't working:</strong></p>
                  <ol class="th-help-steps">
                    <li>Use <strong>Chrome Dev/Canary</strong> or Chrome 128+</li>
                    <li>Go to <code>chrome://flags/</code></li>
                    <li>Search for "Prompt API for Gemini Nano"</li>
                    <li>Set it to <strong>Enabled</strong></li>
                    <li>Search for "Optimization Guide On Device Model"</li>
                    <li>Set it to <strong>Enabled BypassPerfRequirement</strong></li>
                    <li><strong>Restart Chrome</strong></li>
                    <li>Come back and try enabling AI summaries</li>
                  </ol>
                  <p class="th-help-note">💡 The AI model will download automatically (about 22GB) when you first enable the feature.</p>
                  <p class="th-help-note">🔧 <strong>For Developers:</strong> No signup required for local testing! Origin trial registration only needed when publishing to Chrome Web Store.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        <!-- Instructions -->
        <div class="th-instructions">
          <p>Search for countries to view vaccination recommendations</p>
        </div>
        
        <!-- Country Selection -->
        <div class="th-country-selection" id="th-country-selection">
          <div class="th-search-container">
                        <div class="th-search-input-wrapper">
              <span class="th-search-icon">⌕</span>
              <input type="text" id="th-country-input" placeholder="Search countries..." autocomplete="off">
          </div>
            <div class="th-dropdown" id="th-dropdown">
              <div class="th-dropdown-content" id="th-dropdown-content">
                <!-- Dropdown options will be populated here -->
            </div>
          </div>
        </div>
        
          <!-- Selected Countries -->
          <div class="th-selected-countries" id="th-selected-countries">
            <!-- Selected countries will appear here -->
          </div>
            </div>

        <!-- Results Display -->
        <div class="th-results" id="th-results">
          <div class="th-empty-results">
            <div class="th-empty-icon">⊕</div>
            <p>Select a destination to view vaccination recommendations</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="th-footer" id="th-footer">
          <span class="th-footer-text">Information from <a href="https://travelhealthpro.org.uk/" target="_blank" rel="noopener">TravelHealthPro</a></span>
          <div class="th-footer-update">Last updated: ${this.formatLastUpdateDate()}</div>
        </div>
      </div>
      
      <!-- Minimized Floating Icon -->
      <div class="th-floating-icon" id="th-floating-icon">
        <button class="th-expand-btn" id="th-expand-btn" title="Open TravelGuard">
          <span class="th-logo-icon">✚</span>
        </button>
      </div>
    `;
    
    // Add to page
    document.body.appendChild(this.sidebarElement);
    console.log('✅ Sidebar element added to DOM');
    console.log('🔍 Sidebar element:', this.sidebarElement);
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Listen for country detection messages
    this.setupCountryDetectionListener();
  }

  setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Close button
    const closeBtn = this.sidebarElement.querySelector('#th-close-btn');
    closeBtn?.addEventListener('click', () => {
      console.log('TravelGuard: Close button clicked');
      this.hideSidebar();
    });

    // Refresh button
    const refreshBtn = this.sidebarElement.querySelector('#th-refresh-btn');
    refreshBtn?.addEventListener('click', () => {
      console.log('TravelGuard: Refresh button clicked');
      this.refreshExtension();
    });

    // Minimize button  
    const minimizeBtn = this.sidebarElement.querySelector('#th-minimize-btn');
    minimizeBtn?.addEventListener('click', () => {
      console.log('TravelGuard: Minimize button clicked');
      this.minimizeSidebar();
    });

    // Expand button
    const expandBtn = this.sidebarElement.querySelector('#th-expand-btn');
    expandBtn?.addEventListener('click', () => {
      console.log('📈 Expand button clicked');
      this.expandSidebar();
    });

    // Settings button
    const settingsBtn = this.sidebarElement.querySelector('#th-settings-btn');
    settingsBtn?.addEventListener('click', () => {
      console.log('⚙️ Settings button clicked');
      this.toggleSettingsPanel();
    });

    // Settings close button
    const settingsClose = this.sidebarElement.querySelector('#th-settings-close');
    settingsClose?.addEventListener('click', () => {
      console.log('❌ Settings close clicked');
      this.toggleSettingsPanel();
    });

    // AI toggle
    const aiToggle = this.sidebarElement.querySelector('#th-ai-toggle');
    aiToggle?.addEventListener('change', (e) => {
      console.log('🤖 AI toggle changed:', e.target.checked);
      this.handleAiToggle(e.target.checked);
    });

    // Test AI button
    const testAiBtn = this.sidebarElement.querySelector('#th-test-ai-btn');
    testAiBtn?.addEventListener('click', () => {
      console.log('🧪 Test AI button clicked');
      this.testAiConnection();
    });

    // Country search input
    const countryInput = this.sidebarElement.querySelector('#th-country-input');
    countryInput?.addEventListener('input', (e) => {
      this.handleCountrySearch(e.target.value);
    });

    countryInput?.addEventListener('focus', () => {
      this.showDropdown();
    });



    // Click outside to close dropdown
    document.addEventListener('click', (event) => {
      const dropdown = this.sidebarElement.querySelector('#th-dropdown');
      const searchContainer = this.sidebarElement.querySelector('.th-search-container');
      
      if (dropdown && !searchContainer?.contains(event.target)) {
        this.hideDropdown();
      }
      
      // Hide sidebar if clicking outside
      if (this.isVisible && !this.sidebarElement.contains(event.target)) {
        if (!event.target.closest('form, input, textarea, select')) {
          this.minimizeSidebar();
        }
      }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (this.isDropdownVisible()) {
          this.hideDropdown();
        } else if (this.isVisible && !this.isMinimized) {
          this.minimizeSidebar();
        }
      }
    });

    console.log('✅ Event listeners setup complete');
  }

  setupCountryDetectionListener() {
    // Listen for messages from country detector (DISABLED - auto-detection is off)
    window.addEventListener('message', async (event) => {
      if (event.source !== window) return;
      
      if (event.data.type === 'MEDME_COUNTRIES_DETECTED') {
        console.log('📡 Sidebar: Received countries from detector (DISABLED):', event.data.countries);
        // AUTO-DETECTION DISABLED - No automatic country selection
      }
    });
    
    console.log('📡 Country detection listener setup (auto-detection disabled)');
  }

  async updateResults() {
    const resultsContainer = this.sidebarElement.querySelector('#th-results');
    if (!resultsContainer) return;
    
    if (this.selectedCountries.length === 0) {
      resultsContainer.innerHTML = `
        <div class="th-empty-results">
          <div class="th-empty-icon">⊕</div>
          <p>Select a destination to view vaccination recommendations</p>
        </div>
      `;
      return;
    }
    
    // Show loading state
    resultsContainer.innerHTML = `
      <div class="th-loading">
        <div class="th-loading-icon">⟳</div>
        <p>Loading vaccination data...</p>
      </div>
    `;
    
    // Load vaccine data for selected countries
    await this.loadVaccineData(this.selectedCountries);
    
    // Generate results for each country
    const resultsHTML = this.selectedCountries.map(country => 
      this.generateCountryResults(country)
      ).join('');
      
    resultsContainer.innerHTML = `
      <div class="th-results-content">
        ${resultsHTML}
      </div>
    `;
    
    // Add event listeners for expandable items and interactive elements after rendering
    this.setupExpandableListeners();
    this.setupSectionHeaders();
    this.setupCountryHeaders();
  }

  setupExpandableListeners() {
    const expandableItems = this.sidebarElement.querySelectorAll('.th-vaccine-item.th-expandable');
    
    expandableItems.forEach(item => {
      // Remove existing listeners to prevent duplicates
      const newHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const vaccineDesc = item.querySelector('.th-vaccine-desc');
        if (vaccineDesc && vaccineDesc.id) {
          console.log('🔍 Clicking on vaccine item with ID:', vaccineDesc.id);
          this.toggleDescription(vaccineDesc.id);
        }
      };
      
      // Remove any existing listener and add new one
      item.removeEventListener('click', newHandler);
      item.addEventListener('click', newHandler);
    });
    
    console.log(`✅ Added listeners to ${expandableItems.length} expandable items`);
  }

  async loadVaccineData(countries) {
    try {
      console.log('📊 Loading vaccine data for countries:', countries);
      
      if (this.dataLoader) {
        // Use data loader
        const vaccineData = await this.dataLoader.getVaccineData(countries);
        Object.assign(this.countryData, vaccineData);
      } else if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Use background script
        const response = await chrome.runtime.sendMessage({
          action: 'getVaccineData',
          countries: countries
        });
        
        if (response && response.success) {
          Object.assign(this.countryData, response.data);
        }
      }
      
      console.log('✅ Vaccine data loaded for countries:', Object.keys(this.countryData));
      
    } catch (error) {
      console.error('❌ Error loading vaccine data:', error);
    }
  }

  openSidebar() {
    console.log('🚀 Opening sidebar...');
    if (!this.sidebarElement) {
      console.error('❌ Sidebar element not found!');
      return;
    }
    
    // If minimized, expand it
    if (this.isMinimized) {
      console.log('📈 Sidebar is minimized, expanding...');
      this.expandSidebar();
        return;
    }
    
    // If hidden, show it
    this.sidebarElement.classList.remove('hidden');
    this.sidebarElement.classList.add('visible');
    this.isVisible = true;
    
    console.log('✅ Sidebar should now be visible');
    console.log('🔍 Sidebar classes:', this.sidebarElement.className);
  }

  hideSidebar() {
    console.log('🚪 Hiding sidebar...');
    if (!this.sidebarElement) return;
    
    this.sidebarElement.classList.remove('visible');
    this.sidebarElement.classList.add('hidden');
    this.isVisible = false;
    this.isMinimized = false;
    
    console.log('✅ Sidebar hidden');
  }

  minimizeSidebar() {
    console.log('📉 Minimizing sidebar...');
    if (!this.sidebarElement || !this.isVisible) return;

    // Hide the main sidebar and show just the floating icon
    this.sidebarElement.classList.add('th-minimized');
    this.isMinimized = true;

    console.log('✅ Sidebar minimized to floating icon');
  }

  expandSidebar() {
    console.log('📈 Expanding sidebar...');
    if (!this.sidebarElement || !this.isMinimized) return;

    // Restore the main sidebar
    this.sidebarElement.classList.remove('th-minimized');
    this.isMinimized = false;
    this.isVisible = true; // Ensure it's marked as visible

    console.log('✅ Sidebar expanded');
  }

  refreshExtension() {
    console.log('TravelGuard: Refreshing extension...');
    
    // Clear selected countries
    this.selectedCountries = [];
    
    // Reset search input
    const input = this.sidebarElement.querySelector('#th-country-input');
    if (input) input.value = '';
    
    // Update UI
    this.updateSelectedCountries();
    this.updateResults();
    this.hideDropdown();
    
    console.log('TravelGuard: Extension refreshed');
  }

  // City Search Methods
  searchCitiesForCountries(query) {
    const queryLower = query.toLowerCase().trim();
    const cityMatches = [];
    
    // Search through city mapping
    Object.entries(this.cityToCountryMapping).forEach(([city, country]) => {
      if (city.includes(queryLower) && queryLower.length >= 2) {
        // Check if this country is in our available countries
        if (this.availableCountries.includes(country)) {
          cityMatches.push({
            city: this.capitalizeCity(city),
            country: country,
            displayName: `${country} (${this.capitalizeCity(city)})`,
            type: 'city'
          });
        }
      }
    });
    
    // Remove duplicates by country (show only first matching city per country)
    const uniqueMatches = cityMatches.filter((match, index, self) => 
      index === self.findIndex(m => m.country === match.country)
    );
    
    return uniqueMatches;
  }

  // Helper method to capitalize city names properly
  capitalizeCity(cityName) {
    return cityName.split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Country Search and Selection Methods
  handleCountrySearch(query) {
    console.log('🔍 Searching countries and cities for:', query);
    
    if (!query.trim()) {
      this.showAllCountries();
      return;
    }
    
    const searchResults = [];
    
    // First: Direct country matches
    const countryMatches = this.availableCountries.filter(country =>
      country.toLowerCase().includes(query.toLowerCase())
    );
    
    countryMatches.forEach(country => {
      searchResults.push({
        displayName: country,
        country: country,
        type: 'country'
      });
    });
    
    // Second: City matches (if no direct country matches or very few)
    if (countryMatches.length <= 1) {
      const cityMatches = this.searchCitiesForCountries(query);
      searchResults.push(...cityMatches);
    }
    
    this.updateDropdown(searchResults);
    this.showDropdown();
  }

  showAllCountries() {
    // Format available countries as objects for consistency
    const countryObjects = this.availableCountries.map(country => ({
      displayName: country,
      country: country,
      type: 'country'
    }));
    this.updateDropdown(countryObjects);
  }

  updateDropdown(results) {
    const dropdownContent = this.sidebarElement.querySelector('#th-dropdown-content');
    if (!dropdownContent) return;

    if (results.length === 0) {
      dropdownContent.innerHTML = `
        <div class="th-dropdown-item th-no-results">
          <span class="th-item-text">No results found</span>
          </div>
        `;
        return;
      }
      
    dropdownContent.innerHTML = results.map(result => {
      // Handle both object format (country/city results) and legacy string format
      const displayName = result.displayName || result;
      const countryName = result.country || result;
      const resultType = result.type || 'country';
      
      return `
        <div class="th-dropdown-item" data-country="${countryName}">
          <span class="th-item-text">${displayName}</span>
          ${this.selectedCountries.includes(countryName) ? '<span class="th-item-check">✓</span>' : ''}
        </div>
      `;
    }).join('');

    // Add click handlers
    dropdownContent.querySelectorAll('.th-dropdown-item[data-country]').forEach(item => {
      item.addEventListener('click', (e) => {
        const country = e.currentTarget.dataset.country;
        this.selectCountry(country);
      });
    });
  }

  async selectCountry(country) {
    console.log('📍 Selecting country:', country);
    
    if (!this.selectedCountries.includes(country)) {
      this.selectedCountries.push(country);
      this.updateSelectedCountries();
      await this.updateResults();
    }

    // Clear search input
    const input = this.sidebarElement.querySelector('#th-country-input');
    if (input) input.value = '';
    
    this.hideDropdown();
  }

  async removeCountry(country) {
    console.log('📍 Removing country:', country);
    
    this.selectedCountries = this.selectedCountries.filter(c => c !== country);
    this.updateSelectedCountries();
    await this.updateResults();
  }

  /**
   * Search for multiple destinations from context menu
   */
  async searchMultipleDestinations(destinations) {
    console.log('🎯 Searching multiple destinations:', destinations);
    
    if (!destinations || !Array.isArray(destinations) || destinations.length === 0) {
      console.warn('⚠️ No destinations provided');
      return;
    }
    
    // Clear any existing selections first
    this.selectedCountries = [];
    this.updateSelectedCountries();
    
    // Load available countries if not already loaded
    if (!this.availableCountries || this.availableCountries.length === 0) {
      await this.loadAvailableCountries();
    }
    
    const foundCountries = [];
    const notFoundDestinations = [];
    
    for (const destination of destinations) {
      // Try exact match first
      const exactMatch = this.availableCountries.find(country => 
        country.toLowerCase() === destination.toLowerCase()
      );
      
      if (exactMatch) {
        foundCountries.push(exactMatch);
        console.log(`✅ Found exact match: "${destination}" -> "${exactMatch}"`);
      } else {
        // Try partial match
        const partialMatch = this.availableCountries.find(country => 
          country.toLowerCase().includes(destination.toLowerCase()) ||
          destination.toLowerCase().includes(country.toLowerCase())
        );
        
        if (partialMatch) {
          foundCountries.push(partialMatch);
          console.log(`✅ Found partial match: "${destination}" -> "${partialMatch}"`);
        } else {
          notFoundDestinations.push(destination);
          console.log(`❌ No match found for: "${destination}"`);
        }
      }
    }
    
    // Add all found countries
    for (const country of foundCountries) {
      if (!this.selectedCountries.includes(country)) {
        this.selectedCountries.push(country);
      }
    }
    
    // Update UI
    this.updateSelectedCountries();
    await this.updateResults();
    
    // Show status message
    const statusMessages = [];
    if (foundCountries.length > 0) {
      statusMessages.push(`Found vaccination info for: ${foundCountries.join(', ')}`);
    }
    if (notFoundDestinations.length > 0) {
      statusMessages.push(`Could not find: ${notFoundDestinations.join(', ')}`);
    }
    
    if (statusMessages.length > 0) {
      this.showStatusMessage(statusMessages.join('\n\n'), notFoundDestinations.length > 0 ? 'warning' : 'success');
    }
    
    console.log(`🎯 Search complete. Found: ${foundCountries.length}, Not found: ${notFoundDestinations.length}`);
  }
  
  /**
   * Show a status message to the user
   */
  showStatusMessage(message, type = 'info') {
    const existingMessage = this.sidebarElement.querySelector('.th-status-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `th-status-message th-status-${type}`;
    messageElement.style.cssText = `
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      line-height: 1.4;
      white-space: pre-line;
      background: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
      color: ${type === 'success' ? '#155724' : type === 'warning' ? '#856404' : '#0c5460'};
    `;
    messageElement.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      float: right;
      background: none;
      border: none;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      color: inherit;
      margin-left: 10px;
    `;
    closeButton.addEventListener('click', () => messageElement.remove());
    messageElement.appendChild(closeButton);
    
    // Insert after the header
    const header = this.sidebarElement.querySelector('.th-header');
    if (header && header.nextSibling) {
      header.parentNode.insertBefore(messageElement, header.nextSibling);
    }
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 8000);
  }

  updateSelectedCountries() {
    const container = this.sidebarElement.querySelector('#th-selected-countries');
    if (!container) return;

    // Only clear AI summary if countries actually changed (not just UI updates)
    const currentCountriesKey = this.selectedCountries.sort().join(',');
    if (this.lastCountriesKey !== currentCountriesKey) {
      this.clearAiSummary();
      this.lastCountriesKey = currentCountriesKey;
    }

    if (this.selectedCountries.length === 0) {
      container.innerHTML = '';
      // Also remove any AI summary button from results container
      this.removeAiSummaryButton();
      return;
    }

    // Smart AI button logic
    if (this.selectedCountries.length > 1) {
      // Multiple countries - check if AI is enabled and show button
      chrome.storage.local.get(['aiSummaryEnabled']).then(result => {
        const isAiEnabled = result.aiSummaryEnabled || false;
        if (isAiEnabled) {
          this.showAiButton();
        }
      });
    } else {
      // Only 1 country - remove AI button
      this.removeAiSummaryButton();
    }

    container.innerHTML = `
      <div class="th-selected-header">
        <span class="th-selected-title">Selected Destinations (${this.selectedCountries.length})</span>
      </div>
      <div class="th-selected-list">
        ${this.selectedCountries.map(country => `
          <div class="th-selected-item">
            <span class="th-selected-name">${country}</span>
            <button class="th-selected-remove" data-country="${country}" title="Remove ${country}">×</button>
          </div>
        `).join('')}
      </div>
    `;

    // Add remove handlers
    container.querySelectorAll('.th-selected-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        e.preventDefault();
        const country = e.target.dataset.country;
        this.removeCountry(country);
      });
    });

    // Expand all country cards when countries change
    this.expandAllCountryCards();
  }
  
  generateCountryResults(country) {
    console.log(`🏁 Generating results for country: ${country}`);
    console.log(`📊 Available country data keys:`, Object.keys(this.countryData));
    
    const countryData = this.countryData[country] || {};
    console.log(`📋 Country data for ${country}:`, countryData);
    
    // The data loader decompresses data into this structure
    const data = {
      mostTravellers: countryData.mostTravellers || [],
      someTravellers: countryData.someTravellers || [],
      otherRisks: countryData.otherRisks || [],
      malaria: countryData.malaria || null
    };
    
    // Debug: Log the actual data structure
    console.log('🐛 Sidebar data for', country, ':', data);
    console.log('🐛 Sample vaccine item:', data.mostTravellers[0]);

    // If no data available, show a message with link to TravelHealthPro
    if (data.mostTravellers.length === 0 && data.someTravellers.length === 0 && data.otherRisks.length === 0 && !data.malaria) {
      return `
        <div class="th-country-result">
          <div class="th-country-header">
            <h3 class="th-country-name">
              <a href="${getTravelHealthProUrl(getActualCountryName(country))}" target="_blank" rel="noopener" class="th-country-link">${country}</a>
            </h3>
                </div>
          <div class="th-no-data">
            <p>No vaccination data available for ${country}.</p>
            <p>For more information, visit <a href="https://travelhealthpro.org.uk/countries" target="_blank" rel="noopener">TravelHealthPro</a> or consult a travel health professional.</p>
              </div>
          </div>
        `;
      }
      
    return `
      <div class="th-country-result th-country-expandable th-country-expanded" data-country="${country}">
        <div class="th-country-header th-country-clickable">
          <h3 class="th-country-name">
            <a href="${getTravelHealthProUrl(getActualCountryName(country))}" target="_blank" rel="noopener" class="th-country-link">${country}</a>
          </h3>
          <span class="th-country-expand-indicator">▲</span>
        </div>
        <div class="th-country-content" style="display: block;">

          ${data.mostTravellers.length > 0 ? `
        <div class="th-vaccine-section th-section-expanded">
          <h4 class="th-section-title th-section-clickable">
            Most Travellers
            <span class="th-priority-badge th-standard">Standard</span>
            <span class="th-section-expand-indicator">▼</span>
          </h4>
          <div class="th-vaccine-list" style="display: block;">
            ${data.mostTravellers.map((vaccine, index) => {
              const description = vaccine.description || vaccine.d || vaccine.prevention || 'No additional information available.';
              
              // Clean description to remove duplicate vaccine names
              const cleanedDescription = cleanVaccineDescription(vaccine, description);
              
              // Check if we have enhanced data from new scraper
              const hasEnhancedData = vaccine.countrySpecific || vaccine.vaccination || 
                                    (vaccine.additionalSections && vaccine.additionalSections.length > 0);
              
              // Always make it expandable if description is long OR if we have enhanced data
              const isLong = cleanedDescription.length > 200 || hasEnhancedData;
              const truncated = isLong ? cleanedDescription.substring(0, 200) + '...' : cleanedDescription;
              const vaccineId = `most-${country.replace(/\s+/g, '-').toLowerCase()}-${index}`;
              

              
              return `
                <div class="th-vaccine-item ${isLong ? 'th-expandable' : ''}" data-expandable="${isLong}">
                  <div class="th-vaccine-header">
                    <span class="th-vaccine-name">${extractVaccineTitle(vaccine, description)}</span>

                    ${isLong ? '<span class="th-expand-indicator">⋯</span>' : ''}
                  </div>
                  <div class="th-vaccine-desc-container">
                    <div class="th-vaccine-desc ${isLong ? 'th-truncated' : ''}" id="${vaccineId}">
                      <div class="th-desc-text">${isLong ? truncated : cleanedDescription}</div>
                      <div class="th-desc-full" style="${isLong ? 'display: none;' : ''}">
                        

                        
                        <!-- Formatted Content Like Source Website -->
                        ${formatVaccineContent(vaccine, description)}

                        
                      </div>
                    </div>
                  </div>
          </div>
        `;
            }).join('')}
          </div>
        </div>
        ` : ''}

        ${data.someTravellers.length > 0 ? `
        <div class="th-vaccine-section th-section-expanded">
          <h4 class="th-section-title th-section-clickable">
            Some Travellers
            <span class="th-priority-badge th-risk">Risk-Based</span>
            <span class="th-section-expand-indicator">▼</span>
          </h4>
          <div class="th-vaccine-list" style="display: block;">
            ${data.someTravellers.map((vaccine, index) => {
              const description = vaccine.description || vaccine.d || vaccine.prevention || 'No additional information available.';
              
              // Clean description to remove duplicate vaccine names
              const cleanedDescription = cleanVaccineDescription(vaccine, description);
              
              // Check if we have enhanced data from new scraper
              const hasEnhancedData = vaccine.countrySpecific || vaccine.vaccination || 
                                    (vaccine.additionalSections && vaccine.additionalSections.length > 0);
              
              const isLong = cleanedDescription.length > 80 || hasEnhancedData;
              const truncated = isLong ? cleanedDescription.substring(0, 80) + '...' : cleanedDescription;
              const vaccineId = `some-${country.replace(/\s+/g, '-').toLowerCase()}-${index}`;
              
              console.log(`🔍 Some Travellers - Vaccine: ${vaccine.name || vaccine.n}, Description length: ${cleanedDescription.length}, Enhanced data: ${hasEnhancedData}`);
              
              return `
                <div class="th-vaccine-item th-risk-based ${isLong ? 'th-expandable' : ''}" data-expandable="${isLong}">
                  <div class="th-vaccine-header">
                    <span class="th-vaccine-name">${extractVaccineTitle(vaccine, description)}</span>

                    ${isLong ? '<span class="th-expand-indicator">⋯</span>' : ''}
                  </div>
                  <div class="th-vaccine-desc-container">
                    <div class="th-vaccine-desc ${isLong ? 'th-truncated' : ''}" id="${vaccineId}">
                      <div class="th-desc-text">${isLong ? truncated : cleanedDescription}</div>
                      <div class="th-desc-full" style="${isLong ? 'display: none;' : ''}">
                        

                        
                        <!-- Formatted Content Like Source Website -->
                        ${formatVaccineContent(vaccine, description)}

                        
                      </div>
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
        ` : ''}

        ${data.otherRisks.length > 0 ? `
        <div class="th-vaccine-section th-section-expanded">
          <h4 class="th-section-title th-section-clickable">
            Other Health Risks
            <span class="th-section-expand-indicator">▼</span>
          </h4>
          <div class="th-vaccine-list" style="display: block;">
            <div class="th-vaccine-item th-other-risks-item">
              <div class="th-vaccine-header">
                <span class="th-vaccine-name">Health Risk Information</span>
              </div>
              <div class="th-vaccine-desc-container">
                <div class="th-vaccine-desc">
                  <div class="th-desc-text">
                    <div class="th-risks-content">
                      ${data.otherRisks.map(risk => `
                        <div class="th-risk-item">
                          <span class="th-risk-bullet">•</span>
                          <span class="th-risk-text">${risk.name || 'Unknown risk'}</span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        ` : ''}



        ${data.malaria && (data.malaria.riskAreas || data.malaria.specialRiskGroups) ? `
        <div class="th-vaccine-section th-malaria-section th-section-expanded">
          <h4 class="th-section-title th-section-clickable">
            Malaria Information
            <span class="th-section-expand-indicator">▼</span>
          </h4>
          <div class="th-vaccine-list" style="display: block;">
            ${data.malaria.riskAreas ? `
              <div class="th-vaccine-item th-malaria-item">
                <div class="th-vaccine-header">
                  <span class="th-vaccine-name">Risk Areas</span>
                </div>
                <div class="th-vaccine-desc-container">
                  <div class="th-vaccine-desc">
                    <div class="th-desc-text">
                      <div class="th-malaria-content-text">${formatMalariaContent(data.malaria.riskAreas)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}
            
            ${data.malaria.specialRiskGroups ? `
              <div class="th-vaccine-item th-malaria-item">
                <div class="th-vaccine-header">
                  <span class="th-vaccine-name">Special Risk Groups</span>
                </div>
                <div class="th-vaccine-desc-container">
                  <div class="th-vaccine-desc">
                    <div class="th-desc-text">
                      <div class="th-malaria-content-text">${formatMalariaContent(data.malaria.specialRiskGroups)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
        ` : ''}
        </div>
        </div>
      `;
  }

  showDropdown() {
    const dropdown = this.sidebarElement.querySelector('#th-dropdown');
    if (dropdown) {
      dropdown.classList.add('th-visible');
    }
  }

  hideDropdown() {
    const dropdown = this.sidebarElement.querySelector('#th-dropdown');
    if (dropdown) {
      dropdown.classList.remove('th-visible');
    }
  }

  isDropdownVisible() {
    const dropdown = this.sidebarElement.querySelector('#th-dropdown');
    return dropdown?.classList.contains('th-visible') || false;
  }

  async scanPageForCountries() {
    console.log('📄 Scanning page for countries...');
    
    let foundCountries = [];
    
    if (this.dataLoader) {
      // Use the country detector if available
      if (window.countryDetector && window.countryDetector.extractCountriesFromText) {
        const pageText = document.body.innerText || document.body.textContent || '';
        foundCountries = window.countryDetector.extractCountriesFromText(pageText, true); // Limited mode for less false positives
    } else {
        // Simple fallback page scanning
        const pageText = document.body.innerText.toLowerCase();
        foundCountries = this.availableCountries.filter(country =>
          pageText.includes(country.toLowerCase())
        );
      }
    } else {
      // Basic scanning without data loader
      const pageText = document.body.innerText.toLowerCase();
      foundCountries = this.availableCountries.filter(country =>
        pageText.includes(country.toLowerCase())
      );
    }

    if (foundCountries.length > 0) {
      console.log('🔍 Found countries:', foundCountries);
      foundCountries.forEach(country => {
        if (!this.selectedCountries.includes(country)) {
          this.selectedCountries.push(country);
        }
      });
      this.updateSelectedCountries();
      await this.updateResults();
    } else {
      console.log('📄 No countries detected on page');
    }
  }

  toggleDescription(descriptionId) {
    const container = document.getElementById(descriptionId);
    if (!container) {
      console.warn('Container not found:', descriptionId);
      return;
    }
    
    const descText = container.querySelector('.th-desc-text');
    const descFull = container.querySelector('.th-desc-full');
    const vaccineItem = container.closest('.th-vaccine-item');
    const expandIndicator = vaccineItem?.querySelector('.th-expand-indicator');
    
    if (!descText || !descFull) {
      console.warn('Description elements not found');
      return;
    }
    
    const isExpanded = vaccineItem?.classList.contains('th-expanded') || false;
    
    if (isExpanded) {
      // Collapse
      descText.style.display = 'block';
      descFull.style.display = 'none';
      vaccineItem?.classList.remove('th-expanded');
      if (expandIndicator) expandIndicator.textContent = '⋯';
      console.log('📁 Collapsed vaccine item:', vaccineItem?.querySelector('.th-vaccine-name')?.textContent);
    } else {
      // Expand
      descText.style.display = 'none';
      descFull.style.display = 'block';
      vaccineItem?.classList.add('th-expanded');
      if (expandIndicator) expandIndicator.textContent = '⌄';
      console.log('🔍 Expanded vaccine item:', vaccineItem?.querySelector('.th-vaccine-name')?.textContent);
    }
  }

  setupSectionHeaders() {
    const sectionHeaders = this.sidebarElement.querySelectorAll('.th-section-clickable');
    
    sectionHeaders.forEach(header => {
      const newHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const section = header.closest('.th-vaccine-section, .th-malaria-section');
        const content = section.querySelector('.th-vaccine-list, .th-malaria-content');
        const expandIndicator = header.querySelector('.th-section-expand-indicator');
        
        if (content && expandIndicator) {
          const isExpanded = section.classList.contains('th-section-expanded');
          
          if (isExpanded) {
            // Collapse
            section.classList.remove('th-section-expanded');
      content.style.display = 'none';
            expandIndicator.textContent = '▶';
            console.log('📁 Collapsed section:', header.textContent.trim());
    } else {
            // Expand
            section.classList.add('th-section-expanded');
            content.style.display = 'block';
            expandIndicator.textContent = '▼';
            console.log('🔍 Expanded section:', header.textContent.trim());
          }
        }
      };
      
      header.removeEventListener('click', newHandler);
      header.addEventListener('click', newHandler);
    });
    
    console.log(`✅ Added section collapse listeners to ${sectionHeaders.length} section headers`);
  }

  setupCountryHeaders() {
    const countryHeaders = this.sidebarElement.querySelectorAll('.th-country-clickable');
    
    countryHeaders.forEach(header => {
      const newHandler = (e) => {
        // Don't prevent default if clicking on country link
        if (e.target.classList.contains('th-country-link')) {
          console.log('🔗 Opening country link:', e.target.href);
          return; // Let the link work normally
        }
        
        e.preventDefault();
        e.stopPropagation();
        
        const countryResult = header.closest('.th-country-expandable');
        const countryContent = countryResult.querySelector('.th-country-content');
        const expandIndicator = header.querySelector('.th-country-expand-indicator');
        
        if (countryContent && expandIndicator) {
          const isExpanded = countryResult.classList.contains('th-country-expanded');
          
          if (isExpanded) {
            // Collapse
            countryResult.classList.remove('th-country-expanded');
            countryContent.style.display = 'none';
            expandIndicator.textContent = '▼';
            console.log('📁 Collapsed country:', header.querySelector('.th-country-link')?.textContent || header.querySelector('.th-country-name')?.textContent);
      } else {
            // Expand
            countryResult.classList.add('th-country-expanded');
            countryContent.style.display = 'block';
            expandIndicator.textContent = '▲';
            console.log('🔍 Expanded country:', header.querySelector('.th-country-link')?.textContent || header.querySelector('.th-country-name')?.textContent);
          }
        }
      };
      
      header.removeEventListener('click', newHandler);
      header.addEventListener('click', newHandler);
    });
    
    console.log(`✅ Added country collapse listeners to ${countryHeaders.length} country headers`);
  }

  // Helper function to remove any existing AI summary button
  removeAiSummaryButton() {
    const existingButton = this.sidebarElement?.querySelector('.th-ai-summary-controls');
    if (existingButton) {
      existingButton.remove();
    }
  }

  // Settings Overlay Management
  toggleSettingsPanel() {
    const settingsOverlay = this.sidebarElement.querySelector('#th-settings-overlay');
    if (!settingsOverlay) return;

    const isHidden = settingsOverlay.classList.contains('hidden');
    
    if (isHidden) {
      settingsOverlay.classList.remove('hidden');
      // Load current AI settings when opening
      this.loadAiSettings();
      // Check system requirements
      this.checkSystemRequirements();
    } else {
      settingsOverlay.classList.add('hidden');
    }
  }

  async loadAiSettings() {
    try {
      const { aiSummaryEnabled } = await chrome.storage.local.get(['aiSummaryEnabled']);
      const aiToggle = this.sidebarElement.querySelector('#th-ai-toggle');
      
      if (aiToggle) {
        aiToggle.checked = aiSummaryEnabled || false;
      }

      // Check AI model status
      await this.checkAiModelStatus();
      
    } catch (error) {
      console.error('Error loading AI settings:', error);
      this.showAiStatus('error', 'Failed to load AI settings');
    }
  }

  async handleAiToggle(isEnabled) {
    const aiToggle = this.sidebarElement.querySelector('#th-ai-toggle');
    
    try {
      if (isEnabled) {
        // Disable toggle during setup
        if (aiToggle) aiToggle.disabled = true;
        
        this.showAiStatus('info', 'Enabling AI summaries...');

        // Check AI availability
        const aiCheck = await this.checkAiAvailability();
        
        if (!aiCheck.supported) {
          throw new Error(aiCheck.error || 'AI features not supported on this device');
        }

        if (aiCheck.needsDownload && !aiCheck.downloading) {
          this.showAiStatus('info', 'Downloading AI model... This may take several minutes.');
          
          try {
            // Get the AI API reference
            const aiAPI = await this.getAiAPI();
            if (!aiAPI) {
              throw new Error('AI API not available');
            }
            
            // Capture 'this' context for the callback
            const self = this;
            
            // Trigger download by creating session with progress monitoring using CORRECT API
            console.log('📥 Using CORRECT API: LanguageModel.create()...');
            
            const session = await aiAPI.create({
              temperature: 0.1, // Very low temperature to prevent hallucinations
              topK: 3, // Low topK for more deterministic output
              language: 'en', // Specify English language
              monitor(m) {
                console.log('📥 Setting up download monitor...');
                m.addEventListener('downloadprogress', (e) => {
                  console.log('📥 Download progress:', e.loaded, '/', e.total);
                  const percent = Math.round((e.loaded / e.total) * 100);
                  self.showAiStatus('info', `Downloading AI model... ${percent}%`, percent);
                });
              }
            });
            
            console.log('✅ AI session created successfully');
            
            // Test the session works
            await session.prompt('Test prompt');
            session.destroy();
            
            this.showAiStatus('success', 'AI model downloaded and ready!');
          } catch (downloadError) {
            console.error('Download error details:', downloadError);
            throw new Error(`Failed to download AI model: ${downloadError.message}`);
          }
        } else if (aiCheck.downloading) {
          this.showAiStatus('info', 'AI model download in progress... Please wait.');
          // Save enabled state anyway - the download is happening
          await chrome.storage.local.set({ aiSummaryEnabled: true });
        } else {
          this.showAiStatus('success', 'AI summaries enabled!');
        }

        // Save enabled state
        await chrome.storage.local.set({ aiSummaryEnabled: true });
        
      } else {
        // Save disabled state
        await chrome.storage.local.set({ aiSummaryEnabled: false });
        this.showAiStatus('info', 'AI summaries disabled');
      }
      
    } catch (error) {
      console.error('AI toggle error:', error);
      this.showAiStatus('error', error.message || 'Failed to enable AI summaries');
      
      // Revert toggle state
      if (aiToggle) {
        aiToggle.checked = false;
        await chrome.storage.local.set({ aiSummaryEnabled: false });
      }
    } finally {
      // Re-enable toggle
      if (aiToggle) aiToggle.disabled = false;
    }
  }

  async getAiAPI() {
    // Search for the CORRECT Chrome Prompt API - LanguageModel
    console.log('🔍 Searching for Chrome Prompt API...');
    console.log('🔍 Current URL:', window.location.href);
    console.log('🔍 Is HTTPS:', window.location.protocol === 'https:');
    console.log('🔍 Is secure context:', window.isSecureContext);
    console.log('🔍 User agent:', navigator.userAgent);
    
    // Check for CORRECT API: LanguageModel (from Chrome docs)
    console.log('🔍 LanguageModel exists:', typeof LanguageModel !== 'undefined');
    console.log('🔍 window.LanguageModel exists:', typeof window.LanguageModel !== 'undefined');
    console.log('🔍 globalThis.LanguageModel exists:', typeof globalThis.LanguageModel !== 'undefined');
    
    // Method 1: Direct LanguageModel access
    if (typeof LanguageModel !== 'undefined') {
      console.log('✅ Found LanguageModel (CORRECT API)');
      console.log('🔍 LanguageModel methods:', Object.getOwnPropertyNames(LanguageModel));
      return LanguageModel;
    }
    
    // Method 2: window.LanguageModel
    if (typeof window !== 'undefined' && typeof window.LanguageModel !== 'undefined') {
      console.log('✅ Found window.LanguageModel');
      return window.LanguageModel;
    }
    
    // Method 3: globalThis.LanguageModel
    if (typeof globalThis !== 'undefined' && typeof globalThis.LanguageModel !== 'undefined') {
      console.log('✅ Found globalThis.LanguageModel');
      return globalThis.LanguageModel;
    }
    
    // Legacy check for window.ai (in case it still exists)
    if (window.ai) {
      console.log('🔍 window.ai exists (legacy), properties:', Object.getOwnPropertyNames(window.ai));
    }
    
    console.log('❌ No LanguageModel API found');
    console.log('❌ Available globals:', Object.getOwnPropertyNames(window).slice(0, 20), '...(truncated)');
    
    // Security context check
    if (!window.isSecureContext) {
      console.log('⚠️  WARNING: Not in secure context - AI API requires HTTPS');
    }
    
    return null;
  }

  async checkAiAvailability() {
    console.log('🔍 Checking AI availability...');
    console.log('🌐 Current URL:', window.location.href);
    console.log('🔍 Available window properties:', Object.getOwnPropertyNames(window).filter(prop => prop.toLowerCase().includes('ai')));
    
    // Debug what's available
    console.log('🔍 Checking window.ai:', typeof window.ai);
    console.log('🔍 Checking window.chrome:', typeof window.chrome);
    console.log('🔍 Checking globalThis.ai:', typeof globalThis.ai);
    
    const aiAPI = await this.getAiAPI();
    
    if (!aiAPI) {
      console.log('❌ No AI API found');
      return { 
        supported: false, 
        error: 'Chrome AI features not detected. Please:\n1. Use Chrome 128+ or Chrome Dev/Canary\n2. Go to chrome://flags/ and enable "Prompt API for Gemini Nano"\n3. Restart Chrome\n4. Ensure you have sufficient hardware (4GB+ GPU memory)' 
      };
    }

    try {
      // Use CORRECT Chrome Prompt API method: LanguageModel.availability()
      console.log('🔍 Checking API methods available:', Object.getOwnPropertyNames(aiAPI));
      
      let capabilities = null;
      
      // CORRECT API: LanguageModel.availability()
      if (typeof aiAPI.availability === 'function') {
        console.log('🔍 Using CORRECT API: LanguageModel.availability()...');
        capabilities = await aiAPI.availability();
        console.log('📋 LanguageModel.availability() result:', capabilities);
      } else {
        console.log('🔍 Available methods on LanguageModel:', Object.getOwnPropertyNames(aiAPI));
        console.log('🔍 Available prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(aiAPI)));
        throw new Error('LanguageModel.availability() method not found - Chrome Prompt API not properly enabled');
      }
      
      console.log('📋 AI availability result:', capabilities);
      console.log('📋 AI availability type:', typeof capabilities);
      
      // From Chrome docs, availability() returns: "unavailable", "downloadable", "downloading", or "available"
      const availabilityStatus = capabilities;
      
      console.log('📋 Final availability status:', availabilityStatus);
      
      // Handle status values according to Chrome documentation
      if (availabilityStatus === 'unavailable') {
        return { 
          supported: false, 
          error: 'AI model not supported on this device. Requires:\n• Windows 10+, macOS 13+, or Linux\n• 22GB+ free storage\n• 4GB+ GPU memory\n• Unmetered network connection' 
        };
      }
      
      if (availabilityStatus === 'downloadable') {
        console.log('📦 Model available but needs download');
        return { supported: true, needsDownload: true };
      }
      
      if (availabilityStatus === 'downloading') {
        console.log('⏳ Model download in progress');
        return { supported: true, needsDownload: true, downloading: true };
      }
      
      if (availabilityStatus === 'available') {
        console.log('✅ Model ready to use');
        return { supported: true, needsDownload: false };
      }
      
      return { supported: false, error: `Unknown availability status: ${availabilityStatus}` };
      
    } catch (error) {
      console.error('❌ Error checking AI capabilities:', error);
      console.error('❌ Error stack:', error.stack);
      return { 
        supported: false, 
        error: `Failed to check AI capabilities: ${error.message}\n\nEnsure Chrome flags are enabled:\n1. chrome://flags/#prompt-api-for-gemini-nano = Enabled\n2. chrome://flags/#optimization-guide-on-device-model = Enabled BypassPerfRequirement\n3. Restart Chrome completely` 
      };
    }
  }

  async checkAiModelStatus() {
    try {
      const aiCheck = await this.checkAiAvailability();
      
      if (!aiCheck.supported) {
        this.showAiStatus('error', aiCheck.error);
      } else if (aiCheck.downloading) {
        this.showAiStatus('info', 'AI model downloading in progress...');
      } else if (aiCheck.needsDownload) {
        this.showAiStatus('warning', 'AI model available but needs download');
      } else {
        this.showAiStatus('success', 'AI model ready');
      }
      
    } catch (error) {
      console.error('AI status check error:', error);
      this.showAiStatus('warning', 'Unable to check AI status');
    }
  }

  async testAiConnection() {
    const testBtn = this.sidebarElement.querySelector('#th-test-ai-btn');
    
    try {
      if (testBtn) {
        testBtn.disabled = true;
        testBtn.textContent = '🔄 Testing...';
      }

      console.log('🧪 Testing AI connection...');
      
      const aiCheck = await this.checkAiAvailability();
      
      if (!aiCheck.supported) {
        throw new Error(aiCheck.error);
      }

      if (aiCheck.needsDownload) {
        throw new Error('AI model needs to be downloaded first. Please enable AI summaries to download.');
      }

      // Test actual AI functionality
      this.showAiStatus('info', 'Testing AI response...');
      
      const aiAPI = await this.getAiAPI();
      if (!aiAPI) {
        throw new Error('AI API not available');
      }
      
      // Create session using CORRECT API: LanguageModel.create()
      console.log('🧪 Creating test session using LanguageModel.create()...');
      const session = await aiAPI.create({
        temperature: 0.1, // Very low temperature to prevent hallucinations
        topK: 3, // Low topK for more deterministic output
        language: 'en' // Specify English language
      });
      
      const testResponse = await session.prompt('Say "Hello from TravelGuard AI!" and nothing else.');
      session.destroy();

      console.log('🧪 Test response:', testResponse);
      
      this.showAiStatus('success', `AI test successful! Response: "${testResponse.trim()}"`);
      
    } catch (error) {
      console.error('🧪 AI test failed:', error);
      this.showAiStatus('error', `AI test failed: ${error.message}`);
    } finally {
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.textContent = '🧪 Test AI Connection';
      }
    }
  }

  async checkSystemRequirements() {
    // Check Chrome version and AI support
    const chromeStatus = this.sidebarElement.querySelector('#th-req-chrome');
    const modelStatus = this.sidebarElement.querySelector('#th-req-model');
    
    try {
      // Check AI availability
      const aiCheck = await this.checkAiAvailability();
      console.log('🔍 System requirements check result:', aiCheck);
      
      if (aiCheck.supported) {
        if (chromeStatus) {
          chromeStatus.textContent = '✅ Supported';
          chromeStatus.className = 'th-req-status th-req-good';
        }
        
        if (aiCheck.downloading) {
          if (modelStatus) {
            modelStatus.textContent = '⏳ Downloading...';
            modelStatus.className = 'th-req-status th-req-warning';
          }
        } else if (aiCheck.needsDownload) {
          if (modelStatus) {
            modelStatus.textContent = '⬬ Available (needs download)';
            modelStatus.className = 'th-req-status th-req-warning';
          }
        } else {
          if (modelStatus) {
            modelStatus.textContent = '✅ Ready';
            modelStatus.className = 'th-req-status th-req-good';
          }
        }
      } else {
        if (chromeStatus) {
          chromeStatus.textContent = '❌ Not supported';
          chromeStatus.className = 'th-req-status th-req-bad';
        }
        if (modelStatus) {
          modelStatus.textContent = '❌ Unavailable';
          modelStatus.className = 'th-req-status th-req-bad';
        }
      }
      
    } catch (error) {
      console.error('System requirements check failed:', error);
      if (chromeStatus) {
        chromeStatus.textContent = '❓ Unknown';
        chromeStatus.className = 'th-req-status';
      }
      if (modelStatus) {
        modelStatus.textContent = '❓ Unknown';
        modelStatus.className = 'th-req-status';
      }
    }
  }

  showAiStatus(type, message, progressPercent = null) {
    const statusContainer = this.sidebarElement.querySelector('#th-ai-status');
    if (!statusContainer) return;

    // Remove existing status
    statusContainer.innerHTML = '';

    let progressBarHTML = '';
    if (progressPercent !== null && type === 'info') {
      progressBarHTML = `
        <div class="th-ai-progress-bar">
          <div class="th-ai-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
      `;
    }

    const statusHTML = `
      <div class="th-ai-status-message th-ai-status-${type}">
        <span class="th-ai-status-icon"></span>
        <span class="th-ai-status-text">${message}</span>
        ${progressBarHTML}
      </div>
    `;

    statusContainer.innerHTML = statusHTML;
  }

  showAiButton() {
    const container = this.sidebarElement.querySelector('#th-selected-countries');
    if (!container) return;

    // Remove any existing AI button first
    this.removeAiSummaryButton();

    // Create AI button
    const aiButtonHTML = `
      <div class="th-ai-summary-controls">
        <button class="th-ai-summary-btn" id="th-ai-summary-btn">
          <span class="th-ai-icon">✨</span>
          <span class="th-ai-text">Generate AI Summary</span>
          <span class="th-ai-loading hidden">⏳</span>
        </button>
      </div>
    `;

    // Append to container
    container.insertAdjacentHTML('beforeend', aiButtonHTML);

    // Add event listener
    const aiBtn = container.querySelector('#th-ai-summary-btn');
    if (aiBtn) {
      aiBtn.addEventListener('click', () => this.handleAiSummary());
    }
  }

  // Main AI Summary Handler
  async handleAiSummary() {
    console.log('🤖 Handling AI Summary request...');
    
    const aiBtn = this.sidebarElement.querySelector('#th-ai-summary-btn');
    const aiIcon = aiBtn?.querySelector('.th-ai-icon');
    const aiText = aiBtn?.querySelector('.th-ai-text');
    const aiLoading = aiBtn?.querySelector('.th-ai-loading');

    try {
      // Step 1: Check prerequisites
      const { aiSummaryEnabled } = await chrome.storage.local.get(['aiSummaryEnabled']);
      
      if (!aiSummaryEnabled) {
        this.showAiError('AI summaries are not enabled. Please enable them in settings first.');
        return;
      }

      // Check AI availability
      const aiCheck = await this.checkAiAvailability();
      
      if (!aiCheck.supported) {
        this.showAiError(`AI not available: ${aiCheck.error}`);
        return;
      }

      if (aiCheck.needsDownload) {
        this.showAiError('AI model needs to be downloaded first. Please go to settings and enable AI summaries to download the model.');
        return;
      }

      // Step 2: Show loading state
      this.showAiLoading(aiBtn, aiIcon, aiText, aiLoading, 'Gathering country data...');

      // Step 3: Gather data from country cards
      const combinedHealthData = this.gatherCountryHealthData();
      
      if (!combinedHealthData) {
        this.showAiError('No health data found to summarize. Please ensure countries are loaded.');
        return;
      }

      // Step 4: Generate AI summary
      this.showAiLoading(aiBtn, aiIcon, aiText, aiLoading, 'Generating AI summary...');
      
      const aiAPI = await this.getAiAPI();
      if (!aiAPI) {
        throw new Error('AI API not available');
      }
      
      const prompt = this.buildAiPrompt(combinedHealthData);
      
      // Create session using CORRECT API: LanguageModel.create()
      console.log('🤖 Creating AI session using LanguageModel.create()...');
      const session = await aiAPI.create({
        temperature: 0.1, // Very low temperature to prevent hallucinations
        topK: 3, // Low topK for more deterministic output
        language: 'en' // Specify English language
      });
      
      const summary = await session.prompt(prompt);
      
      // Clean up the session
      session.destroy();

      console.log('✅ AI summary received. Length:', summary?.length);
      console.log('📄 Full AI summary:', summary);

      // Step 5: Display results
      if (summary && summary.trim().length > 0) {
        console.log('🚀 About to call displayAiSummary with summary:', summary.substring(0, 100) + '...');
        this.displayAiSummary(summary);
        console.log('🏁 displayAiSummary call completed');
      } else {
        console.error('❌ AI returned empty or invalid response:', summary);
        throw new Error('AI returned empty response');
      }
      // Note: Don't reset button here since displayAiSummary() hides it

    } catch (error) {
      console.error('AI Summary error:', error);
      this.showAiError(error.message || 'Failed to generate AI summary');
      this.resetAiButton(aiBtn, aiIcon, aiText, aiLoading);
      // Show the button again since there was an error
      this.showAiSummaryButtonIfNeeded();
    }
  }

  showAiLoading(aiBtn, aiIcon, aiText, aiLoading, message) {
    if (aiBtn) aiBtn.disabled = true;
    if (aiIcon) aiIcon.style.display = 'none';
    if (aiLoading) aiLoading.classList.remove('hidden');
    if (aiText) aiText.textContent = message;
  }

  resetAiButton(aiBtn, aiIcon, aiText, aiLoading) {
    if (aiBtn) aiBtn.disabled = false;
    if (aiIcon) aiIcon.style.display = 'inline';
    if (aiLoading) aiLoading.classList.add('hidden');
    if (aiText) aiText.textContent = 'Generate AI Summary';
  }

  gatherCountryHealthData() {
    const resultsContainer = this.sidebarElement.querySelector('.th-results-content');
    if (!resultsContainer) return null;

    const countryCards = resultsContainer.querySelectorAll('.th-country-result');
    if (!countryCards.length) return null;

    let combinedData = '';
    
    countryCards.forEach(card => {
      const countryHeader = card.querySelector('.th-country-header, .th-country-name');
      const countryName = countryHeader?.textContent?.trim() || 'Unknown Country';
      
      combinedData += `\n--- HEALTH DATA FOR ${countryName.toUpperCase()} ---\n`;
      
      // Extract all text content from the card, excluding headers and buttons
      const cardText = card.innerText
        .replace(/×/g, '') // Remove close buttons
        .replace(/▼|▲|▶/g, '') // Remove expand/collapse indicators
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      combinedData += cardText + '\n';
    });

    return combinedData;
  }

  buildAiPrompt(healthData) {
    // Extract country names from the health data
    const countryMatches = healthData.match(/--- HEALTH DATA FOR ([A-Z\s]+) ---/g);
    const countries = countryMatches ? 
      countryMatches.map(match => 
        match.replace(/--- HEALTH DATA FOR ([A-Z\s]+) ---/, '$1').trim()
      ).join(' and ') : 'your destinations';

    return `Create a combined travel health summary for a pharmacy patient traveling to ${countries}. Use the official health data below and format with clear headings and bullet points.

--- BEGIN HEALTH DATA ---
${healthData}
--- END HEALTH DATA ---

Format your response exactly as follows:

**Essential Vaccinations**
• [List vaccines recommended for most travelers, include country names in brackets when specific to certain countries]

**Risk-Based Vaccinations** 
• [List conditional vaccines with brief criteria, add country names only when not obvious from context]

**Malaria Information**
• [State malaria risk and antimalarial recommendations with country specificity, or "No malaria risk information available"]

**Other Health Risks**
• [List other key diseases/risks with country attribution where relevant]

**INSTRUCTIONS:**
- Only add country names in square brackets [Country Name] when the text doesn't already mention the country
- If the text already says "Iran" or "Andorra" etc., don't add brackets
- If a recommendation applies to all countries, don't add brackets
- If different countries have different risk levels, specify each country separately
- Use bullet points only
- Keep each bullet point concise (1-2 lines max)
- Only include information explicitly in the provided data
- Focus on practical pharmacy counseling information
- Don't explain diseases - just list them briefly`;
  }

  displayAiSummary(summary) {
    console.log('🎯 displayAiSummary called with summary length:', summary?.length);
    
    // Target the th-results-content container instead of th-results to avoid being wiped by updateResults()
    const resultsContainer = this.sidebarElement.querySelector('.th-results-content');
    console.log('🔍 Results content container found:', !!resultsContainer);
    
    if (!resultsContainer) {
      console.error('❌ Results content container not found!');
      return;
    }

    // Get the countries for the title
    const countryNames = this.selectedCountries.length > 0 ? 
      this.selectedCountries.join(' & ') : 'Selected Destinations';
    console.log('🌍 Countries for title:', countryNames);

    // Debug the results container visibility
    const containerStyle = getComputedStyle(resultsContainer);
    console.log('📊 Results container debug:', {
      display: containerStyle.display,
      visibility: containerStyle.visibility,
      opacity: containerStyle.opacity,
      width: resultsContainer.offsetWidth,
      height: resultsContainer.offsetHeight,
      scrollHeight: resultsContainer.scrollHeight,
      position: containerStyle.position,
      overflow: containerStyle.overflow
    });

    // Remove any existing AI summary
    const existingSummary = resultsContainer.querySelector('.th-ai-summary-result');
    if (existingSummary) {
      console.log('🗑️ Removing existing AI summary');
      existingSummary.remove();
    }

    // Hide the Generate AI Summary button
    console.log('🔽 Hiding AI summary button');
    this.hideAiSummaryButton();

    // Collapse all other country cards (temporarily disabled for debugging)
    console.log('📊 Skipping collapse for debugging');
    // this.collapseAllCountryCards();

    // Format the summary first and log it
    const formattedSummary = this.formatAiSummary(summary);
    console.log('📝 Formatted summary HTML:', formattedSummary);

    // Create AI summary in exact country card format
    const summaryHTML = `
      <div class="th-country-result th-ai-summary-result th-country-expandable th-country-expanded">
        <div class="th-country-header th-country-clickable">
          <h3 class="th-country-name">
            <span class="th-ai-summary-icon">✨</span>
            Travel Health Summary
          </h3>
          <span class="th-country-expand-indicator">▲</span>
        </div>
        <div class="th-country-content">
          <div class="th-ai-summary-text">
            <div class="th-ai-countries-header">
              <strong>Destinations: ${countryNames}</strong>
            </div>
            ${formattedSummary}
          </div>
        </div>
      </div>
    `;

    console.log('🏗️ About to insert HTML:', summaryHTML.substring(0, 200) + '...');

    resultsContainer.insertAdjacentHTML('afterbegin', summaryHTML);
    
    // Verify the element was actually inserted
    const insertedElement = resultsContainer.querySelector('.th-ai-summary-result');
    console.log('✅ AI summary element inserted successfully:', !!insertedElement);
    
    if (insertedElement) {
      console.log('📊 Element classes:', insertedElement.className);
      console.log('📐 Element visibility:', getComputedStyle(insertedElement).display);
      console.log('📏 Element dimensions:', {
        width: insertedElement.offsetWidth,
        height: insertedElement.offsetHeight,
        clientHeight: insertedElement.clientHeight
      });
    } else {
      console.error('❌ AI summary element NOT found after insertion!');
    }

    // Scroll to top to show the summary
    resultsContainer.scrollTop = 0;
    
    console.log('🎯 displayAiSummary completed');
  }

  formatAiSummary(summary) {
    console.log('🔄 Formatting AI summary. Length:', summary?.length, 'Content preview:', summary?.substring(0, 100));
    
    if (!summary || summary.trim().length === 0) {
      console.error('❌ Empty AI summary received');
      return '<div class="th-ai-content"><p>No summary generated</p></div>';
    }
    
    // Split into lines and process each line
    const lines = summary.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let formatted = '';
    let inList = false;
    
    for (let line of lines) {
      // Check if it's a header (starts with **)
      if (line.match(/^\*\*(.*?)\*\*$/)) {
        // Close any open list
        if (inList) {
          formatted += '</ul>';
          inList = false;
        }
        // Add header
        const headerText = line.replace(/^\*\*(.*?)\*\*$/, '$1');
        formatted += `<h4>${headerText}</h4>`;
      }
      // Check if it's a bullet point
      else if (line.match(/^[•*-]\s+(.+)$/)) {
        // Open list if not already open
        if (!inList) {
          formatted += '<ul>';
          inList = true;
        }
        // Add list item
        const itemText = line.replace(/^[•*-]\s+(.+)$/, '$1');
        formatted += `<li>${itemText}</li>`;
      }
      // Regular text
      else if (line.length > 0) {
        // Close any open list
        if (inList) {
          formatted += '</ul>';
          inList = false;
        }
        formatted += `<p>${line}</p>`;
      }
    }
    
    // Close any remaining open list
    if (inList) {
      formatted += '</ul>';
    }
    
    console.log('✅ Formatted AI summary HTML length:', formatted.length);
    console.log('✅ Final formatted HTML:', formatted);
    
    const finalHtml = `<div class="th-ai-content">${formatted}</div>`;
    console.log('✅ Complete AI content HTML:', finalHtml);
    
    return finalHtml;
  }

  hideAiSummaryButton() {
    const aiButton = this.sidebarElement.querySelector('.th-ai-summary-controls');
    if (aiButton) {
      aiButton.style.display = 'none';
    }
  }

  showAiSummaryButtonIfNeeded() {
    // Only show if multiple countries are selected and AI is enabled
    if (this.selectedCountries.length > 1) {
      chrome.storage.local.get(['aiSummaryEnabled']).then(result => {
        const isAiEnabled = result.aiSummaryEnabled || false;
        if (isAiEnabled) {
          const aiButton = this.sidebarElement.querySelector('.th-ai-summary-controls');
          if (aiButton) {
            aiButton.style.display = 'block';
          }
        }
      });
    }
  }

  collapseAllCountryCards() {
    const countryCards = this.sidebarElement.querySelectorAll('.th-country-result:not(.th-ai-summary-result)');
    countryCards.forEach(card => {
      const content = card.querySelector('.th-country-content');
      const expandBtn = card.querySelector('.th-expand-btn');
      
      if (content && expandBtn) {
        content.style.display = 'none';
        expandBtn.textContent = '▼';
      }
    });
  }

  expandAllCountryCards() {
    const countryCards = this.sidebarElement.querySelectorAll('.th-country-result:not(.th-ai-summary-result)');
    countryCards.forEach(card => {
      const content = card.querySelector('.th-country-content');
      const expandBtn = card.querySelector('.th-expand-btn');
      
      if (content && expandBtn) {
        content.style.display = 'block';
        expandBtn.textContent = '▲';
      }
    });
  }

  clearAiSummary() {
    // Remove any existing AI summary when countries change
    const existingSummary = this.sidebarElement.querySelector('.th-ai-summary-result');
    if (existingSummary) {
      existingSummary.remove();
      console.log('🗑️ Cleared existing AI summary');
    }
  }

  showAiError(message) {
    const resultsContainer = this.sidebarElement.querySelector('.th-results-content');
    if (!resultsContainer) return;

    // Remove any existing AI error
    const existingError = resultsContainer.querySelector('.th-ai-error');
    if (existingError) {
      existingError.remove();
    }

    const errorHTML = `
      <div class="th-ai-error">
        <div class="th-ai-error-content">
          <span class="th-ai-error-icon">❌</span>
          <span class="th-ai-error-text">${message}</span>
          <button class="th-ai-error-close" title="Close Error">×</button>
        </div>
      </div>
    `;

    resultsContainer.insertAdjacentHTML('afterbegin', errorHTML);

    // Add close handler
    const closeBtn = resultsContainer.querySelector('.th-ai-error-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const errorElement = resultsContainer.querySelector('.th-ai-error');
        if (errorElement) {
          errorElement.remove();
        }
      });
    }

    // Auto-remove after 10 seconds
    setTimeout(() => {
      const errorElement = resultsContainer.querySelector('.th-ai-error');
      if (errorElement) {
        errorElement.remove();
      }
    }, 10000);
  }

  destroy() {
    if (this.sidebarElement) {
      this.sidebarElement.remove();
    }
  }
}

// Initialize sidebar when script loads
console.log('TravelGuard: Sidebar script loading...');
console.log('TravelGuard: Script execution starting...');

let vaccinationSidebar;

try {
  console.log('TravelGuard: Creating VaccinationSidebar instance...');
  vaccinationSidebar = new VaccinationSidebar();
  console.log('TravelGuard: VaccinationSidebar instance created successfully');
  
  // Make sidebar available globally
  window.vaccinationSidebar = vaccinationSidebar;
  console.log('TravelGuard: Sidebar added to window.vaccinationSidebar');
      
    } catch (error) {
  console.error('TravelGuard: Error creating VaccinationSidebar:', error);
}

// Debug and test functions
window.testTravelGuard = () => {
  console.log('TravelGuard: Testing sidebar...');
  if (window.vaccinationSidebar) {
    window.vaccinationSidebar.openSidebar();
    console.log('TravelGuard: Sidebar should be visible now');
  } else {
    console.log('TravelGuard: No sidebar available');
  }
};

window.showTravelGuardSidebar = () => {
  console.log('TravelGuard: Manual sidebar trigger');
  if (window.vaccinationSidebar) {
    window.vaccinationSidebar.openSidebar();
  } else {
    console.log('TravelGuard: No sidebar available');
  }
};

window.testCitySearch = () => {
  if (window.vaccinationSidebar) {
    console.log('🧪 Testing city search functionality...');
    
    // Test city mapping exists
    const mappingCount = Object.keys(window.vaccinationSidebar.cityToCountryMapping).length;
    console.log(`✅ City mapping loaded: ${mappingCount} cities`);
    
    // Test some sample cities
    const testCities = ['paris', 'tokyo', 'nairobi', 'nyc', 'dubai'];
    testCities.forEach(city => {
      const country = window.vaccinationSidebar.cityToCountryMapping[city];
      console.log(`🏙️ ${city} → ${country || 'NOT FOUND'}`);
    });
    
    // Test search function
    const searchResults = window.vaccinationSidebar.searchCitiesForCountries('paris');
    console.log('🔍 Search results for "paris":', searchResults);
    
    // Test capitalize function
    const capitalized = window.vaccinationSidebar.capitalizeCity('new york city');
    console.log('📝 Capitalization test: "new york city" → "' + capitalized + '"');
    
    console.log('🧪 City search test complete!');
    console.log('✅ Icons removed - dropdown should show clean left-justified text');
    } else {
    console.log('❌ Sidebar not loaded');
  }
};

window.debugTravelGuard = () => {
  console.log('TravelGuard: Debug Information');
  console.log('- Sidebar exists:', !!window.vaccinationSidebar);
  if (window.vaccinationSidebar) {
    console.log('- Element exists:', !!window.vaccinationSidebar.sidebarElement);
    console.log('- Visible:', window.vaccinationSidebar.isVisible);
    console.log('- Minimized:', window.vaccinationSidebar.isMinimized);
    console.log('- Selected countries:', window.vaccinationSidebar.selectedCountries);
  }
};

window.minimizeTravelGuard = () => {
  console.log('TravelGuard: Testing minimize...');
  if (window.vaccinationSidebar) {
    window.vaccinationSidebar.minimizeSidebar();
  }
};

window.expandTravelGuard = () => {
  console.log('TravelGuard: Testing expand...');
  if (window.vaccinationSidebar) {
    window.vaccinationSidebar.expandSidebar();
  }
};

window.refreshTravelGuard = () => {
  console.log('TravelGuard: Testing refresh...');
  if (window.vaccinationSidebar) {
    window.vaccinationSidebar.refreshExtension();
  }
};

window.checkTravelGuardFonts = () => {
  console.log('TravelGuard: Checking fonts...');
  
  // Check if Google Fonts link exists
  const fontLink = document.querySelector('link[href*="fonts.googleapis.com"][href*="Montserrat"]');
  console.log('- Google Fonts link exists:', !!fontLink);
  
  // Check if font is available
  const testElement = document.createElement('div');
  testElement.style.fontFamily = '"Montserrat", sans-serif';
  testElement.style.position = 'absolute';
  testElement.style.visibility = 'hidden';
  testElement.style.fontSize = '16px';
  testElement.textContent = 'Test';
  document.body.appendChild(testElement);
  
  const computedStyle = window.getComputedStyle(testElement);
  const actualFont = computedStyle.fontFamily;
  console.log('- Computed font-family:', actualFont);
  console.log('- Is Montserrat loaded:', actualFont.includes('Montserrat'));
  
  document.body.removeChild(testElement);
  
  // Check sidebar font
  if (window.vaccinationSidebar && window.vaccinationSidebar.sidebarElement) {
    const sidebarStyle = window.getComputedStyle(window.vaccinationSidebar.sidebarElement);
    console.log('- Sidebar font-family:', sidebarStyle.fontFamily);
  }
};

console.log('TravelGuard: Debug functions available:');
console.log('- window.testTravelGuard()');
console.log('- window.showTravelGuardSidebar()'); 
console.log('- window.testCitySearch()');
console.log('- window.debugTravelGuard()');
console.log('- window.minimizeTravelGuard()');
console.log('- window.expandTravelGuard()');
console.log('- window.refreshTravelGuard()');
console.log('- window.checkTravelGuardFonts()');
console.log('\n🔗 Country names are now clickable links to TravelHealthPro!');
console.log('✅ City-to-country mapping supported for direct links');
console.log('🆔 Correct URL format with country IDs: /country/105/india');
console.log('🕰️ Last updated date shown in footer');

// Auto-test sidebar creation and fonts
setTimeout(() => {
  console.log('TravelGuard: Auto-testing sidebar creation...');
  if (window.debugTravelGuard) {
    window.debugTravelGuard();
  }
}, 1000);

// Initialize all interactive functionality after DOM updates
function setupAllInteractivity() {
  setupCountryAccordion();
  setupSectionCollapse();
  console.log('✅ All interactive handlers set up');
}

// Add click handlers for section collapse functionality
function setupSectionCollapse() {
  document.addEventListener('click', function(event) {
    const sectionHeader = event.target.closest('.th-section-clickable');
    
    if (sectionHeader) {
      event.preventDefault();
      event.stopPropagation();
      
      const section = sectionHeader.closest('.th-vaccine-section, .th-malaria-section');
      const content = section.querySelector('.th-vaccine-list, .th-malaria-content');
      const expandIndicator = sectionHeader.querySelector('.th-section-expand-indicator');
      
      if (content && expandIndicator) {
        const isExpanded = section.classList.contains('th-section-expanded');
        
        if (isExpanded) {
          // Collapse
          section.classList.remove('th-section-expanded');
      content.style.display = 'none';
          expandIndicator.textContent = '▶';
        } else {
          // Expand
          section.classList.add('th-section-expanded');
          content.style.display = 'block';
          expandIndicator.textContent = '▼';
        }
      }
    }
  });
}

// Initialize interactive functionality
setupAllInteractivity();

// Add click handlers for country accordion
function setupCountryAccordion() {
  // Remove existing listener to prevent duplicates
  document.removeEventListener('click', countryAccordionHandler);
  document.addEventListener('click', countryAccordionHandler);
}

// Separate handler function for country accordion
function countryAccordionHandler(event) {
  // Don't handle if clicking on country link
  if (event.target.classList.contains('th-country-link')) {
    console.log('🔗 Opening country link:', event.target.href);
    return; // Let the link work normally
  }
  
  const countryHeader = event.target.closest('.th-country-clickable');
  
  if (countryHeader) {
    event.preventDefault();
    event.stopPropagation();
    
    const countryResult = countryHeader.closest('.th-country-expandable');
    if (!countryResult) {
      console.error('❌ Country result not found for header:', countryHeader);
      return;
    }
    
    const countryContent = countryResult.querySelector('.th-country-content');
    const expandIndicator = countryHeader.querySelector('.th-country-expand-indicator');
    
    if (countryContent && expandIndicator) {
      const isExpanded = countryResult.classList.contains('th-country-expanded');
      
      if (isExpanded) {
        // Collapse
        countryResult.classList.remove('th-country-expanded');
        countryContent.style.display = 'none';
        expandIndicator.textContent = '▼';
        console.log('📁 Collapsed country:', countryHeader.querySelector('.th-country-link')?.textContent || countryHeader.querySelector('.th-country-name')?.textContent);
      } else {
        // Expand
        countryResult.classList.add('th-country-expanded');
        countryContent.style.display = 'block';
        expandIndicator.textContent = '▲';
        console.log('🔍 Expanded country:', countryHeader.querySelector('.th-country-link')?.textContent || countryHeader.querySelector('.th-country-name')?.textContent);
      }
    }
  }
}

// Ensure debug functions are available
setTimeout(() => {
  console.log('🐛 Debug functions available:', {
    testRealCountries: typeof window.testRealCountries,
    debugIndiaData: typeof window.debugIndiaData,
    findSimilarCountries: typeof window.findSimilarCountries
  });
  

}, 1000);

// Function to format malaria content with proper bullets and spacing
function formatMalariaContent(text) {
  if (!text) return '';
  
  // Split by sentences that start with common patterns
  let formatted = text
    // Add bullets for new sentences that start with key phrases
    .replace(/\.\s*(There is|For the|In low|Travellers with|The final|Following)/g, '.</li><li>$1')
    // Add bullets for sentences that start at the beginning
    .replace(/^(There is|For the|In low|Travellers with|The final|Following)/g, '<li>$1')
    // Add bullet for very first item if not already added
    .replace(/^(?!<li>)(.)/g, '<li>$1');
  
  // If we added any <li> tags, wrap in <ul> and close the last item
  if (formatted.includes('<li>')) {
    formatted = '<ul class="th-malaria-list">' + formatted + '</li></ul>';
  } else {
    // If no bullets detected, just add spacing between sentences
    formatted = text.replace(/\.\s+/g, '.</p><p>');
    formatted = '<p>' + formatted + '</p>';
  }
  
  return formatted;
}

// Helper function to extract proper vaccine title from description
function extractVaccineTitle(vaccine, description) {
  if (!description) {
    return vaccine.name || vaccine.n || '';
  }
  
  const vaccineName = vaccine.name || vaccine.n || '';
  const words = description.trim().split(' ');
  
  // PRIORITY 1: Handle compound disease names that start with different patterns  
  if (words.length >= 2) {
    const firstWord = words[0];
    const secondWord = words[1];
    const twoWords = `${firstWord} ${secondWord}`;
    
    // Check if this looks like a compound disease name
    if (firstWord.toLowerCase().includes('tick-borne') || 
        twoWords.toLowerCase() === 'yellow fever' ||
        twoWords.toLowerCase() === 'japanese encephalitis' ||
        twoWords.toLowerCase() === 'hepatitis a' ||
        twoWords.toLowerCase() === 'hepatitis b' ||
        twoWords.toLowerCase() === 'meningococcal meningitis' ||
        twoWords.toLowerCase() === 'meningococcal disease') {
      return twoWords;
    }
  }
  
  // PRIORITY 2: Look for patterns like "Disease Name (Additional Info)" at the very beginning
  if (description.includes('(') && description.includes(')')) {
    // Extract just the name with parentheses, but only if it's a reasonable length
    const match = description.match(/^([^(]*\([^)]*\))/);
    if (match) {
      const result = match[1].trim();
      // Only use parenthetical match if it's reasonable length (not the whole description)
      if (result.split(' ').length <= 5) {
        return result;
      }
    }
  }
  
  // PRIORITY 3: Check for exact repetition patterns
  // Check for 2-word repetition: "Word1 Word2 Word1 Word2"
  if (words.length >= 4) {
    const firstTwo = `${words[0]} ${words[1]}`;
    const nextTwo = `${words[2]} ${words[3]}`;
    if (firstTwo.toLowerCase() === nextTwo.toLowerCase()) {
      return firstTwo;
    }
  }
  
  // Check for 3-word repetition: "Word1 Word2 Word3 Word1 Word2 Word3"
  if (words.length >= 6) {
    const firstThree = `${words[0]} ${words[1]} ${words[2]}`;
    const nextThree = `${words[3]} ${words[4]} ${words[5]}`;
    if (firstThree.toLowerCase() === nextThree.toLowerCase()) {
      return firstThree;
    }
  }
  
  // Check for single word repetition: "Word Word"
  if (words.length >= 2 && words[0].toLowerCase() === words[1].toLowerCase()) {
    return words[0];
  }
  
  // PRIORITY 4: If vaccine name appears at the start, use it (handles cases like "Tuberculosis TB...")
  if (vaccineName && description.toLowerCase().startsWith(vaccineName.toLowerCase())) {
    return vaccineName;
  }
  
  // PRIORITY 5: Use first word if it's a clear disease name (and different from vaccine name)
  const firstWord = words[0];
  if (firstWord && firstWord !== vaccineName && firstWord.length > 2) {
    // Check if it looks like a disease name (starts with capital letter, reasonable length)
    if (/^[A-Z][a-z]+/.test(firstWord)) {
      return firstWord;
    }
  }
  
  // FINAL FALLBACK: Always use the original vaccine name as last resort
  return vaccineName;
}

// Helper function to clean vaccine descriptions of duplicate names
function cleanVaccineDescription(vaccine, description) {
  let cleanDesc = description;
  const vaccineName = vaccine.name || vaccine.n || '';
  
  // Extract the proper title to remove from the description
  const properTitle = extractVaccineTitle(vaccine, description);
  
  // Remove the title from the beginning of the description if it's duplicated
  if (properTitle && cleanDesc.startsWith(properTitle + ' ' + properTitle)) {
    // Remove the duplicate: "Hepatitis A Hepatitis A is..." -> "Hepatitis A is..."
    cleanDesc = cleanDesc.replace(properTitle + ' ' + properTitle, properTitle);
  } else if (properTitle && cleanDesc.startsWith(properTitle + ' ')) {
    // Remove the title from the beginning: "Rabies (Bat Lyssavirus) Although rare..." -> "Although rare..."
    cleanDesc = cleanDesc.substring(properTitle.length + 1);
  }
  
  return cleanDesc;
}

// Helper function to get TravelHealthPro country ID and URL slug
function getCountryIdAndSlug(countryName) {
  // CORRECT mapping based on official TravelHealthPro URLs
  const countryMapping = {
    'Afghanistan': { id: 1, slug: 'afghanistan' },
    'Albania': { id: 2, slug: 'albania' },
    'Algeria': { id: 3, slug: 'algeria' },
    'Andorra': { id: 6, slug: 'andorra' },
    'Angola': { id: 7, slug: 'angola' },
    'Argentina': { id: 11, slug: 'argentina' },
    'Armenia': { id: 12, slug: 'armenia' },
    'Australia': { id: 15, slug: 'australia' },
    'Austria': { id: 16, slug: 'austria' },
    'Azerbaijan': { id: 17, slug: 'azerbaijan' },
    'Bangladesh': { id: 22, slug: 'bangladesh' },
    'Belgium': { id: 25, slug: 'belgium' },
    'Bhutan': { id: 29, slug: 'bhutan' },
    'Bolivia': { id: 30, slug: 'bolivia' },
    'Brazil': { id: 34, slug: 'brazil' },
    'Bulgaria': { id: 36, slug: 'bulgaria' },
    'Canada': { id: 41, slug: 'canada' },
    'Chile': { id: 48, slug: 'chile' },
    'China': { id: 49, slug: 'china' },
    'Colombia': { id: 53, slug: 'colombia' },
    'Croatia': { id: 59, slug: 'croatia' },
    'Czech Republic': { id: 62, slug: 'czech-republic' },
    'Denmark': { id: 64, slug: 'denmark' },
    'Ecuador': { id: 70, slug: 'ecuador' },
    'Egypt': { id: 71, slug: 'egypt' },
    'Estonia': { id: 75, slug: 'estonia' },
    'Ethiopia': { id: 76, slug: 'ethiopia' },
    'Fiji': { id: 79, slug: 'fiji' },
    'Finland': { id: 80, slug: 'finland' },
    'France': { id: 81, slug: 'france' },
    'Germany': { id: 88, slug: 'germany' },
    'Ghana': { id: 89, slug: 'ghana' },
    'Greece': { id: 91, slug: 'greece' },
    'Hungary': { id: 103, slug: 'hungary' },
    'Iceland': { id: 104, slug: 'iceland' },
    'India': { id: 105, slug: 'india' },
    'Indonesia': { id: 106, slug: 'indonesia' },
    'Iran': { id: 107, slug: 'iran' },
    'Iraq': { id: 108, slug: 'iraq' },
    'Ireland': { id: 109, slug: 'ireland' },
    'Israel': { id: 110, slug: 'israel' },
    'Italy': { id: 111, slug: 'italy' },
    'Jamaica': { id: 113, slug: 'jamaica' },
    'Japan': { id: 114, slug: 'japan' },
    'Jordan': { id: 115, slug: 'jordan' },
    'Kazakhstan': { id: 116, slug: 'kazakhstan' },
    'Kenya': { id: 117, slug: 'kenya' },
    'South Korea': { id: 120, slug: 'korea-south' },
    'Nepal': { id: 159, slug: 'nepal' },
    'Netherlands': { id: 160, slug: 'netherlands' },
    'New Zealand': { id: 162, slug: 'new-zealand' },
    'Nicaragua': { id: 163, slug: 'nicaragua' },
    'Nigeria': { id: 165, slug: 'nigeria' },
    'Norway': { id: 168, slug: 'norway' },
    'Pakistan': { id: 171, slug: 'pakistan' },
    'Peru': { id: 177, slug: 'peru' },
    'Philippines': { id: 178, slug: 'philippines' },
    'Poland': { id: 180, slug: 'poland' },
    'Portugal': { id: 181, slug: 'portugal' },
    'Romania': { id: 185, slug: 'romania' },
    'Russia': { id: 186, slug: 'russia' },
    'Saudi Arabia': { id: 191, slug: 'saudi-arabia' },
    'Singapore': { id: 196, slug: 'singapore' },
    'South Africa': { id: 201, slug: 'south-africa' },
    'Spain': { id: 203, slug: 'spain' },
    'Sri Lanka': { id: 204, slug: 'sri-lanka' },
    'Sweden': { id: 215, slug: 'sweden' },
    'Switzerland': { id: 216, slug: 'switzerland' },
    'Taiwan': { id: 218, slug: 'taiwan' },
    'Thailand': { id: 221, slug: 'thailand' },
    'Turkey': { id: 227, slug: 'turkey' },
    'United Arab Emirates': { id: 233, slug: 'united-arab-emirates' },
    'United Kingdom': { id: 234, slug: 'united-kingdom' },
    'United States': { id: 235, slug: 'usa' },
    'Vietnam': { id: 240, slug: 'vietnam' }
  };
  
  if (countryMapping[countryName]) {
    return countryMapping[countryName];
  }
  
  // Fallback: create a slug and use null ID (will fallback to countries list)
  const slug = countryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return { id: null, slug: slug };
}

// Helper function to generate TravelHealthPro URL for a country
function getTravelHealthProUrl(countryName) {
  const countryInfo = getCountryIdAndSlug(countryName);
  
  if (countryInfo.id) {
    // Use the correct format with country ID
    return `https://travelhealthpro.org.uk/country/${countryInfo.id}/${countryInfo.slug}`;
  } else {
    // Fallback to countries list page if we don't have the ID
    return `https://travelhealthpro.org.uk/countries`;
  }
}

// Helper function to get the actual country name (handles city-to-country mapping)
function getActualCountryName(locationName) {
  // Check if this is a city mapped to a country
  const cityMapping = {
    // Medical Tourism Destinations
    "bangkok": "Thailand",
    "phuket": "Thailand",
    "chiang mai": "Thailand",
    "pattaya": "Thailand",
    "mumbai": "India",
    "bombay": "India",
    "delhi": "India",
    "new delhi": "India",
    "chennai": "India",
    "madras": "India",
    "bangalore": "India",
    "bengaluru": "India",
    "hyderabad": "India",
    "kolkata": "India",
    "calcutta": "India",
    "goa": "India",
    "mexico city": "Mexico",
    "tijuana": "Mexico",
    "cancun": "Mexico",
    "istanbul": "Turkey",
    "ankara": "Turkey",
    "seoul": "South Korea",
    "singapore": "Singapore",
    "kuala lumpur": "Malaysia",
    "penang": "Malaysia",
    "manila": "Philippines",
    "cebu": "Philippines",
    "jakarta": "Indonesia",
    "bali": "Indonesia",
    "hong kong": "Hong Kong",
    "macau": "Macau",
    "dubai": "United Arab Emirates",
    "abu dhabi": "United Arab Emirates",
    "doha": "Qatar",
    "riyadh": "Saudi Arabia",
    "jeddah": "Saudi Arabia",
    "tel aviv": "Israel",
    "jerusalem": "Israel",
    "cairo": "Egypt",
    "tunis": "Tunisia",
    "casablanca": "Morocco",
    "marrakech": "Morocco",
    "cape town": "South Africa",
    "johannesburg": "South Africa",
    "nairobi": "Kenya",
    "lagos": "Nigeria",
    "accra": "Ghana",
    "sydney": "Australia",
    "melbourne": "Australia",
    "auckland": "New Zealand",
    "london": "United Kingdom",
    "manchester": "United Kingdom",
    "paris": "France",
    "lyon": "France",
    "berlin": "Germany",
    "munich": "Germany",
    "rome": "Italy",
    "milan": "Italy",
    "madrid": "Spain",
    "barcelona": "Spain",
    "lisbon": "Portugal",
    "amsterdam": "Netherlands",
    "brussels": "Belgium",
    "vienna": "Austria",
    "zurich": "Switzerland",
    "stockholm": "Sweden",
    "oslo": "Norway",
    "helsinki": "Finland",
    "copenhagen": "Denmark",
    "moscow": "Russia",
    "st petersburg": "Russia",
    "warsaw": "Poland",
    "prague": "Czech Republic",
    "budapest": "Hungary",
    "bucharest": "Romania",
    "sofia": "Bulgaria",
    "athens": "Greece",
    "new york": "United States",
    "los angeles": "United States",
    "chicago": "United States",
    "miami": "United States",
    "toronto": "Canada",
    "vancouver": "Canada",
    "montreal": "Canada",
    "buenos aires": "Argentina",
    "sao paulo": "Brazil",
    "rio de janeiro": "Brazil",
    "lima": "Peru",
    "bogota": "Colombia",
    "santiago": "Chile",
    "caracas": "Venezuela",
    "tokyo": "Japan",
    "osaka": "Japan",
    "beijing": "China",
    "shanghai": "China",
    "guangzhou": "China"
  };
  
  const lowerLocation = locationName.toLowerCase();
  return cityMapping[lowerLocation] || locationName;
}

// Function to format vaccine content like the source website
function formatVaccineContent(vaccine, description) {
  let content = '';
  
  // Extract main description and clean it up
  let mainDesc = description.split(/(?:Prevention|Vaccination|Country|Risk)/)[0].trim();
  
  // Use the helper function to clean duplicate names
  mainDesc = cleanVaccineDescription(vaccine, mainDesc);
  
  content += `<div class="th-main-description">
    <p>${mainDesc}</p>
  </div>`;
  
  // Show Prevention section if available
  if (vaccine.prevention) {
    content += `<div class="th-section">
      <h6 class="th-section-heading">Prevention</h6>
      <p>${vaccine.prevention}</p>
    </div>`;
  }
  
  // Show Vaccination section if available
  if (vaccine.vaccination) {
    content += `<div class="th-section">
      <h6 class="th-section-heading">${vaccine.name} vaccination</h6>
      <p>${vaccine.vaccination}</p>
    </div>`;
  }
  
  // Show Country-specific info if available
  if (vaccine.countrySpecific) {
    // Extract proper country-specific title from the content
    let countrySpecificTitle = `${vaccine.name} in this country`;
    let cleanedCountrySpecific = vaccine.countrySpecific;
    
    // Try to extract a better title from the countrySpecific content
    // Look for patterns like "Disease Name in Country" at the beginning
    const text = vaccine.countrySpecific.trim();
    
    // Find the "X in Y" pattern where we need to capture the full country name
    // Split by sentences first, then extract the title from the first part
    const firstSentence = text.split(/[.!?]/)[0].trim();
    
    if (firstSentence.includes(' in ')) {
      // Split the sentence into words and find where "in" appears
      const words = firstSentence.split(' ');
      const inIndex = words.findIndex(word => word.toLowerCase() === 'in');
      
      if (inIndex !== -1 && inIndex < words.length - 1) {
        // Take everything from the beginning up to and including "in"
        const beforeIn = words.slice(0, inIndex + 1);
        
        // For the country part, we need to be smarter about where it ends
        // Look for common patterns that indicate the end of a country name
        const afterIn = words.slice(inIndex + 1);
        let countryWords = [];
        
        for (let i = 0; i < afterIn.length; i++) {
          const word = afterIn[i];
          
                  // Stop if we hit words that typically start the next sentence
        if (['There', 'This', 'The', 'It', 'However', 'Most', 'Some', 'Many', 'All', 'Vaccination', 'Prevention', 'Typhoid', 'Rabies', 'Malaria', 'Dengue', 'Hepatitis', 'Yellow', 'Cholera', 'Tetanus', 'Travellers', 'Information', 'Symptoms', 'Treatment', 'Risk', 'Disease'].includes(word)) {
          break;
        }
          
          // Add the word to the country name
          countryWords.push(word);
          
          // If this word ends with common country name endings, we might be done
          // But continue if the next word might be part of the country name
          if (i < afterIn.length - 1) {
            const nextWord = afterIn[i + 1];
            // Don't stop if the next word looks like it could be part of a country name
            if (['Island', 'Islands', 'Republic', 'Federation', 'Kingdom', 'States', 'Emirates', 'Guinea', 'Polynesia', 'Caledonia'].includes(nextWord)) {
              continue;
            }
          }
        }
        
        if (countryWords.length > 0) {
          const fullTitle = [...beforeIn, ...countryWords].join(' ');
          
          // Verify this looks reasonable (at least 3 words total)
          if (fullTitle.split(' ').length >= 3) {
            countrySpecificTitle = fullTitle;
            
            // Remove the redundant title from the beginning of the content
            if (cleanedCountrySpecific.startsWith(countrySpecificTitle)) {
              cleanedCountrySpecific = cleanedCountrySpecific.substring(countrySpecificTitle.length).trim();
            }
          }
        }
      }
    }
    
    content += `<div class="th-section">
      <h6 class="th-section-heading">${countrySpecificTitle}</h6>
      <p>${cleanedCountrySpecific}</p>
    </div>`;
  }
  
  return content;
}

// Test function to verify data loading for real countries
window.testRealCountries = async function() {
  console.log('🧪 Testing data loading for real countries...');
  
  const testCountries = ['India', 'Thailand', 'Afghanistan', 'Bangladesh', 'Angola'];
  const dataLoader = new DataLoader();
  
  for (const country of testCountries) {
    try {
      const data = await dataLoader.loadCountryData([country]);
      const countryData = data[country];
      
      if (countryData) {
        console.log(`✅ ${country}:`, {
          mostTravellers: countryData.mostTravellers?.length || 0,
          someTravellers: countryData.someTravellers?.length || 0,
          malaria: countryData.malaria ? 'YES' : 'NO',
          enhanced: countryData.mostTravellers?.[0]?.vaccination ? 'YES' : 'NO'
        });
        
        // Detailed vaccine analysis
        if (countryData.mostTravellers && countryData.mostTravellers.length > 0) {
          const firstVaccine = countryData.mostTravellers[0];
          console.log(`🔬 ${country} - First vaccine (${firstVaccine.name}):`, {
            hasVaccination: !!firstVaccine.vaccination,
            hasCountrySpecific: !!firstVaccine.countrySpecific,
            hasAdditionalSections: !!(firstVaccine.additionalSections && firstVaccine.additionalSections.length > 0),
            fields: Object.keys(firstVaccine)
          });
        }
        
        // Test malaria specifically
        if (countryData.malaria) {
          console.log(`🦟 ${country} malaria:`, {
            riskAreas: countryData.malaria.riskAreas ? 'YES' : 'NO',
            specialRiskGroups: countryData.malaria.specialRiskGroups ? 'YES' : 'NO'
          });
        }
      } else {
        console.log(`❌ ${country}: NO DATA FOUND`);
      }
    } catch (error) {
      console.error(`❌ ${country}: ERROR -`, error);
    }
  }
  
  console.log('🧪 Test complete! Try: window.testRealCountries()');
};

// Function to find countries similar to what the user is looking for
window.findSimilarCountries = async function(searchTerm) {
  console.log(`🔍 Searching for countries similar to: "${searchTerm}"`);
  
  const dataLoader = new DataLoader();
  const allCountries = await dataLoader.getAllCountries();
  
  const matches = allCountries.filter(country => 
    country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    searchTerm.toLowerCase().includes(country.toLowerCase())
  );
  
  console.log(`📍 Found ${matches.length} similar countries:`, matches);
  
  // Also search for partial matches
  const words = searchTerm.split(/[,\s]+/).filter(w => w.length > 2);
  const partialMatches = allCountries.filter(country => 
    words.some(word => country.toLowerCase().includes(word.toLowerCase()))
  );
  
  console.log(`📍 Partial matches for words [${words.join(', ')}]:`, partialMatches);
  
  return { exactMatches: matches, partialMatches };
};

// Quick debug function to check Chrome file data for India
window.debugIndiaData = async function() {
  console.log('🇮🇳 Debugging India data pipeline...');
  
  try {
    const dataLoader = new DataLoader();
    
    // Step 1: Check region mapping
    const regionMap = await dataLoader.getCountryRegionMapping();
    const indiaRegion = regionMap['India'];
    console.log('📍 India is in region:', indiaRegion);
    
    // Step 2: Load region data directly
    if (indiaRegion) {
      const regionData = await dataLoader.loadRegionData(indiaRegion);
      const indiaRawData = regionData['India'];
      console.log('🗂️ Raw India data from Chrome file:', indiaRawData);
      
      // Step 3: Check decompression
      if (indiaRawData) {
        const decompressed = dataLoader.decompressCountryData(indiaRawData);
        console.log('📦 Decompressed India data:', decompressed);
        
        if (decompressed.mostTravellers && decompressed.mostTravellers[0]) {
          console.log('💉 First vaccine details:', decompressed.mostTravellers[0]);
        }
        
        if (decompressed.malaria) {
          console.log('🦟 Malaria data:', decompressed.malaria);
        } else {
          console.log('❌ No malaria data found in decompressed data');
        }
      } else {
        console.log('❌ No raw data found for India in Chrome files');
      }
    } else {
      console.log('❌ India not found in region mapping');
    }
  } catch (error) {
    console.error('❌ Error debugging India data:', error);
  }
};

setTimeout(() => {
  console.log('TravelGuard: Auto-testing fonts...');
  if (window.checkTravelGuardFonts) {
    window.checkTravelGuardFonts();
  }
}, 2000);
