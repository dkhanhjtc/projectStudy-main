package projectStudy.backend.deck.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import projectStudy.backend.deck.entity.DeckEntity;

public interface DeckRepository extends MongoRepository<DeckEntity, String> {
    List<DeckEntity> findByUserId(String userId);

    Optional<DeckEntity> findByIdAndUserId(String deckId, String userId);

}