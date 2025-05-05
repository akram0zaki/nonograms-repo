// Import any testing libraries or setup global mocks here

// Mock browser APIs not available in jsdom
global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));

// Mock localStorage
if (!global.localStorage) {
  global.localStorage = {
    getItem: (key) => global.localStorage[key] || null,
    setItem: (key, value) => global.localStorage[key] = value,
    removeItem: (key) => delete global.localStorage[key],
    clear: () => Object.keys(global.localStorage).forEach(key => {
      if (key !== 'getItem' && key !== 'setItem' && key !== 'removeItem' && key !== 'clear') {
        delete global.localStorage[key];
      }
    })
  };
}

// Mock matchMedia which isn't implemented in jsdom
if (!global.matchMedia) {
  global.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {}
  });
}

// Set up any global test timeouts
const FIVE_SECONDS = 5000;
vi.setConfig({
  testTimeout: FIVE_SECONDS
}); 