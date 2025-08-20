/**
 * TravelGuard - Popup Launcher
 */

// DOM elements
let elements = {};

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', initializePopup);

async function initializePopup() {
  console.log('🏥 TravelGuard popup launcher initialized');
  
  // Cache DOM elements
  cacheElements();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load status
  await loadStatus();
}

function cacheElements() {
  elements = {
    // Launch buttons
    openSidebarBtn: document.getElementById('open-sidebar-btn'),
    scanPageBtn: document.getElementById('scan-page-btn'),
    searchCountryBtn: document.getElementById('search-country-btn'),
    
    // Status
    statusDot: document.getElementById('status-dot'),
    statusText: document.getElementById('status-text')
  };
}

function setupEventListeners() {
  // Launch buttons
  elements.openSidebarBtn.addEventListener('click', handleOpenSidebar);
  elements.scanPageBtn.addEventListener('click', handleScanPage);
  elements.searchCountryBtn.addEventListener('click', handleSearchCountry);
}

async function loadStatus() {
  try {
    // Load extension status
    const result = await chrome.storage.local.get(['medmeData']);
    const data = result.medmeData;
    
    if (data && data.countries && Object.keys(data.countries).length > 0) {
      elements.statusDot.style.color = '#28A745'; // Green
      elements.statusText.textContent = 'Ready';
    } else {
      elements.statusDot.style.color = '#FFA500'; // Orange
      elements.statusText.textContent = 'No Data';
    }
    
  } catch (error) {
    console.error('Error loading status:', error);
    elements.statusDot.style.color = '#E74C3C'; // Red
    elements.statusText.textContent = 'Error';
  }
}

async function handleOpenSidebar() {
  try {
    elements.openSidebarBtn.classList.add('loading');
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to open sidebar
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'openSidebar'
    });
    
    if (response && response.success) {
      // Close popup to show sidebar
      window.close();
    } else {
      throw new Error('Failed to open sidebar');
    }
    
  } catch (error) {
    console.error('Open sidebar error:', error);
    elements.openSidebarBtn.classList.remove('loading');
    
    // Show error briefly
    const originalText = elements.openSidebarBtn.querySelector('.btn-text').textContent;
    elements.openSidebarBtn.querySelector('.btn-text').textContent = 'Error - Try Again';
    
    setTimeout(() => {
      elements.openSidebarBtn.querySelector('.btn-text').textContent = originalText;
    }, 2000);
  }
}

async function handleScanPage() {
  try {
    elements.scanPageBtn.classList.add('loading');
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to scan and open sidebar
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'scanAndShow'
    });
    
    if (response && response.success) {
      // Close popup to show sidebar
      window.close();
    } else {
      throw new Error('Scan failed');
    }
    
  } catch (error) {
    console.error('Scan page error:', error);
    elements.scanPageBtn.classList.remove('loading');
    
    // Show error briefly
    const originalText = elements.scanPageBtn.querySelector('.btn-text').textContent;
    elements.scanPageBtn.querySelector('.btn-text').textContent = 'No Countries Found';
    
    setTimeout(() => {
      elements.scanPageBtn.querySelector('.btn-text').textContent = originalText;
    }, 2000);
  }
}

async function handleSearchCountry() {
  try {
    elements.searchCountryBtn.classList.add('loading');
    
    // Get active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Send message to content script to open sidebar in search mode
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'openSidebar',
      mode: 'search'
    });
    
    if (response && response.success) {
      // Close popup to show sidebar
      window.close();
    } else {
      throw new Error('Failed to open search');
    }
    
  } catch (error) {
    console.error('Search country error:', error);
    elements.searchCountryBtn.classList.remove('loading');
    
    // Show error briefly
    const originalText = elements.searchCountryBtn.querySelector('.btn-text').textContent;
    elements.searchCountryBtn.querySelector('.btn-text').textContent = 'Error - Try Again';
    
    setTimeout(() => {
      elements.searchCountryBtn.querySelector('.btn-text').textContent = originalText;
    }, 2000);
  }
}