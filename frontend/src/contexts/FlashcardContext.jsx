import { createContext, useContext, useReducer, useEffect } from 'react';

const FlashcardContext = createContext(null);

// Initial mock data
const INITIAL_DATA = {
  decks: [
    {
      id: 'deck-1',
      name: 'JavaScript Basics',
      color: 'violet',
      createdAt: '2026-07-01T10:00:00Z',
      cards: [
        { id: 'card-1', front: 'What is a closure?', back: 'A closure is a function that has access to its outer scope\'s variables even after the outer function has returned.', difficulty: null, lastStudied: null },
        { id: 'card-2', front: 'What does "hoisting" mean?', back: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of the current scope during compilation.', difficulty: null, lastStudied: null },
        { id: 'card-3', front: 'Difference between let, const, and var?', back: 'var is function-scoped and hoisted. let and const are block-scoped. const cannot be reassigned.', difficulty: null, lastStudied: null },
        { id: 'card-4', front: 'What is the event loop?', back: 'The event loop continuously checks the call stack and callback queue, pushing callbacks to the stack when it\'s empty.', difficulty: null, lastStudied: null },
        { id: 'card-5', front: 'What is a Promise?', back: 'A Promise is an object representing the eventual completion or failure of an asynchronous operation.', difficulty: null, lastStudied: null },
      ],
    },
    {
      id: 'deck-2',
      name: 'React Fundamentals',
      color: 'pink',
      createdAt: '2026-07-02T14:00:00Z',
      cards: [
        { id: 'card-6', front: 'What is JSX?', back: 'JSX is a syntax extension for JavaScript that looks similar to HTML and is used with React to describe UI.', difficulty: null, lastStudied: null },
        { id: 'card-7', front: 'What is a React Hook?', back: 'Hooks are functions that let you use state and other React features in function components.', difficulty: null, lastStudied: null },
        { id: 'card-8', front: 'What does useEffect do?', back: 'useEffect lets you perform side effects in function components — data fetching, subscriptions, DOM manipulation.', difficulty: null, lastStudied: null },
        { id: 'card-9', front: 'What is the Virtual DOM?', back: 'A lightweight copy of the real DOM. React diffs the virtual DOM to determine minimal real DOM updates.', difficulty: null, lastStudied: null },
      ],
    },
    {
      id: 'deck-3',
      name: 'CSS & Design',
      color: 'yellow',
      createdAt: '2026-07-03T09:00:00Z',
      cards: [
        { id: 'card-10', front: 'What is Flexbox?', back: 'A CSS layout model for arranging items in a container, providing alignment, direction, order, and sizing.', difficulty: null, lastStudied: null },
        { id: 'card-11', front: 'What is CSS Grid?', back: 'A 2D layout system for CSS, allowing you to create complex responsive layouts with rows and columns.', difficulty: null, lastStudied: null },
        { id: 'card-12', front: 'What is specificity?', back: 'The algorithm browsers use to determine which CSS rule applies: inline > ID > class > element.', difficulty: null, lastStudied: null },
      ],
    },
  ],
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_DECK': {
      const newDeck = {
        id: `deck-${generateId()}`,
        name: action.payload.name,
        color: action.payload.color || 'violet',
        createdAt: new Date().toISOString(),
        cards: [],
      };
      return { ...state, decks: [...state.decks, newDeck] };
    }
    case 'DELETE_DECK':
      return { ...state, decks: state.decks.filter(d => d.id !== action.payload) };
    case 'UPDATE_DECK':
      return {
        ...state,
        decks: state.decks.map(d =>
          d.id === action.payload.id ? { ...d, ...action.payload.data } : d
        ),
      };
    case 'ADD_CARD': {
      const newCard = {
        id: `card-${generateId()}`,
        front: action.payload.front,
        back: action.payload.back,
        difficulty: null,
        lastStudied: null,
      };
      return {
        ...state,
        decks: state.decks.map(d =>
          d.id === action.payload.deckId
            ? { ...d, cards: [...d.cards, newCard] }
            : d
        ),
      };
    }
    case 'EDIT_CARD':
      return {
        ...state,
        decks: state.decks.map(d =>
          d.id === action.payload.deckId
            ? {
                ...d,
                cards: d.cards.map(c =>
                  c.id === action.payload.cardId
                    ? { ...c, ...action.payload.data }
                    : c
                ),
              }
            : d
        ),
      };
    case 'DELETE_CARD':
      return {
        ...state,
        decks: state.decks.map(d =>
          d.id === action.payload.deckId
            ? { ...d, cards: d.cards.filter(c => c.id !== action.payload.cardId) }
            : d
        ),
      };
    case 'RATE_CARD':
      return {
        ...state,
        decks: state.decks.map(d =>
          d.id === action.payload.deckId
            ? {
                ...d,
                cards: d.cards.map(c =>
                  c.id === action.payload.cardId
                    ? { ...c, difficulty: action.payload.difficulty, lastStudied: new Date().toISOString() }
                    : c
                ),
              }
            : d
        ),
      };
    case 'LOAD_DATA':
      return action.payload;
    default:
      return state;
  }
}

const STORAGE_KEY = 'lea-flashcards';

export function FlashcardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_DATA, (initial) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addDeck = (name, color) => dispatch({ type: 'ADD_DECK', payload: { name, color } });
  const deleteDeck = (id) => dispatch({ type: 'DELETE_DECK', payload: id });
  const updateDeck = (id, data) => dispatch({ type: 'UPDATE_DECK', payload: { id, data } });
  const addCard = (deckId, front, back) => dispatch({ type: 'ADD_CARD', payload: { deckId, front, back } });
  const editCard = (deckId, cardId, data) => dispatch({ type: 'EDIT_CARD', payload: { deckId, cardId, data } });
  const deleteCard = (deckId, cardId) => dispatch({ type: 'DELETE_CARD', payload: { deckId, cardId } });
  const rateCard = (deckId, cardId, difficulty) => dispatch({ type: 'RATE_CARD', payload: { deckId, cardId, difficulty } });

  const totalDecks = state.decks.length;
  const totalCards = state.decks.reduce((sum, d) => sum + d.cards.length, 0);

  const value = {
    decks: state.decks,
    addDeck,
    deleteDeck,
    updateDeck,
    addCard,
    editCard,
    deleteCard,
    rateCard,
    totalDecks,
    totalCards,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcards() {
  const context = useContext(FlashcardContext);
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardProvider');
  }
  return context;
}
