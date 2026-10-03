/* eslint-disable no-unused-vars */
/**
 * API service layer — currently mock implementations.
 * When the Spring Boot backend is ready, swap these with real fetch calls.
 *
 * All functions return Promises to match real API behavior.
 */

const BASE_URL = '/api'; // Will point to Spring Boot backend

// ---- Flashcard API ----
export const flashcardApi = {
  getDecks: async () => {
    // TODO: return fetch(`${BASE_URL}/decks`).then(r => r.json());
    return Promise.resolve([]);
  },

  createDeck: async (data) => {
    // TODO: return fetch(`${BASE_URL}/decks`, { method: 'POST', body: JSON.stringify(data) }).then(r => r.json());
    return Promise.resolve({ id: Date.now(), ...data });
  },

  deleteDeck: async (id) => {
    // TODO: return fetch(`${BASE_URL}/decks/${id}`, { method: 'DELETE' });
    return Promise.resolve();
  },

  addCard: async (deckId, card) => {
    // TODO: return fetch(`${BASE_URL}/decks/${deckId}/cards`, { method: 'POST', body: JSON.stringify(card) }).then(r => r.json());
    return Promise.resolve({ id: Date.now(), ...card });
  },

  updateCard: async (deckId, cardId, data) => {
    // TODO: return fetch(`${BASE_URL}/decks/${deckId}/cards/${cardId}`, { method: 'PUT', body: JSON.stringify(data) }).then(r => r.json());
    return Promise.resolve(data);
  },

  deleteCard: async (deckId, cardId) => {
    // TODO: return fetch(`${BASE_URL}/decks/${deckId}/cards/${cardId}`, { method: 'DELETE' });
    return Promise.resolve();
  },
};

// ---- Stats API ----
export const statsApi = {
  getWeeklyStats: async () => {
    // TODO: return fetch(`${BASE_URL}/stats/weekly`).then(r => r.json());
    return Promise.resolve([]);
  },

  logStudyTime: async (minutes) => {
    // TODO: return fetch(`${BASE_URL}/stats/log`, { method: 'POST', body: JSON.stringify({ minutes }) });
    return Promise.resolve();
  },
};

// ---- Profile API ----
export const profileApi = {
  getProfile: async () => {
    // TODO: return fetch(`${BASE_URL}/profile`).then(r => r.json());
    return Promise.resolve({});
  },

  updateProfile: async (data) => {
    // TODO: return fetch(`${BASE_URL}/profile`, { method: 'PUT', body: JSON.stringify(data) });
    return Promise.resolve(data);
  },

  setGoal: async (goal) => {
    // TODO: return fetch(`${BASE_URL}/profile/goal`, { method: 'PUT', body: JSON.stringify(goal) });
    return Promise.resolve(goal);
  },
};

// ---- Home API ----
export const homeApi = {
  getHomeData: async () => {
    const response = await fetch(`${BASE_URL}/home`);
    if (!response.ok) {
      throw new Error('Failed to fetch home data');
    }
    return response.json();
  },
};

