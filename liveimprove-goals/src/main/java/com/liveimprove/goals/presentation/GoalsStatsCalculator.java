package com.liveimprove.goals.presentation;

import com.liveimprove.goals.entity.GoalEntity;
import com.liveimprove.goals.entity.SubgoalEntity;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Содержит вычисления статистических показателей для целей.
 */
@Component
public class GoalsStatsCalculator {

    /**
     * Вычисляет прогресс цели в процентах (0..100)
     * на основе количества выполненных подцелей.
     *
     * @param items список подцелей
     * @return процент выполнения
     */
    public int progress(List<SubgoalEntity> items) {
        if (items == null || items.isEmpty()) return 0;
        long done = items.stream().filter(SubgoalEntity::isCompleted).count();
        return (int) Math.round(done * 100.0 / items.size());
    }

    /**
     * Вычисляет средний прогресс по списку целей.
     *
     * @param goals список целей
     * @return средний процент выполнения
     */
    public int averageProgress(List<GoalEntity> goals) {
        if (goals == null || goals.isEmpty()) return 0;
        return (int) Math.round(
                goals.stream()
                        .mapToInt(g -> progress(g.getItems()))
                        .average()
                        .orElse(0.0)
        );
    }

    /**
     * Временная заглушка до реализации аналитики тренда.
     *
     * @param averageProgress средний прогресс по активным целям
     * @return фиктивный тренд из трех одинаковых значений
     */
    public List<Integer> trendMock(int averageProgress) {
        return List.of(averageProgress, averageProgress, averageProgress);
    }
}
