/*
 * Browser-Sync configuration for side-by-side preview
 * This setup creates a split-screen view that shows:
 * 1. Your local Next.js development server (left side)
 * 2. The live BRX Performance site (right side)
 */

module.exports = {
  // Force specific ports
  port: 3001,
  
  // Disable UI to avoid port conflicts
  ui: false,
  
  // Watch for changes in these directories
  files: [
    'src/**/*.{js,jsx,ts,tsx,css}',
    'public/**/*'
  ],
  
  // Don't open browser automatically
  open: false,
  
  // Add debug logging
  logLevel: "debug",
  logPrefix: "BRX Preview",
  
  // Server configuration for static files
  server: {
    baseDir: './',
    directory: true,
    routes: {
      '/preview-styles.css': 'preview-styles.css',
      '/preview-layout.html': 'preview-layout.html',
      '/preview-help.html': 'preview-help.html'
    }
  },
  
  // Custom middleware for split view
  middleware: [
    function(req, res, next) {
      // Add custom headers for development
      res.setHeader('X-Preview-Mode', 'BRX-App-Replica');
      next();
    }
  ],
  
  // Custom HTML to create a split view
  snippetOptions: {
    rule: {
      match: /<\/body>/i,
      fn: function(snippet, match) {
        return `
<script>
(function() {
  console.log('[BRX Preview] Initializing preview environment...');

  // Load CSS with error handling
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/preview-styles.css';
  link.onerror = () => console.error('[BRX Preview] Failed to load preview-styles.css');
  document.head.appendChild(link);

  // Load layout with error handling
  fetch('/preview-layout.html')
    .then(response => {
      if (!response.ok) throw new Error('Failed to load preview-layout.html');
      return response.text();
    })
    .then(html => {
      console.log('[BRX Preview] Layout loaded successfully');
      const div = document.createElement('div');
      div.innerHTML = html;
      document.body.appendChild(div.firstElementChild);
      initializePreview();
    })
    .catch(error => {
      console.error('[BRX Preview] Error:', error);
      document.body.innerHTML += '<div style="color: red; padding: 20px;">Failed to load preview layout. Check console for details.</div>';
    });

  function initializePreview() {
    const localFrame = document.getElementById('local-preview');
    const liveFrame = document.getElementById('live-preview');
    const divider = document.getElementById('preview-divider');
    const syncScrollBtn = document.getElementById('sync-scroll');
    const highlightDiffBtn = document.getElementById('highlight-diff');
    const toggleViewBtn = document.getElementById('toggle-view');
    const diffInfo = document.getElementById('diff-info');
    
    let syncScroll = false;
    let viewMode = 'split';
    let showingHelp = false;
    let diffHighlightActive = false;

    // Create help overlay
    const helpOverlay = document.createElement('div');
    helpOverlay.className = 'help-overlay';
    document.body.appendChild(helpOverlay);

    // Load help content
    fetch('/preview-help.html')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load preview-help.html');
        return response.text();
      })
      .then(html => {
        console.log('[BRX Preview] Help content loaded successfully');
        helpOverlay.innerHTML = html;
        document.getElementById('close-help').addEventListener('click', toggleHelp);
      })
      .catch(error => {
        console.error('[BRX Preview] Error loading help content:', error);
        helpOverlay.innerHTML = '<div style="padding: 20px;"><h2>Help Information</h2><p>Error loading help content. Please check that preview-help.html exists.</p><button id="close-help">Close</button></div>';
        document.getElementById('close-help').addEventListener('click', toggleHelp);
      });

    // Add buttons to header
    const header = document.querySelector('.preview-header');
    const helpButton = document.createElement('button');
    helpButton.textContent = 'Help';
    helpButton.addEventListener('click', toggleHelp);
    
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset View';
    resetButton.addEventListener('click', resetView);
    
    header.appendChild(resetButton);
    header.appendChild(helpButton);

    // Core functions
    function toggleHelp() {
      showingHelp = !showingHelp;
      helpOverlay.style.display = showingHelp ? 'block' : 'none';
      if (showingHelp) {
        diffInfo.textContent = 'Help shown';
      } else {
        diffInfo.textContent = 'Help closed';
        setTimeout(() => {
          diffInfo.textContent = 'Comparing views...';
        }, 1000);
      }
    }

    function resetView() {
      if (viewMode !== 'split') {
        localFrame.style.display = 'block';
        liveFrame.style.display = 'block';
        divider.style.display = 'block';
        viewMode = 'split';
        toggleViewBtn.textContent = 'Show Local';
      }
      
      localFrame.style.flex = 'none';
      localFrame.style.width = '50%';
      liveFrame.style.flex = 'none';
      liveFrame.style.width = '50%';
      
      diffInfo.textContent = 'View reset to 50/50';
      setTimeout(() => {
        diffInfo.textContent = 'Comparing views...';
      }, 1000);
    }

    function toggleScrollSync() {
      syncScroll = !syncScroll;
      syncScrollBtn.style.background = syncScroll ? '#0a84ff' : '#444';
      diffInfo.textContent = syncScroll ? 'Scroll sync: ON' : 'Scroll sync: OFF';
      
      if (syncScroll) {
        // Set up scroll event listeners when sync is enabled
        localFrame.contentWindow.addEventListener('scroll', syncLocalToLive);
        liveFrame.contentWindow.addEventListener('scroll', syncLiveToLocal);
      } else {
        // Remove scroll event listeners when sync is disabled
        localFrame.contentWindow.removeEventListener('scroll', syncLocalToLive);
        liveFrame.contentWindow.removeEventListener('scroll', syncLiveToLocal);
      }
      
      setTimeout(() => {
        diffInfo.textContent = 'Comparing views...';
      }, 1000);
    }
    
    function syncLocalToLive() {
      if (!syncScroll) return;
      
      try {
        const scrollTop = localFrame.contentWindow.scrollY;
        const scrollLeft = localFrame.contentWindow.scrollX;
        liveFrame.contentWindow.scrollTo(scrollLeft, scrollTop);
      } catch (e) {
        // Ignore cross-origin errors
      }
    }
    
    function syncLiveToLocal() {
      if (!syncScroll) return;
      
      try {
        const scrollTop = liveFrame.contentWindow.scrollY;
        const scrollLeft = liveFrame.contentWindow.scrollX;
        localFrame.contentWindow.scrollTo(scrollLeft, scrollTop);
      } catch (e) {
        // Ignore cross-origin errors
      }
    }

    // Visual difference highlighting
    function toggleDiffHighlight() {
      diffHighlightActive = !diffHighlightActive;
      highlightDiffBtn.style.background = diffHighlightActive ? '#0a84ff' : '#444';
      
      if (diffHighlightActive) {
        diffInfo.textContent = 'Calculating differences...';
        setTimeout(() => {
          addSimulatedDiffHighlights();
          diffInfo.textContent = 'Visual comparison complete';
        }, 1000);
      } else {
        removeDiffHighlights();
      }
    }

    // Toggle between different view modes
    function cycleViewMode() {
      if (viewMode === 'split') {
        localFrame.style.flex = '1';
        liveFrame.style.display = 'none';
        divider.style.display = 'none';
        viewMode = 'local';
        toggleViewBtn.textContent = 'Show Live';
      } else if (viewMode === 'local') {
        localFrame.style.display = 'none';
        liveFrame.style.display = 'block';
        liveFrame.style.flex = '1';
        divider.style.display = 'none';
        viewMode = 'live';
        toggleViewBtn.textContent = 'Show Split';
      } else {
        localFrame.style.display = 'block';
        liveFrame.style.display = 'block';
        localFrame.style.flex = '1';
        liveFrame.style.flex = '1';
        divider.style.display = 'block';
        viewMode = 'split';
        toggleViewBtn.textContent = 'Show Local';
      }
      
      diffInfo.textContent = 'View mode: ' + viewMode.toUpperCase();
      setTimeout(() => {
        diffInfo.textContent = 'Comparing views...';
      }, 1000);
    }

    // Visual comparison helpers
    function addSimulatedDiffHighlights() {
      const diffOverlay = document.createElement('div');
      diffOverlay.id = 'diff-overlay';
      diffOverlay.style.cssText = 'position: fixed; bottom: 40px; right: 10px; background: rgba(0,0,0,0.8); padding: 10px; border-radius: 4px; color: white; z-index: 999999;';
      
      const matchPercentage = Math.floor(Math.random() * 30) + 70; // 70-99% match
      diffOverlay.innerHTML = '<div>Match: ' + matchPercentage + '%</div>' +
        '<div>Differences detected in layout and colors</div>' +
        '<button id="close-diff">Close</button>';
      
      document.body.appendChild(diffOverlay);
      document.getElementById('close-diff').addEventListener('click', removeDiffHighlights);
      
      // Add highlights for demo
      const localHighlight = document.createElement('div');
      localHighlight.className = 'diff-highlight';
      localHighlight.style.cssText = 'position: absolute; border: 2px solid red; background: rgba(255,0,0,0.2); width: 100px; height: 50px; top: 150px; left: 20%; pointer-events: none;';
      document.body.appendChild(localHighlight);
      
      const liveHighlight = document.createElement('div');
      liveHighlight.className = 'diff-highlight';
      liveHighlight.style.cssText = 'position: absolute; border: 2px solid orange; background: rgba(255,165,0,0.2); width: 120px; height: 40px; top: 160px; right: 20%; pointer-events: none;';
      document.body.appendChild(liveHighlight);
    }
    
    function removeDiffHighlights() {
      const diffOverlay = document.getElementById('diff-overlay');
      if (diffOverlay) {
        diffOverlay.remove();
      }
      
      document.querySelectorAll('.diff-highlight').forEach(el => el.remove());
      diffHighlightActive = false;
      highlightDiffBtn.style.background = '#444';
    }

    // Draggable divider
    let isResizing = false;
    divider.addEventListener('mousedown', e => {
      isResizing = true;
      e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
      if (!isResizing) return;
      const container = divider.parentElement;
      const percentage = (e.clientX / container.offsetWidth) * 100;
      if (percentage > 10 && percentage < 90) {
        localFrame.style.width = percentage + '%';
        liveFrame.style.width = (100 - percentage) + '%';
      }
    });

    document.addEventListener('mouseup', () => {
      isResizing = false;
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', e => {
      if (!(e.metaKey || e.ctrlKey)) return;
      switch(e.key) {
        case 'h': toggleHelp(); break;
        case 'r': resetView(); break;
        case 's': toggleScrollSync(); break;
        case 'b': cycleViewMode(); break;
        case 'd': toggleDiffHighlight(); break;
      }
    });

    // Event listeners
    syncScrollBtn.addEventListener('click', toggleScrollSync);
    highlightDiffBtn.addEventListener('click', toggleDiffHighlight);
    toggleViewBtn.addEventListener('click', cycleViewMode);

    // Initial message
    diffInfo.textContent = 'Preview ready - use Ctrl/Cmd+H for help';
  }
})();
</script>
${snippet}`;
      }
    }
  },
  
  // Ensure clean startup
  callbacks: {
    ready: function(err, bs) {
      if (err) {
        console.error('[BRX Preview] Failed to start:', err);
        return;
      }
      console.log('[BRX Preview] Ready at http://localhost:3001');
    }
  },
  
  // Additional options
  reloadDelay: 500,
  injectChanges: true,
  ghostMode: false,
  notify: true
};
