// Mock the 'web-vitals' module
jest.mock('web-vitals', () => ({
    getCLS: jest.fn(),
    getFID: jest.fn(),
    getFCP: jest.fn(),
    getLCP: jest.fn(),
    getTTFB: jest.fn()
  }));
  
  const reportWebVitals = require('./reportWebVitals').default;
  
  describe('reportWebVitals', () => {  
    it('does not call web vitals functions if onPerfEntry is not a function', async () => {
      reportWebVitals(null);
  
      // Wait for any possible promises inside reportWebVitals to resolve
      await new Promise(process.nextTick);
  
      // Get references to the mocked functions
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = require('web-vitals');
  
      // None of the web vitals functions should have been called
      expect(getCLS).not.toHaveBeenCalled();
      expect(getFID).not.toHaveBeenCalled();
      expect(getFCP).not.toHaveBeenCalled();
      expect(getLCP).not.toHaveBeenCalled();
      expect(getTTFB).not.toHaveBeenCalled();
    });
  });
  