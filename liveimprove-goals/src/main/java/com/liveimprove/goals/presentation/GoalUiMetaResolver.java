package com.liveimprove.goals.presentation;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

/**
 * Преобразует доменные данные цели в presentation-метаданные для UI:
 * цвет акцента, иконку и человекочитаемое время до дедлайна.
 */
@Component
public class GoalUiMetaResolver {

    private static final String ICON_TYPE = "emoji";

    /**
     * Подбирает визуальные атрибуты карточки цели по категории.
     *
     * @param category категория цели
     * @return набор UI-метаданных
     */
    public UiMeta resolve(String category) {
        String normalized = category == null ? "" : category.toLowerCase(Locale.ROOT);
        if (normalized.contains("фин")) return new UiMeta("green", "💰", ICON_TYPE);
        if (normalized.contains("здор")) return new UiMeta("orange", "❤️", ICON_TYPE);
        if (normalized.contains("лич")) return new UiMeta("blue", "✨", ICON_TYPE);
        return new UiMeta("purple", "📘", ICON_TYPE);
    }

    /**
     * Возвращает  время до дедлайна.
     *
     * @param targetDate целевая дата
     * @return строка для UI ("—", "Просрочено", "N дн.")
     */
    public String timeLeft(LocalDate targetDate) {
        if (targetDate == null) return "—";
        long days = ChronoUnit.DAYS.between(LocalDate.now(), targetDate);
        if (days < 0) return "Просрочено";
        return days + " дн.";
    }

    /**
     * Набор presentation-атрибутов карточки цели.
     */
    public record UiMeta(String accent, String icon, String iconType) {
    }
}
