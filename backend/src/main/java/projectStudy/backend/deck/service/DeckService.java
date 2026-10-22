package projectStudy.backend.deck.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;

import projectStudy.backend.deck.dto.CreateDeckRequest;
import projectStudy.backend.deck.dto.UpdateDeckRequest;
import projectStudy.backend.deck.entity.DeckEntity;
import projectStudy.backend.deck.repository.DeckRepository;
import projectStudy.backend.card.dto.CreateCardRequest;
import projectStudy.backend.card.dto.RateCardRequest;
import projectStudy.backend.card.dto.UpdateCardRequest;
import projectStudy.backend.card.entity.CardEntity;
import projectStudy.backend.common.exception.ResourceNotFoundException;

@Service

public class DeckService {

    private final DeckRepository deckRepository;

    public DeckService(DeckRepository deckRepository) {
        this.deckRepository = deckRepository;
    }

    public List<DeckEntity> getDecks(String id) {
        return deckRepository.findByUserId(id);
    }

    public DeckEntity createDeck(String userId, CreateDeckRequest request) {
        DeckEntity deck = new DeckEntity();
        deck.setUserId(userId);
        deck.setName(request.name());
        deck.setColor(request.color());
        deck.setTitle(request.title());
        deck.setDescription(request.description());
        return deckRepository.save(deck);
    }

    public void deleteDeck(String deckId, String userId) {
        DeckEntity deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        deckRepository.delete(deck);
    }

    public DeckEntity updateDeck(String deckId, String userId, UpdateDeckRequest request) {
        DeckEntity deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        deck.setName(request.name());
        deck.setColor(request.color());
        deck.setTitle(request.title());
        deck.setDescription(request.description());
        return deckRepository.save(deck);
    }

    public CardEntity addCard(String deckId, String userId, CreateCardRequest request) {
        DeckEntity deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        CardEntity card = new CardEntity();
        card.setFront(request.front());
        card.setBack(request.back());

        deck.getCards().add(card);
        deckRepository.save(deck);
        return card;
    }

    public CardEntity updateCard(String deckId, String cardId, String userId, UpdateCardRequest request) {
        DeckEntity deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        CardEntity card = deck.getCards().stream().filter(c -> c.getId().equals(cardId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        card.setFront(request.front());
        card.setBack(request.back());
        deckRepository.save(deck);
        return card;
    }

    public void deleteCard(String deckId, String cardId, String userId) {
        DeckEntity deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        CardEntity card = deck.getCards().stream().filter(c -> c.getId().equals(cardId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        deck.getCards().remove(card);
        deckRepository.save(deck);
    }

    public CardEntity rateCard(String deckId, String cardId, String userId, RateCardRequest request) {
        DeckEntity deck = deckRepository.findByIdAndUserId(deckId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));
        CardEntity card = deck.getCards().stream().filter(c -> c.getId().equals(cardId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Card not found"));
        card.setDifficulty(request.difficultyEntity());
        card.setLastStudied(Instant.now());
        deckRepository.save(deck);
        return card;
    }
}
