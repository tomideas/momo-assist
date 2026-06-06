/* js/storage.js — Storage abstraction with auto-cleanup
   Depends on: nothing (standalone) */

'use strict';

const StorageHelper = {
  /* Max sessions before auto-cleanup triggers */
  MAX_SESSIONS: 200,
  /* Sessions older than this (ms) are candidates for cleanup */
  SESSION_MAX_AGE_MS: 90 * 24 * 60 * 60 * 1000, // 90 days

  /* ── Session persistence ── */
  async loadSessions() {
    try {
      const { sessions } = await chrome.storage.local.get('sessions');
      return Array.isArray(sessions) ? sessions : [];
    } catch (e) {
      console.error('[Storage] loadSessions failed:', e);
      return [];
    }
  },

  async saveSessions(sessions) {
    try {
      await chrome.storage.local.set({ sessions });
    } catch (e) {
      console.error('[Storage] saveSessions failed:', e);
      // If quota exceeded, try cleanup then retry
      if (e.message?.includes('QUOTA_BYTES')) {
        console.warn('[Storage] Quota exceeded, running cleanup...');
        const cleaned = this.cleanupSessions(sessions);
        await chrome.storage.local.set({ sessions: cleaned });
      }
    }
  },

  /* ── Auto-cleanup: remove old/empty sessions when limit exceeded ── */
  cleanupSessions(sessions) {
    if (!Array.isArray(sessions) || sessions.length <= this.MAX_SESSIONS) return sessions;

    const now = Date.now();
    const cutoff = now - this.SESSION_MAX_AGE_MS;

    // Sort by last activity (most recent first)
    const sorted = [...sessions].sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt || 0;
      const bTime = b.updatedAt || b.createdAt || 0;
      return bTime - aTime;
    });

    // Keep recent sessions, remove old empty ones first
    const keep = [];
    const removeCandidates = [];

    for (const s of sorted) {
      const lastActive = s.updatedAt || s.createdAt || 0;
      const messageCount = s.messages?.filter(m => m.role !== 'system').length || 0;

      if (lastActive < cutoff && messageCount <= 1) {
        // Old and empty/minimal — candidate for removal
        removeCandidates.push(s);
      } else {
        keep.push(s);
      }
    }

    // If still over limit, trim oldest from keep list
    if (keep.length > this.MAX_SESSIONS) {
      const excess = keep.splice(this.MAX_SESSIONS);
      console.log(`[Storage] Trimmed ${excess.length} oldest sessions`);
    }

    if (removeCandidates.length > 0) {
      console.log(`[Storage] Cleaned up ${removeCandidates.length} old/empty sessions`);
    }

    return keep;
  },

  /* ── Prompts (sync storage) ── */
  async loadPrompts() {
    try {
      const { prompts, selectedPromptId } = await chrome.storage.sync.get(['prompts', 'selectedPromptId']);
      return { prompts: prompts || null, selectedPromptId: selectedPromptId || null };
    } catch (e) {
      console.error('[Storage] loadPrompts failed:', e);
      return { prompts: null, selectedPromptId: null };
    }
  },

  async savePrompts(prompts, selectedPromptId) {
    try {
      await chrome.storage.sync.set({ prompts, selectedPromptId });
    } catch (e) {
      console.error('[Storage] savePrompts failed:', e);
    }
  },

  /* ── Provider configs (local storage) ── */
  async loadProviderConfigs() {
    try {
      const { providerConfigs, customModels, activeProvider } =
        await chrome.storage.local.get(['providerConfigs', 'customModels', 'activeProvider']);
      return { providerConfigs, customModels, activeProvider };
    } catch (e) {
      console.error('[Storage] loadProviderConfigs failed:', e);
      return {};
    }
  },

  /* ── Generic get/set wrappers ── */
  async get(keys) {
    return chrome.storage.local.get(keys);
  },

  async set(data) {
    return chrome.storage.local.set(data);
  },

  async getSync(keys) {
    return chrome.storage.sync.get(keys);
  },

  async setSync(data) {
    return chrome.storage.sync.set(data);
  }
};

const AttachmentStore = {
  DB_NAME: 'momo-bud-attachments',
  DB_VERSION: 1,
  STORE_NAME: 'attachments',
  _dbPromise: null,

  open() {
    if (this._dbPromise) return this._dbPromise;
    this._dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });
          store.createIndex('sessionId', 'sessionId', { unique: false });
          store.createIndex('messageTs', 'messageTs', { unique: false });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return this._dbPromise;
  },

  async put(record) {
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readwrite');
      tx.objectStore(this.STORE_NAME).put(record);
      tx.oncomplete = () => resolve(record);
      tx.onerror = () => reject(tx.error);
    });
  },

  async get(id) {
    if (!id) return null;
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const req = tx.objectStore(this.STORE_NAME).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async listBySession(sessionId) {
    if (!sessionId) return [];
    const db = await this.open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.STORE_NAME, 'readonly');
      const req = tx.objectStore(this.STORE_NAME).index('sessionId').getAll(sessionId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  },

  async saveImage(img, meta = {}) {
    const id = meta.id || (crypto?.randomUUID?.() || `att-${Date.now()}-${Math.random().toString(16).slice(2)}`);
    const record = {
      id,
      kind: meta.kind || 'image',
      source: meta.source || 'upload',
      sessionId: meta.sessionId || '',
      messageTs: meta.messageTs || 0,
      name: img.name || meta.name || 'image',
      type: img.type || meta.type || 'image/jpeg',
      data: img.data || '',
      size: img.data ? Math.ceil(img.data.length * 3 / 4) : 0,
      createdAt: meta.createdAt || Date.now(),
      lastAccessedAt: Date.now()
    };
    await this.put(record);
    return this.toRef(record);
  },

  async saveImages(images, meta = {}) {
    const refs = [];
    for (const img of Array.isArray(images) ? images : []) {
      refs.push(await this.saveImage(img, meta));
    }
    return refs;
  },

  async getDataUrl(id) {
    const record = await this.get(id);
    if (!record?.data) return '';
    record.lastAccessedAt = Date.now();
    this.put(record).catch(() => {});
    return `data:${record.type || 'image/jpeg'};base64,${record.data}`;
  },

  toRef(record) {
    return {
      id: record.id,
      kind: record.kind || 'image',
      source: record.source || 'upload',
      name: record.name || 'image',
      type: record.type || 'image/jpeg',
      size: record.size || 0,
      createdAt: record.createdAt || Date.now()
    };
  }
};

window.AttachmentStore = AttachmentStore;
