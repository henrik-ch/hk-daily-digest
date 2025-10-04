module.exports.document = function (input_section, navbar_section) {
  return `<!doctype html>
  <html lang="en">
  
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <!-- <meta name="author" content="Mark Otto, Jacob Thornton, and Bootstrap contributors"> -->
    <meta name="generator" content="Hugo 0.88.1">
    <!-- <title>Top navbar example · Bootstrap v5.1</title> -->
  
    <title>Daily RSS Digest Tech</title>
  
  
    <!-- <link rel="canonical" href="https://getbootstrap.com/docs/5.1/examples/navbar-static/"> -->
  
  
  
    <!-- Bootstrap core CSS -->
    <link href="./bootstrap-5.1.3-dist/css/bootstrap.min.css" rel="stylesheet">
  
    <style>
      .bd-placeholder-img {
        font-size: 1.125rem;
        text-anchor: middle;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
      }
  
      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }
    </style>
  
  
    <!-- Custom styles for this template -->
    <link href="navbar-top.css" rel="stylesheet">
    <style>
      /* Unread links extra bold; read links thin */
      #accordionDigest li > a { font-weight: 800; }
      #accordionDigest li.read > a { font-weight: 300; }
      .accordion-button.has-unread { font-weight: 800; }
    </style>
  </head>
  
  <body>
  
    <nav class="navbar navbar-expand-md navbar-dark bg-dark mb-4">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Daily Digest</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
          ${navbar_section}
          </ul>
          <!-- <form class="d-flex">
            <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Search</button>
          </form> -->
        </div>
      </div>
    </nav>
  
    <main class="container">
      <div class="bg-light p-5 rounded">
        <!-- <h1>Navbar example</h1>
        <p class="lead">This example is a quick exercise to illustrate how the top-aligned navbar works. As you scroll,
          this navbar remains in its original position and moves with the rest of the page.</p> -->
  
        <div class="d-flex justify-content-end align-items-center mb-2">
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggleSortUnread">
            <label class="form-check-label" for="toggleSortUnread">Sort by unread</label>
          </div>
        </div>

        <div class="accordion" id="accordionDigest">
        ${input_section}
        </div>
  
  
        <!-- <a class="btn btn-lg btn-primary" href="../components/navbar/" role="button">View navbar docs &raquo;</a> -->
      </div>
    </main>
  
    <script src="./bootstrap-5.1.3-dist/js/bootstrap.bundle.min.js"></script>
    <script>
      (function() {
        function safeGet(key) {
          try {
            return localStorage.getItem(key);
          } catch (_) { return null; }
        }

        function safeSet(key, value) {
          try {
            localStorage.setItem(key, value);
          } catch (_) { /* ignore */ }
        }

        function loadStore() {
          const raw = safeGet('visitedLinks');
          if (!raw) return {};
          try { return JSON.parse(raw) || {}; } catch { return {}; }
        }

        function saveStore(store) {
          safeSet('visitedLinks', JSON.stringify(store));
        }

        function normalize(href) {
          try { return new URL(href, window.location.href).toString(); }
          catch { return href; }
        }

        function formatUTC(ts) {
          try {
            const d = new Date(ts);
            if (isNaN(d)) return '';
            const iso = d.toISOString(); // YYYY-MM-DDTHH:mm:ss.sssZ
            return iso.slice(0,16).replace('T',' ') + ' GMT';
          } catch { return ''; }
        }

        function updateAccordionHeadline(item) {
          if (!item) return;
          const button = item.querySelector('.accordion-button');
          if (!button) return;
          const hasUnread = item.querySelector('li:not(.read) > a[href]');
          button.classList.toggle('has-unread', !!hasUnread);
        }

        function updateAccordionHeadlines(container) {
          if (!container) return;
          const items = container.querySelectorAll('.accordion-item');
          items.forEach(updateAccordionHeadline);
        }

        function markAsRead(anchor, timestamp) {
          const li = anchor.closest('li');
          if (li) li.classList.add('read');
          if (!anchor.dataset.originalTitle) {
            anchor.dataset.originalTitle = anchor.getAttribute('title') || '';
          }
          const formatted = formatUTC(timestamp);
          if (formatted) {
            anchor.setAttribute('title', 'Last visited: ' + formatted);
          }
          updateAccordionHeadline(anchor.closest('.accordion-item'));
        }

        function unmarkAsRead(anchor) {
          const li = anchor.closest('li');
          if (li) li.classList.remove('read');
          if (anchor.dataset.originalTitle !== undefined) {
            anchor.setAttribute('title', anchor.dataset.originalTitle);
          } else {
            anchor.removeAttribute('title');
          }
          updateAccordionHeadline(anchor.closest('.accordion-item'));
        }

        function applyReadStates() {
          const store = loadStore();
          const container = document.getElementById('accordionDigest');
          if (!container) return;
          const anchors = container.querySelectorAll('a[href]');
          anchors.forEach(a => {
            const key = normalize(a.href);
            if (store[key]) {
              markAsRead(a, store[key]);
            }
          });
          updateAccordionHeadlines(container);
        }

        function recordVisit(anchor) {
          const key = normalize(anchor.href);
          const now = Date.now();
          const store = loadStore();
          store[key] = now;
          saveStore(store);
          markAsRead(anchor, now);
        }

        function setupHandlers() {
          const container = document.getElementById('accordionDigest');
          if (!container) return;

          function collapseAllAccordions() {
            const buttons = container.querySelectorAll('.accordion-button');
            buttons.forEach(btn => {
              btn.classList.add('collapsed');
              btn.setAttribute('aria-expanded', 'false');
            });
            const panels = container.querySelectorAll('.accordion-collapse');
            panels.forEach(panel => {
              const bootstrapCollapse = window.bootstrap && window.bootstrap.Collapse;
              if (bootstrapCollapse) {
                bootstrapCollapse.getOrCreateInstance(panel, { toggle: false }).hide();
              } else {
                panel.classList.remove('show');
              }
            });
          }

          function checkAndDisableSort(prefKey, sortToggle) {
            if (!sortToggle) return;
            if (sortToggle.checked) {
              sortToggle.checked = false;
            }
            if (prefKey) safeSet(prefKey, 'off');
          }

          function resetPageUI(prefKey, sortToggle, restoreFn) {
            collapseAllAccordions();
            if (typeof restoreFn === 'function') {
              restoreFn();
            }
            checkAndDisableSort(prefKey, sortToggle);
          }

          // Handle per-accordion buttons
          container.addEventListener('click', function(e) {
            const btn = e.target.closest('[data-action]');
            if (!btn || !container.contains(btn)) return;
            const item = btn.closest('.accordion-item');
            if (!item) return;
            if (btn.dataset.action === 'mark-all-read') {
              const anchors = item.querySelectorAll('a[href]');
              const now = Date.now();
              const store = loadStore();
              anchors.forEach(a => {
                const key = normalize(a.href);
                store[key] = now;
                markAsRead(a, now);
              });
              saveStore(store);
              resetPageUI(prefKey, sortToggle, restoreOriginalOrder);
              updateAccordionHeadline(item);
            } else if (btn.dataset.action === 'reset-read-state') {
              const anchors = item.querySelectorAll('a[href]');
              const store = loadStore();
              anchors.forEach(a => {
                const key = normalize(a.href);
                delete store[key];
                unmarkAsRead(a);
              });
              saveStore(store);
              resetPageUI(prefKey, sortToggle, restoreOriginalOrder);
              updateAccordionHeadline(item);
            }
          });

          // Sorting toggle
          const sortToggle = document.getElementById('toggleSortUnread');
          let prefKey = null;
          function getSectionTitle(item){
            const btn = item.querySelector('.accordion-header .accordion-button');
            return btn ? btn.textContent.trim() : '';
          }
          function getUnreadCount(item, store){
            const anchors = item.querySelectorAll('a[href]');
            let unread = 0;
            anchors.forEach(a => { if (!store[normalize(a.href)]) unread++; });
            return unread;
          }
          function assignOriginalIndices(){
            const items = Array.from(container.querySelectorAll('.accordion-item'));
            items.forEach((it, idx) => { if (!it.dataset.originalIndex) it.dataset.originalIndex = String(idx); });
          }
          function sortByUnread(){
            const store = loadStore();
            const items = Array.from(container.querySelectorAll('.accordion-item'));
            items.sort((a, b) => {
              const ca = getUnreadCount(a, store);
              const cb = getUnreadCount(b, store);
              if (cb !== ca) return cb - ca; // desc unread
              return getSectionTitle(a).localeCompare(getSectionTitle(b));
            });
            items.forEach(it => container.appendChild(it));
          }
          function restoreOriginalOrder(){
            const items = Array.from(container.querySelectorAll('.accordion-item'));
            items.sort((a, b) => (parseInt(a.dataset.originalIndex||'0',10) - parseInt(b.dataset.originalIndex||'0',10)));
            items.forEach(it => container.appendChild(it));
          }
          function resortIfEnabled(){
            if (sortToggle && sortToggle.checked) sortByUnread();
          }
          assignOriginalIndices();
          if (sortToggle) {
            // Optional: remember preference per-page
            prefKey = 'sortByUnread:' + location.pathname;
            const pref = safeGet(prefKey);
            if (pref === 'on') sortToggle.checked = true;
            sortToggle.addEventListener('change', function(){
              if (sortToggle.checked) {
                sortByUnread();
                safeSet(prefKey, 'on');
              } else {
                restoreOriginalOrder();
                safeSet(prefKey, 'off');
              }
            });
          }

          function handleEvent(e) {
            const a = e.target.closest('a[href]');
            if (!a || !container.contains(a)) return;
            // Record on left click or middle click without blocking navigation
            if (e.type === 'click' && e.button === 0) {
              recordVisit(a);
              resortIfEnabled();
            } else if (e.type === 'auxclick' && e.button === 1) {
              recordVisit(a);
              resortIfEnabled();
            }
          }

          container.addEventListener('click', handleEvent);
          container.addEventListener('auxclick', handleEvent);
        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function(){
            applyReadStates();
            setupHandlers();
            // If toggle is on (from pref), apply sort
            const sortToggle = document.getElementById('toggleSortUnread');
            if (sortToggle && sortToggle.checked) {
              const container = document.getElementById('accordionDigest');
              if (container) {
                // Need functions defined in setupHandlers scope; quickly recompute here
                const items = Array.from(container.querySelectorAll('.accordion-item'));
                items.forEach((it, idx) => { if (!it.dataset.originalIndex) it.dataset.originalIndex = String(idx); });
              }
            }
          });
        } else {
          applyReadStates();
          setupHandlers();
        }
      })();
    </script>
  </body>
  
  </html>`;
}
