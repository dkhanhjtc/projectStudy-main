import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFlashcards } from '../contexts/FlashcardContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import {
  Plus,
  Trash2,
  Edit3,
  ArrowLeft,
  Layers,
  BookOpen,
  ChevronRight,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

const deckColorOptions = [
  { value: 'violet', label: 'Violet', class: 'bg-accent' },
  { value: 'pink', label: 'Pink', class: 'bg-secondary' },
  { value: 'yellow', label: 'Yellow', class: 'bg-tertiary' },
  { value: 'mint', label: 'Mint', class: 'bg-quaternary' },
];

const deckColorMap = {
  violet: 'violet',
  pink: 'pink',
  yellow: 'yellow',
  mint: 'mint',
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function FlashcardsPage() {
  const { decks, addDeck, deleteDeck, addCard, editCard, deleteCard } = useFlashcards();
  
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [isStudying, setIsStudying] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  
  const [deckName, setDeckName] = useState('');
  const [deckColor, setDeckColor] = useState('violet');
  const [cardFront, setCardFront] = useState('');
  const [cardBack, setCardBack] = useState('');

  const activeDeck = decks.find(d => d.id === selectedDeck);
  const currentStudyCard = activeDeck?.cards[studyIndex];

  // Deck CRUD
  const handleCreateDeck = () => {
    if (!deckName.trim()) return;
    addDeck(deckName.trim(), deckColor);
    setDeckName('');
    setDeckColor('violet');
    setShowDeckModal(false);
  };

  const handleDeleteDeck = (id) => {
    if (selectedDeck === id) setSelectedDeck(null);
    deleteDeck(id);
  };

  // Card CRUD
  const handleSaveCard = () => {
    if (!cardFront.trim() || !cardBack.trim() || !selectedDeck) return;
    if (editingCard) {
      editCard(selectedDeck, editingCard.id, { front: cardFront.trim(), back: cardBack.trim() });
    } else {
      addCard(selectedDeck, cardFront.trim(), cardBack.trim());
    }
    setCardFront('');
    setCardBack('');
    setEditingCard(null);
    setShowCardModal(false);
  };

  const openEditCard = (card) => {
    setEditingCard(card);
    setCardFront(card.front);
    setCardBack(card.back);
    setShowCardModal(true);
  };

  const openNewCard = () => {
    setEditingCard(null);
    setCardFront('');
    setCardBack('');
    setShowCardModal(true);
  };

  const startStudying = () => {
    setIsStudying(true);
    setStudyIndex(0);
    setIsFlipped(false);
  };

  const stopStudying = () => {
    setIsStudying(false);
    setIsFlipped(false);
  };

  const handleNextCard = () => {
    if (studyIndex < activeDeck.cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setStudyIndex(prev => prev + 1), 150);
    }
  };

  const handlePrevCard = () => {
    if (studyIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setStudyIndex(prev => prev - 1), 150);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!selectedDeck ? (
          /* ====== DECK LIST VIEW ====== */
          <motion.div
            key="deck-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div>
                <h1 className="font-heading text-3xl font-extrabold max-md:text-2xl">
                  Flashcards Manager
                </h1>
                <p className="text-muted-foreground mt-1">Create and organize your study decks</p>
              </div>
              <Button
                icon={Plus}
                iconPosition="left"
                onClick={() => setShowDeckModal(true)}
              >
                New Deck
              </Button>
            </div>

            {/* Deck Grid */}
            {decks.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {decks.map((deck) => (
                  <motion.div key={deck.id} variants={itemVariants}>
                    <Card variant="clean" hover className="overflow-hidden p-0! group cursor-pointer" onClick={() => setSelectedDeck(deck.id)}>
                      {/* Color header */}
                      <div className={`
                        h-3 w-full
                        ${deckColorOptions.find(c => c.value === deck.color)?.class || 'bg-accent'}
                      `} />
                      <div className="p-5">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`
                              w-10 h-10 rounded-full
                              ${deckColorOptions.find(c => c.value === deck.color)?.class || 'bg-accent'}
                              flex items-center justify-center
                            `}>
                              <Layers size={18} strokeWidth={2.5} className="text-white" />
                            </div>
                            <div>
                              <h3 className="font-heading font-bold text-base">{deck.name}</h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {deck.cards.length} card{deck.cards.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteDeck(deck.id); }}
                            className="
                              p-1.5 rounded-full text-muted-foreground
                              hover:text-destructive hover:bg-destructive/10
                              transition-colors cursor-pointer
                            "
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                          <Badge color={deckColorMap[deck.color]} size="sm">
                            {deck.color.charAt(0).toUpperCase() + deck.color.slice(1)}
                          </Badge>
                          <ChevronRight size={16} strokeWidth={2.5} className="text-muted-foreground" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card variant="clean" hover={false} className="!p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-5">
                  <Layers size={36} strokeWidth={2.5} className="text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-xl">No decks yet!</h3>
                <p className="text-muted-foreground mt-2 mb-5 max-w-sm mx-auto">
                  Create your first flashcard deck to start studying
                </p>
                <Button icon={Plus} iconPosition="left" onClick={() => setShowDeckModal(true)}>
                  Create First Deck
                </Button>
              </Card>
            )}
          </motion.div>
        ) : isStudying ? (
          /* ====== STUDY VIEW (FLIP CARDS) ====== */
          <motion.div
            key="study-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="max-w-2xl mx-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <Button variant="secondary" icon={ArrowLeft} onClick={stopStudying}>
                Hủy (Back)
              </Button>
              <Badge color="violet">
                {studyIndex + 1} / {activeDeck.cards.length}
              </Badge>
            </div>

            {/* Flashcard */}
            <div className="perspective-1000 mb-8" style={{ perspective: '1000px' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentStudyCard?.id}-${studyIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="cursor-pointer"
                    style={{ perspective: '1000px' }}
                  >
                    <motion.div
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      style={{ transformStyle: 'preserve-3d' }}
                      className="relative"
                    >
                      {/* Front */}
                      <div
                        className={`
                          bg-card border border-border
                          rounded-[var(--radius-lg)]
                          p-10 min-h-[300px]
                          flex flex-col items-center justify-center text-center
                          ${isFlipped ? 'invisible' : ''}
                        `}
                        style={{ backfaceVisibility: 'hidden' }}
                      >
                        <Badge color="violet" size="sm" className="mb-4">Question</Badge>
                        <p className="font-heading text-2xl font-bold max-md:text-xl">{currentStudyCard?.front}</p>
                        <p className="text-xs text-muted-foreground mt-8 flex items-center gap-1">
                          <RotateCcw size={12} /> Tap to flip
                        </p>
                      </div>

                      {/* Back */}
                      <div
                        className={`
                          absolute inset-0
                          bg-accent/10 border border-accent
                          rounded-[var(--radius-lg)]
                          p-10 min-h-[300px]
                          flex flex-col items-center justify-center text-center
                          ${!isFlipped ? 'invisible' : ''}
                        `}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      >
                        <Badge color="pink" size="sm" className="mb-4">Answer</Badge>
                        <p className="text-lg leading-relaxed font-medium text-foreground">{currentStudyCard?.back}</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <Button 
                variant="secondary" 
                disabled={studyIndex === 0} 
                onClick={handlePrevCard}
                icon={ArrowLeft}
              >
                Previous
              </Button>
              
              {!isFlipped && (
                <Button variant="primary" onClick={() => setIsFlipped(true)} icon={RotateCcw}>
                  Flip Card
                </Button>
              )}
              
              <Button 
                variant={studyIndex === activeDeck.cards.length - 1 ? 'secondary' : 'primary'}
                disabled={studyIndex === activeDeck.cards.length - 1} 
                onClick={handleNextCard}
                icon={ArrowRight}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </motion.div>
        ) : (
          /* ====== CARD LIST VIEW ====== */
          <motion.div
            key="card-list"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDeck(null)}
                  className="
                    w-10 h-10 rounded-full
                    border border-border
                    flex items-center justify-center
                    hover:bg-muted transition-colors
                    cursor-pointer
                  "
                >
                  <ArrowLeft size={18} strokeWidth={2.5} />
                </button>
                <div>
                  <h1 className="font-heading text-2xl font-extrabold">{activeDeck?.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    {activeDeck?.cards.length} card{activeDeck?.cards.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button icon={Plus} iconPosition="left" variant="secondary" onClick={openNewCard}>
                  Add Card
                </Button>
                {activeDeck?.cards.length > 0 && (
                  <Button icon={BookOpen} iconPosition="left" variant="primary" onClick={startStudying}>
                    Tiếp tục (Study)
                  </Button>
                )}
              </div>
            </div>

            {/* Cards List */}
            {activeDeck?.cards.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {activeDeck.cards.map((card, i) => (
                  <motion.div key={card.id} variants={itemVariants}>
                    <Card variant="clean" hover={false} shadow="default" className="!p-4">
                      <div className="flex items-start gap-4">
                        {/* Number */}
                        <div className="
                          w-8 h-8 rounded-full bg-muted
                          border border-border
                          flex items-center justify-center flex-shrink-0
                          font-bold text-sm text-muted-foreground
                        ">
                          {i + 1}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="grid md:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-accent mb-1">Front (Question)</p>
                              <p className="text-sm font-medium">{card.front}</p>
                            </div>
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">Back (Answer)</p>
                              <p className="text-sm text-muted-foreground">{card.back}</p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => openEditCard(card)}
                            className="
                              p-2 rounded-full text-muted-foreground
                              hover:text-accent hover:bg-accent/10
                              transition-colors cursor-pointer
                            "
                          >
                            <Edit3 size={14} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => deleteCard(selectedDeck, card.id)}
                            className="
                              p-2 rounded-full text-muted-foreground
                              hover:text-destructive hover:bg-destructive/10
                              transition-colors cursor-pointer
                            "
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <Card variant="clean" hover={false} className="!p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-muted border border-border flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={28} strokeWidth={2.5} className="text-muted-foreground" />
                </div>
                <h4 className="font-heading font-bold">This deck is empty</h4>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Add your first flashcard to start studying</p>
                <Button icon={Plus} iconPosition="left" onClick={openNewCard}>
                  Add First Card
                </Button>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== CREATE DECK MODAL ====== */}
      <Modal isOpen={showDeckModal} onClose={() => setShowDeckModal(false)} title="Create New Deck">
        <div className="flex flex-col gap-4">
          <Input
            id="deck-name"
            label="Deck Name"
            placeholder="e.g., JavaScript Basics"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Color</p>
            <div className="flex gap-3">
              {deckColorOptions.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setDeckColor(c.value)}
                  className={`
                    w-10 h-10 rounded-full ${c.class}
                    border-2 transition-all cursor-pointer
                    ${deckColor === c.value
                      ? 'border-foreground shadow-[var(--shadow-pop-sm)] scale-110'
                      : 'border-transparent hover:border-border'
                    }
                  `}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <Button onClick={handleCreateDeck} className="w-full mt-2" icon={Plus} iconPosition="left">
            Create Deck
          </Button>
        </div>
      </Modal>

      {/* ====== ADD/EDIT CARD MODAL ====== */}
      <Modal
        isOpen={showCardModal}
        onClose={() => { setShowCardModal(false); setEditingCard(null); }}
        title={editingCard ? 'Edit Card' : 'Add New Card'}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
              Front (Question)
            </label>
            <textarea
              value={cardFront}
              onChange={(e) => setCardFront(e.target.value)}
              placeholder="Type your question here..."
              className="
                w-full px-4 py-3 min-h-[80px] resize-y
                bg-input border border-border rounded-[var(--radius-md)]
                text-foreground text-sm
                placeholder:text-muted-foreground/50
                transition-all duration-300
                focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent
              "
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-1.5">
              Back (Answer)
            </label>
            <textarea
              value={cardBack}
              onChange={(e) => setCardBack(e.target.value)}
              placeholder="Type the answer here..."
              className="
                w-full px-4 py-3 min-h-[80px] resize-y
                bg-input border border-border rounded-[var(--radius-md)]
                text-foreground text-sm
                placeholder:text-muted-foreground/50
                transition-all duration-300
                focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary
              "
            />
          </div>
          <Button onClick={handleSaveCard} className="w-full mt-2">
            {editingCard ? 'Save Changes' : 'Add Card'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
