package projectStudy.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import projectStudy.backend.service.DeckService;
import projectStudy.backend.model.*;
import projectStudy.backend.dto.*;

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
    public List<Deck> getAllDecks() {
        return deckService.getDecks(TEMP_USER_ID);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Deck createDeck(@RequestBody CreateDeckRequest request) {
        return deckService.createDeck(TEMP_USER_ID, request);
    }

    @PutMapping("/{deckId}")
    public Deck updateDeck(
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
    public Card addCard(
            @PathVariable String deckId,
            @RequestBody CreateCardRequest request) {
        return deckService.addCard(deckId, TEMP_USER_ID, request);
    }

    @PutMapping("/{deckId}/cards/{cardId}")
    public Card updateCard(
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
    public Card rateCard(
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