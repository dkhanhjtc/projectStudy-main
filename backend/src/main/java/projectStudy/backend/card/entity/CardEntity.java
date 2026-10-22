package projectStudy.backend.card.entity;

import java.time.Instant;

public class CardEntity {

    private String id;
    private String front;
    private String back;
    private DifficultyEntity difficulty;
    private Instant lastStudied;

    public CardEntity(String id, String front, String back, DifficultyEntity difficulty, Instant lastStudied) {
        this.id = id;
        this.front = front;
        this.back = back;
        this.difficulty = difficulty;
        this.lastStudied = lastStudied;
    }

    public CardEntity() {
        this.id = generateId();
    }

    /**
     * Generates a unique ID for the card.
     *
     * @return generated card ID
     */
    private String generateId() {
        return System.currentTimeMillis() + "-"
                + Long.toString((long) (Math.random() * Long.MAX_VALUE), 36)
                        .substring(0, 7);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFront() {
        return front;
    }

    public void setFront(String front) {
        this.front = front;
    }

    public String getBack() {
        return back;
    }

    public void setBack(String back) {
        this.back = back;
    }

    public DifficultyEntity getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyEntity difficulty) {
        this.difficulty = difficulty;
    }

    public Instant getLastStudied() {
        return lastStudied;
    }

    public void setLastStudied(Instant lastStudied) {
        this.lastStudied = lastStudied;
    }

    @Override
    public String toString() {
        return "Card{" +
                "id='" + id + '\'' +
                ", front='" + front + '\'' +
                ", back='" + back + '\'' +
                ", difficulty=" + difficulty +
                ", lastStudied=" + lastStudied +
                '}';
    }

}
