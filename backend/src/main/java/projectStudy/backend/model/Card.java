package projectStudy.backend.model;

import java.time.Instant;

public class Card {

    private String id;
    private String front;
    private String back;
    private Difficulty difficulty;
    private Instant lastStudied;

    public Card(String id, String front, String back, Difficulty difficulty, Instant lastStudied) {
        this.id = id;
        this.front = front;
        this.back = back;
        this.difficulty = difficulty;
        this.lastStudied = lastStudied;
    }

    public Card() {
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

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
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
