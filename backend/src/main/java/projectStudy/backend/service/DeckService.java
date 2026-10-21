package projectStudy.backend.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import projectStudy.backend.dto.CreateCardRequest;
import projectStudy.backend.dto.CreateDeckRequest;
import projectStudy.backend.dto.RateCardRequest;
import projectStudy.backend.dto.UpdateCardRequest;
import projectStudy.backend.dto.UpdateDeckRequest;
import projectStudy.backend.exception.ResourceNotFoundException;
import projectStudy.backend.model.Card;
import projectStudy.backend.model.Deck;
import projectStudy.backend.repository.DeckRepository;

@Service

public class DeckService {

    private final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    public List<Deck> getDecks(String id) {
        return deckRepository.findByUserId(id);
    }

    public Deck createDeck(String userId, CreateDeckRequest request) {
        Deck deck = new Deck();
        deck.setUserId(userId);
        deck.setName(request.name());
        deck.setColor(request.color());
        deck.setTitle(request.title());
        deck.setDescription(request.description());
        return deckRepository.save(deck);
    }

    public void deleteDeck(String deckId, String userId) {
        Deck deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        deckRepository.delete(deck);
    }

    public Deck updateDeck(String deckId, String userId, UpdateDeckRequest request) {
        Deck deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        deck.setName(request.name());
        deck.setColor(request.color());
        deck.setTitle(request.title());
        deck.setDescription(request.description());
        return deckRepository.save(deck);
    }

    public Card addCard(String deckId, String userId, CreateCardRequest request) {
        Deck deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        Card card = new Card();
        card.setFront(request.front());
        card.setBack(request.back());

        deck.getCards().add(card);
        deckRepository.save(deck);
        return card;
    }

    public Card updateCard(String deckId, String cardId, String userId, UpdateCardRequest request) {
        Deck deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        Card card = deck.getCards().stream().filter(c -> c.getId().equals(cardId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        card.setFront(request.front());
        card.setBack(request.back());
        deckRepository.save(deck);
        return card;
    }

    public void deleteCard(String deckId, String cardId, String userId) {
        Deck deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        Card card = deck.getCards().stream().filter(c -> c.getId().equals(cardId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        deck.getCards().remove(card);
        deckRepository.save(deck);
    }

    public Card rateCard(String deckId, String cardId, String userId, RateCardRequest request) {
        Deck deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        Card card = deck.getCards().stream().filter(c -> c.getId().equals(cardId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        card.setDifficulty(request.difficulty());
        card.setLastStudied(Instant.now());
        deckRepository.save(deck);
        return card;
    }
}
