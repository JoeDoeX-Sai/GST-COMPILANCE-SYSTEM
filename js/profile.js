// ─── Profile Panel ────────────────────────────────────────────────────────────
const ProfilePanel = {
  _open: false,

  // ── Open ────────────────────────────────────────────────────────────────────
  open() {
    document.getElementById('profile-panel').classList.add('open');
    document.getElementById('profile-panel-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    this._open = true;
    // Hide chatbot FAB and any open chat window so they don't overlap
    this._setChatVisible(false);
    this.load();
    this.switchTab('profile');
  },

  // ── Close ───────────────────────────────────────────────────────────────────
  close() {
    document.getElementById('profile-panel').classList.remove('open');
    document.getElementById('profile-panel-overlay').classList.remove('open');
    document.body.style.overflow = '';
    this._open = false;
    // Restore chatbot only for non-admins
    if (!RBAC.isAdmin()) this._setChatVisible(true);
  },

  // ── Chatbot visibility helper ────────────────────────────────────────────────
  _setChatVisible(visible) {
    const fab   = document.getElementById('chat-fab');
    const win   = document.getElementById('chat-window');
    const admin = document.getElementById('chat-admin-panel');
    const v = visible ? '' : 'none';
    if (fab)   fab.style.display   = v;
    if (win)   win.style.display   = v;
    if (admin) admin.style.display = v;
  },

  // ── Tab switching ────────────────────────────────────────────────────────────
  switchTab(tab) {
    document.querySelectorAll('.pp-tab').forEach(el =>
      el.classList.toggle('active', el.dataset.tab === tab)
    );
    document.querySelectorAll('.pp-tab-content').forEach(el =>
      el.classList.add('hidden')
    );
    const target = document.getElementById(`pp-tab-${tab}`);
    if (target) target.classList.remove('hidden');
    ['pp-profile-msg', 'pp-password-msg'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });
    if (tab === 'gst') this.loadGST();
    if (tab === 'settings') this.loadSettings();
  },

  // ── Load profile data ────────────────────────────────────────────────────────
  async load() {
    try {
      const res = await API.get('/auth/profile');
      const u = res.data;
      const initial = (u.name || '?').charAt(0).toUpperCase();
      document.getElementById('pp-avatar').textContent = initial;
      document.getElementById('pp-name').textContent = u.name || '—';
      document.getElementById('pp-email').textContent = u.email || '—';
      const roleBadge = document.getElementById('pp-role-badge');
      const isAdm = u.role === 'admin';
      roleBadge.textContent = isAdm ? 'Admin' : 'Accountant';
      roleBadge.className = `pp-role-badge pp-role-${isAdm ? 'admin' : 'accountant'}`;
      document.getElementById('pp-field-name').value = u.name || '';
      document.getElementById('pp-field-email').value = u.email || '';
      document.getElementById('pp-field-phone').value = u.phone || '';
    } catch(e) {
      this._showMsg('pp-profile-msg', 'error', 'Failed to load profile data.');
    }
  },

  // ── Save profile ─────────────────────────────────────────────────────────────
  async saveProfile() {
    const name  = document.getElementById('pp-field-name').value.trim();
    const email = document.getElementById('pp-field-email').value.trim();
    const phone = document.getElementById('pp-field-phone').value.trim();

    if (!name)  { this._showMsg('pp-profile-msg', 'error', 'Name is required.'); return; }
    if (!email) { this._showMsg('pp-profile-msg', 'error', 'Email address is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this._showMsg('pp-profile-msg', 'error', 'Please enter a valid email address.'); return;
    }

    const btn = document.getElementById('pp-save-profile-btn');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
      await API.put('/auth/profile', { name, email, phone });
      App.user = { ...App.user, name, email, phone };
      App.renderSidebar();
      document.getElementById('pp-avatar').textContent = name.charAt(0).toUpperCase();
      document.getElementById('pp-name').textContent = name;
      document.getElementById('pp-email').textContent = email;
      this._showMsg('pp-profile-msg', 'success', 'Profile updated successfully.');
    } catch(e) {
      this._showMsg('pp-profile-msg', 'error', e.message || 'Failed to update profile.');
    } finally {
      btn.disabled = false; btn.textContent = 'Save Changes';
    }
  },

  // ── Change password ──────────────────────────────────────────────────────────
  async changePassword() {
    const cur  = document.getElementById('pp-cur-pw').value;
    const nw   = document.getElementById('pp-new-pw').value;
    const conf = document.getElementById('pp-conf-pw').value;

    if (!cur)  { this._showMsg('pp-password-msg', 'error', 'Current password is required.'); return; }
    if (!nw)   { this._showMsg('pp-password-msg', 'error', 'New password is required.'); return; }
    if (nw.length < 6) { this._showMsg('pp-password-msg', 'error', 'New password must be at least 6 characters.'); return; }
    if (nw !== conf)   { this._showMsg('pp-password-msg', 'error', 'Passwords do not match.'); return; }

    const btn = document.getElementById('pp-save-pw-btn');
    btn.disabled = true; btn.textContent = 'Updating...';
    try {
      await API.post('/auth/change-password', { currentPassword: cur, newPassword: nw });
      document.getElementById('pp-cur-pw').value = '';
      document.getElementById('pp-new-pw').value = '';
      document.getElementById('pp-conf-pw').value = '';
      this._showMsg('pp-password-msg', 'success', 'Password updated successfully.');
    } catch(e) {
      const msg = e.message?.toLowerCase().includes('incorrect')
        ? 'Current password is incorrect.'
        : (e.message || 'Failed to update password.');
      this._showMsg('pp-password-msg', 'error', msg);
    } finally {
      btn.disabled = false; btn.textContent = 'Update Password';
    }
  },

  // ── GST section ──────────────────────────────────────────────────────────────
  loadGST() {
    const el = document.getElementById('pp-gst-content');
    const isAdmin = RBAC.isAdmin();
    const businesses = App.businesses || [];
    const currentBiz = App.currentBiz;

    if (!businesses.length) {
      el.innerHTML = `
        <div class="empty-state" style="padding:24px;text-align:center">
          <div class="empty-title" style="margin-bottom:6px">No Business Assigned</div>
          <div class="empty-sub" style="margin-bottom:16px">${isAdmin
            ? 'No businesses have been added yet.'
            : 'No business has been assigned to your account.'}</div>
          ${isAdmin
            ? `<button class="btn btn-primary btn-sm" onclick="ProfilePanel.go('businesses')">Add Business</button>`
            : `<button class="btn btn-secondary btn-sm" onclick="ProfilePanel.switchTab('settings')">Contact Administrator</button>`}
        </div>`;
      return;
    }

    if (isAdmin) {
      el.innerHTML = `
        <div class="pp-section-label">Business Overview</div>
        <div class="pp-gst-stat-row">
          <div class="pp-gst-stat">
            <div class="pp-gst-stat-value">${businesses.length}</div>
            <div class="pp-gst-stat-label">Total Businesses</div>
          </div>
          <div class="pp-gst-stat">
            <div class="pp-gst-stat-value">${currentBiz ? currentBiz.gstin?.substring(0,2) : '—'}</div>
            <div class="pp-gst-stat-label">Active State</div>
          </div>
        </div>
        <div class="pp-section-label" style="margin-top:12px">Registered GSTINs</div>
        <div class="pp-gstin-list">
          ${businesses.map(b => `
            <div class="pp-gstin-item ${currentBiz && String(b.id||b._id) === String(currentBiz.id||currentBiz._id) ? 'active' : ''}">
              <div style="min-width:0">
                <div class="pp-gstin-name">${escHtml(b.trade_name || b.legal_name)}</div>
                <div class="pp-gstin-code">${escHtml(b.gstin)}</div>
              </div>
              ${String(b.id||b._id) !== String(currentBiz?.id||currentBiz?._id)
                ? `<button class="btn btn-xs btn-secondary" onclick="switchBusiness('${b.id||b._id}');ProfilePanel.close()">Switch</button>`
                : `<span class="badge badge-green" style="font-size:0.6rem;flex-shrink:0">Active</span>`}
            </div>`).join('')}
        </div>
        <div class="pp-gst-actions">
          <button class="btn btn-secondary w-full" onclick="ProfilePanel.go('businesses')">Manage Businesses</button>
          <button class="btn btn-secondary w-full" onclick="ProfilePanel.downloadReport()">Download GST Report</button>
        </div>`;
    } else {
      el.innerHTML = `
        <div class="pp-section-label">Assigned Business</div>
        ${currentBiz ? `
          <div class="pp-biz-detail-card">
            <div class="pp-biz-detail-row">
              <span class="pp-biz-detail-label">Business Name</span>
              <span class="pp-biz-detail-value">${escHtml(currentBiz.trade_name || currentBiz.legal_name)}</span>
            </div>
            <div class="pp-biz-detail-row">
              <span class="pp-biz-detail-label">GSTIN</span>
              <span class="pp-biz-detail-value font-mono">${escHtml(currentBiz.gstin)}</span>
            </div>
            <div class="pp-biz-detail-row">
              <span class="pp-biz-detail-label">State</span>
              <span class="pp-biz-detail-value">${escHtml(STATE_CODES[currentBiz.state_code] || currentBiz.state_code || '—')}</span>
            </div>
            <div class="pp-biz-detail-row">
              <span class="pp-biz-detail-label">Registration</span>
              <span class="pp-biz-detail-value">${escHtml(currentBiz.registration_type || 'Regular')}</span>
            </div>
          </div>
          ${businesses.length > 1 ? `
            <div class="pp-section-label" style="margin-top:4px">Switch Business</div>
            <div class="pp-gstin-list">
              ${businesses.map(b => `
                <div class="pp-gstin-item ${String(b.id||b._id) === String(currentBiz.id||currentBiz._id) ? 'active' : ''}">
                  <div style="min-width:0">
                    <div class="pp-gstin-name">${escHtml(b.trade_name || b.legal_name)}</div>
                    <div class="pp-gstin-code">${escHtml(b.gstin)}</div>
                  </div>
                  ${String(b.id||b._id) !== String(currentBiz.id||currentBiz._id)
                    ? `<button class="btn btn-xs btn-secondary" onclick="switchBusiness('${b.id||b._id}');ProfilePanel.close()">Switch</button>`
                    : `<span class="badge badge-green" style="font-size:0.6rem;flex-shrink:0">Active</span>`}
                </div>`).join('')}
            </div>` : ''}
          <div class="pp-gst-actions">
            <button class="btn btn-secondary w-full" onclick="ProfilePanel.downloadReport()">Download GST Summary</button>
          </div>` : `
          <div class="empty-state" style="padding:24px;text-align:center">
            <div class="empty-title" style="margin-bottom:6px">No Business Assigned</div>
            <div class="empty-sub" style="margin-bottom:16px">No business has been assigned to your account.</div>
            <button class="btn btn-secondary btn-sm" onclick="ProfilePanel.switchTab('settings')">Contact Administrator</button>
          </div>`}`;
    }
  },

  // ── Settings section ─────────────────────────────────────────────────────────
  loadSettings() {
    const el = document.getElementById('pp-settings-content');
    const isAdmin = RBAC.isAdmin();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const currentCurrency = CURRENCY.current || 'INR';
    const roleClass = App.user?.role === 'admin' ? 'badge-red' : App.user?.role === 'viewer' ? 'badge-gray' : 'badge-blue';

    el.innerHTML = `
      <!-- Appearance -->
      <div class="pp-section-label">Appearance</div>
      <div class="pp-settings-row">
        <div class="pp-settings-row-info">
          <div class="pp-settings-row-label">Theme</div>
          <div class="pp-settings-row-sub">Switch between light and dark mode</div>
        </div>
        <button class="pp-settings-toggle-btn" id="pp-theme-btn" onclick="ProfilePanel.toggleTheme()" title="Toggle theme">
          ${currentTheme === 'light'
            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> Light`
            : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> Dark`}
        </button>
      </div>

      <div class="pp-settings-row">
        <div class="pp-settings-row-info">
          <div class="pp-settings-row-label">Currency</div>
          <div class="pp-settings-row-sub">Display amounts in selected currency</div>
        </div>
        <select class="pp-settings-select" onchange="ProfilePanel.setCurrency(this.value)">
          <option value="INR" ${currentCurrency === 'INR' ? 'selected' : ''}>INR — Indian Rupee</option>
          <option value="USD" ${currentCurrency === 'USD' ? 'selected' : ''}>USD — US Dollar</option>
          <option value="EUR" ${currentCurrency === 'EUR' ? 'selected' : ''}>EUR — Euro</option>
        </select>
      </div>

      <div class="pp-divider"></div>

      <!-- Account info -->
      <div class="pp-section-label">Account</div>
      <div class="pp-settings-info-card">
        <div class="pp-biz-detail-row">
          <span class="pp-biz-detail-label">Name</span>
          <span class="pp-biz-detail-value">${escHtml(App.user?.name || '—')}</span>
        </div>
        <div class="pp-biz-detail-row">
          <span class="pp-biz-detail-label">Role</span>
          <span class="pp-biz-detail-value"><span class="badge ${roleClass}">${App.user?.role || '—'}</span></span>
        </div>
        <div class="pp-biz-detail-row">
          <span class="pp-biz-detail-label">Businesses</span>
          <span class="pp-biz-detail-value">${App.businesses?.length || 0}</span>
        </div>
        <div class="pp-biz-detail-row">
          <span class="pp-biz-detail-label">Version</span>
          <span class="pp-biz-detail-value font-mono text-accent">2.0.0</span>
        </div>
      </div>

      <div class="pp-divider"></div>

      ${isAdmin ? `
      <!-- Admin: Data Management -->
      <div class="pp-section-label">Data Management</div>
      <div class="pp-settings-info-card" style="margin-bottom:10px">
        <div class="pp-biz-detail-row">
          <span class="pp-biz-detail-label">Database</span>
          <span class="pp-biz-detail-value font-mono">MongoDB</span>
        </div>
      </div>
      <button class="btn btn-secondary w-full" onclick="ProfilePanel.downloadBackup()">Download Database Backup</button>
      ` : `
      <!-- Non-admin: Contact Administrator -->
      <div class="pp-section-label">Support</div>
      <div class="pp-settings-info-card">
        <div class="pp-biz-detail-row" style="flex-direction:column;gap:4px;align-items:flex-start">
          <span class="pp-biz-detail-label">Administrator Contact</span>
          <span class="pp-biz-detail-value font-mono text-accent">admin@gst.local</span>
        </div>
        <div style="font-size:0.75rem;color:var(--text3);margin-top:4px">
          For business access, data requests, or system-level changes, contact your administrator.
        </div>
      </div>
      `}`;
  },

  // ── Settings actions ─────────────────────────────────────────────────────────
  toggleTheme() {
    App.toggleTheme();
    // Re-render settings tab to reflect new theme label
    this.loadSettings();
  },

  setCurrency(cur) {
    CURRENCY.current = cur;
    localStorage.setItem('gst_currency', cur);
    // Update topbar currency selector to stay in sync
    const sel = document.getElementById('currency-select');
    if (sel) sel.value = cur;
    toast(`Currency set to ${cur}`, 'info');
  },

  downloadBackup() {
    const token = localStorage.getItem('gst_token');
    const a = document.createElement('a');
    a.href = `/api/backup?token=${token}`;
    a.download = `gst_backup_${new Date().toISOString().split('T')[0]}.db`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Downloading backup...', 'info');
  },

  // ── Quick navigation ─────────────────────────────────────────────────────────
  go(page) {
    this.close();
    Pages.navigate(page);
  },

  // ── Download GST report ──────────────────────────────────────────────────────
  downloadReport() {
    const bizId = App.currentBiz?.id;
    if (!bizId) { toast('No business selected', 'error'); return; }
    const token = localStorage.getItem('gst_token');
    const a = document.createElement('a');
    a.href = `/api/export/dashboard-report?business_id=${bizId}&token=${token}`;
    a.download = 'gst_summary.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast('Downloading GST summary...', 'info');
  },

  // ── Inline message helper ────────────────────────────────────────────────────
  _showMsg(containerId, type, text) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = `<div class="alert alert-${type === 'success' ? 'success' : 'danger'}" style="margin-bottom:12px">${escHtml(text)}</div>`;
    if (type === 'success') setTimeout(() => { if (el) el.innerHTML = ''; }, 4000);
  },
};

// Close panel on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && ProfilePanel._open) ProfilePanel.close();
});
