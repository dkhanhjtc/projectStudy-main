package projectStudy.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import projectStudy.backend.model.Deck;

@Repository
public interface DeckRepository extends MongoRepository<Deck, String> {
    List<Deck> findByUserId(String userId);

    Optional<Deck> findByIdAndUserId(String deckId, String userId);

}
