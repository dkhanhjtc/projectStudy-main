package projectStudy.backend.deck.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import projectStudy.backend.card.dto.CreateCardRequest;
import projectStudy.backend.card.dto.RateCardRequest;
import projectStudy.backend.card.dto.UpdateCardRequest;
import projectStudy.backend.card.entity.CardEntity;
import projectStudy.backend.deck.dto.CreateDeckRequest;
import projectStudy.backend.deck.dto.UpdateDeckRequest;
import projectStudy.backend.deck.entity.DeckEntity;
import projectStudy.backend.deck.service.DeckService;

import java.util.List;

@RestController
@RequestMapping("/api/decks")
@CrossOrigin(origins = "*")
public class DeckController {

    private final DeckService deckService;

    private static final String TEMP_USER_ID = "demo-user";

    public DeckController(DeckService deckService) {
        this.deckService = deckService;
    }

    @GetMapping
    public List<DeckEntity> getAllDecks() {
        return deckService.getDecks(TEMP_USER_ID);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DeckEntity createDeck(@RequestBody CreateDeckRequest request) {
        return deckService.createDeck(TEMP_USER_ID, request);
    }

    @PutMapping("/{deckId}")
    public DeckEntity updateDeck(
            @PathVariable String deckId,
            @RequestBody UpdateDeckRequest request) {
        return deckService.updateDeck(deckId, TEMP_USER_ID, request);
    }

    @DeleteMapping("/{deckId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteDeck(@PathVariable String deckId) {
        deckService.deleteDeck(deckId, TEMP_USER_ID);
    }

    @PostMapping("/{deckId}/cards")
    @ResponseStatus(HttpStatus.CREATED)
    public CardEntity addCard(
            @PathVariable String deckId,
            @RequestBody CreateCardRequest request) {
        return deckService.addCard(deckId, TEMP_USER_ID, request);
    }

    @PutMapping("/{deckId}/cards/{cardId}")
    public CardEntity updateCard(
            @PathVariable String deckId,
            @PathVariable String cardId,
            @RequestBody UpdateCardRequest request) {
        return deckService.updateCard(
                deckId,
                cardId,
                TEMP_USER_ID,
                request
        );
    }

    @DeleteMapping("/{deckId}/cards/{cardId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(
            @PathVariable String deckId,
            @PathVariable String cardId) {
        deckService.deleteCard(deckId, cardId, TEMP_USER_ID);
    }

    @PutMapping("/{deckId}/cards/{cardId}/rate")
    public CardEntity rateCard(
            @PathVariable String deckId,
            @PathVariable String cardId,
            @RequestBody RateCardRequest request) {
        return deckService.rateCard(
                deckId,
                cardId,
                TEMP_USER_ID,
                request
        );
    }
}
