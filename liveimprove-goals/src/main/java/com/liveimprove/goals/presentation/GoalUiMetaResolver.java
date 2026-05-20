package com.liveimprove.goals.presentation;

import com.liveimprove.goals.entity.GoalEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Locale;

/**
 * Преобразует доменные данные цели в presentation-метаданные для UI:
 * цвет акцента, иконку и человекочитаемое время до дедлайна.
 */
@Component
@RequiredArgsConstructor
public class GoalUiMetaResolver {

    private static final String ICON_TYPE = "emoji";
    private static final String NO_DATE = "—";
    private static final String OVERDUE = "Просрочено";
    private static final String DAYS_SUFFIX = " дн.";

    private final Clock clock;

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
     * Возвращает время до дедлайна с учётом паузы цели.
     * Дедлайн сдвигается на количество дней паузы:
     * накопленные {@code totalPausedDays} + длительность текущей паузы.
     *
     * @param goal доменная сущность цели
     * @return строка для UI ("—", "Просрочено", "N дн.")
     */
    public String timeLeft(GoalEntity goal) {
        LocalDate target = effectiveTargetDate(goal);
        if (target == null) return NO_DATE;

        long days = ChronoUnit.DAYS.between(LocalDate.now(clock), target);
        return days < 0 ? OVERDUE : days + DAYS_SUFFIX;
    }

    /**
     * Вычисляет эффективную дату дедлайна с учётом «заморозки» на паузах.
     *
     * @param goal цель
     * @return дата с учётом паузы или {@code null}, если {@code targetDate} не задан
     */
    private LocalDate effectiveTargetDate(GoalEntity goal) {
        if (goal.getTargetDate() == null) return null;
        long shift = goal.getTotalPausedDays() + currentPauseDays(goal);
        return goal.getTargetDate().plusDays(shift);
    }

    /**
     * Длительность текущей (ещё не завершённой) паузы в днях.
     *
     * @param goal цель
     * @return дней с момента {@code pausedAt} до сегодня; {@code 0}, если цель не на паузе
     */
    private long currentPauseDays(GoalEntity goal) {
        if (goal.getPausedAt() == null) return 0;
        return ChronoUnit.DAYS.between(goal.getPausedAt(), LocalDate.now(clock));
    }

    /**
     * Набор presentation-атрибутов карточки цели.
     */
    public record UiMeta(String accent, String icon, String iconType) {
    }
}
