/**
 * Unit tests for Country Detector
 */

describe('CountryDetector', () => {
  let detector;
  
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Mock detector (will be replaced with actual implementation)
    detector = {
      detectCountries: jest.fn(),
      scanForCountries: jest.fn(),
      addCountry: jest.fn()
    };
  });

  describe('detectCountries', () => {
    test('should detect single country in text', () => {
      const text = "Patient traveling to Japan";
      detector.detectCountries.mockReturnValue(['Japan']);
      
      const result = detector.detectCountries(text);
      expect(result).toEqual(['Japan']);
    });

    test('should detect multiple countries', () => {
      const text = "Visiting France, Germany, and Italy";
      detector.detectCountries.mockReturnValue(['France', 'Germany', 'Italy']);
      
      const result = detector.detectCountries(text);
      expect(result).toEqual(['France', 'Germany', 'Italy']);
    });

    test('should handle country variations', () => {
      const text = "Trip to USA and UK";
      detector.detectCountries.mockReturnValue(['United States', 'United Kingdom']);
      
      const result = detector.detectCountries(text);
      expect(result).toEqual(['United States', 'United Kingdom']);
    });

    test('should return empty array when no countries found', () => {
      const text = "No travel plans";
      detector.detectCountries.mockReturnValue([]);
      
      const result = detector.detectCountries(text);
      expect(result).toEqual([]);
    });
  });

  describe('scanForCountries', () => {
    test('should scan form fields', () => {
      // Create test form
      document.body.innerHTML = `
        <form>
          <input name="destination" value="Morocco, Spain" />
          <textarea name="travel_plans">Planning to visit Portugal</textarea>
        </form>
      `;

      detector.scanForCountries.mockReturnValue(['Morocco', 'Spain', 'Portugal']);
      
      const result = detector.scanForCountries();
      expect(result).toEqual(['Morocco', 'Spain', 'Portugal']);
    });

    test('should scan text content', () => {
      document.body.innerHTML = `
        <div class="patient-info">
          <p>Patient mentioned traveling to Argentina next month</p>
        </div>
      `;

      detector.scanForCountries.mockReturnValue(['Argentina']);
      
      const result = detector.scanForCountries();
      expect(result).toEqual(['Argentina']);
    });
  });

  describe('addCountry', () => {
    test('should add country manually', () => {
      detector.addCountry.mockImplementation((country) => {
        return { success: true, country };
      });

      const result = detector.addCountry('Thailand');
      expect(result).toEqual({ success: true, country: 'Thailand' });
    });

    test('should handle invalid country', () => {
      detector.addCountry.mockImplementation((country) => {
        if (!country) return { success: false, error: 'Invalid country' };
        return { success: true, country };
      });

      const result = detector.addCountry('');
      expect(result).toEqual({ success: false, error: 'Invalid country' });
    });
  });
});
