package projectStudy.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import projectStudy.backend.service.DeckService;
import projectStudy.backend.model.Deck;
import projectStudy.backend.model.Card;

import java.time.DayOfWeek;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/home")
@CrossOrigin(origins = "*")
public class HomeController {

    private final DeckService deckService;

    private static final String TEMP_USER_ID = "demo-user";

    /**
     * Khoi tao HomeController voi DeckService.
     *
     * @param deckService service dung de xu ly du lieu deck
     */
    public HomeController(DeckService deckService) {
        this.deckService = deckService;
    }

    /**
     * Lay du lieu tong quan cho trang Home.
     *
     * @return Map chua thong tin user, thong ke tuan,
     *         bai dang hoc va bai duoc goi y
     */
    @GetMapping
    public Map<String, Object> getHomeData() {

        // Lay tat ca deck cua user
        List<Deck> decks = deckService.getDecks(TEMP_USER_ID);

        Map<String, Object> response = new HashMap<>();

        // Thong tin user
        response.put("userName", "Admin");
        response.put("greeting", "Ready for a productive session?");

        // Thong ke hoc tap trong tuan
        response.put("weeklyStats", buildWeeklyStats(decks));

        // Cac deck dang hoc do
        response.put(
                "inProgressLessons",
                buildInProgressLessons(decks)
        );

        // Cac deck chua duoc hoc
        response.put(
                "suggestedLessons",
                buildSuggestedLessons(decks)
        );

        return response;
    }

    /**
     * Tao thong ke hoc tap trong tuan hien tai.
     *
     * @param decks danh sach deck cua user
     * @return Map chua tong thoi gian va thong ke theo tung ngay
     */
    private Map<String, Object> buildWeeklyStats(List<Deck> decks) {

        Map<String, Object> result = new HashMap<>();

        List<Map<String, Object>> dailyStats = new ArrayList<>();

        // Tao danh sach 7 ngay tu thu Hai den Chu Nhat
        for (int i = 0; i < 7; i++) {

            Map<String, Object> day = new HashMap<>();

            DayOfWeek dayOfWeek = DayOfWeek.MONDAY.plus(i);

            day.put("day", dayOfWeek.toString());
            day.put("count", 0);

            dailyStats.add(day);
        }

        ZoneId zoneId = ZoneId.systemDefault();

        ZonedDateTime now =
                Instant.now().atZone(zoneId);

        // Xac dinh thoi diem bat dau cua tuan
        ZonedDateTime startOfWeek = now
                .with(TemporalAdjusters.previousOrSame(
                        DayOfWeek.MONDAY))
                .toLocalDate()
                .atStartOfDay(zoneId);

        // Xac dinh thoi diem bat dau cua tuan tiep theo
        ZonedDateTime endOfWeek =
                startOfWeek.plusDays(7);

        int totalTime = 0;

        // Duyet qua tat ca deck
        for (Deck deck : decks) {

            if (deck.getCards() == null) {
                continue;
            }

            // Duyet qua tat ca card trong deck
            for (Card card : deck.getCards()) {

                // Bo qua card chua duoc hoc
                if (card.getLastStudied() == null) {
                    continue;
                }

                ZonedDateTime studiedTime =
                        card.getLastStudied().atZone(zoneId);

                // Kiem tra card co duoc hoc trong tuan hien tai hay khong
                if (!studiedTime.isBefore(startOfWeek)
                        && studiedTime.isBefore(endOfWeek)) {

                    DayOfWeek studiedDay =
                            studiedTime.getDayOfWeek();

                    int index =
                            studiedDay.getValue() - 1;

                    Map<String, Object> day =
                            dailyStats.get(index);

                    int count =
                            (int) day.get("count");

                    day.put("count", count + 1);

                    totalTime++;
                }
            }
        }

        result.put("totalTime", totalTime);
        result.put("dailyStats", dailyStats);

        return result;
    }

    /**
     * Lay danh sach cac deck dang duoc hoc do.
     *
     * @param decks danh sach deck cua user
     * @return danh sach deck da hoc mot phan nhung chua hoan thanh
     */
    private List<Map<String, Object>> buildInProgressLessons(
            List<Deck> decks) {

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Deck deck : decks) {

            if (deck.getCards() == null
                    || deck.getCards().isEmpty()) {
                continue;
            }

            int totalProgress =
                    deck.getCards().size();

            int currentProgress = 0;

            // Dem so card da duoc hoc
            for (Card card : deck.getCards()) {

                if (card.getLastStudied() != null) {
                    currentProgress++;
                }
            }

            // Chi lay deck da hoc mot phan
            if (currentProgress > 0
                    && currentProgress < totalProgress) {

                Map<String, Object> lesson =
                        new HashMap<>();

                lesson.put(
                        "title",
                        deck.getTitle()
                );

                lesson.put(
                        "currentProgress",
                        currentProgress
                );

                lesson.put(
                        "totalProgress",
                        totalProgress
                );

                result.add(lesson);
            }
        }

        return result;
    }

    /**
     * Lay danh sach cac deck chua duoc hoc.
     *
     * @param decks danh sach deck cua user
     * @return danh sach deck chua co card nao duoc hoc
     */
    private List<Map<String, Object>> buildSuggestedLessons(
            List<Deck> decks) {

        List<Map<String, Object>> result =
                new ArrayList<>();

        for (Deck deck : decks) {

            if (deck.getCards() == null
                    || deck.getCards().isEmpty()) {
                continue;
            }

            boolean hasStudied = false;

            // Kiem tra deck co card nao da duoc hoc hay chua
            for (Card card : deck.getCards()) {

                if (card.getLastStudied() != null) {
                    hasStudied = true;
                    break;
                }
            }

            // Neu chua hoc card nao thi them vao danh sach goi y
            if (!hasStudied) {

                Map<String, Object> lesson =
                        new HashMap<>();

                lesson.put(
                        "title",
                        deck.getTitle()
                );

                lesson.put(
                        "description",
                        deck.getDescription()
                );

                result.add(lesson);
            }
        }

        return result;
    }
}