package com.liveimprove.goals.presentation;

import com.liveimprove.goals.dto.response.CompletedGoalResponse;
import com.liveimprove.goals.dto.response.GoalResponse;
import com.liveimprove.goals.dto.response.GoalsDataResponse;
import com.liveimprove.goals.dto.response.GoalsStatsResponse;
import com.liveimprove.goals.entity.GoalEntity;
import com.liveimprove.goals.mapper.GoalsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Строит итоговый ответ для экрана целей на основе domain-сущностей.
 * Объединяет данные активных/завершенных целей и статистику в единый DTO.
 */
@Component
@RequiredArgsConstructor
public class GoalsViewBuilder {

    private static final List<String> TABS = List.of("Активные", "Завершенные");
    private static final String STATS_PERIOD = "30 дней";

    private final GoalsMapper goalsMapper;
    private final GoalsStatsCalculator goalsStatsCalculator;
    private final GoalUiMetaResolver goalUiMetaResolver;

    /**
     * Собирает полный payload для страницы целей.
     *
     * @param activeGoals список активных целей пользователя
     * @param completedGoals список завершенных целей пользователя
     * @return агрегированный ответ с вкладками, целями и статистикой
     */
    public GoalsDataResponse build(List<GoalEntity> activeGoals, List<GoalEntity> completedGoals) {
        List<GoalResponse> goals = activeGoals.stream()
                .map(this::toActiveGoalResponse)
                .toList();

        List<CompletedGoalResponse> completed = completedGoals.stream()
                .map(this::toCompletedGoalResponse)
                .toList();

        int averageProgress = goalsStatsCalculator.averageProgress(activeGoals);
        GoalsStatsResponse stats = new GoalsStatsResponse(
                goals.size(),
                completed.size(),
                averageProgress,
                goalsStatsCalculator.trendMock(averageProgress),
                STATS_PERIOD
        );

        return new GoalsDataResponse(TABS, goals, completed, stats);
    }

    /**
     * Собирает response-объект для активной цели.
     * Базовые поля берет из mapper, presentation-поля (timeLeft/icon/accent)
     * добавляет через соответствующие presentation-компоненты.
     */
    private GoalResponse toActiveGoalResponse(GoalEntity goal) {
        GoalResponse mapped = goalsMapper.toGoalResponse(goal);
        GoalUiMetaResolver.UiMeta uiMeta = goalUiMetaResolver.resolve(goal.getCategory());
        int progress = goalsStatsCalculator.progress(goal.getItems());

        return new GoalResponse(
                mapped.id(),
                mapped.title(),
                mapped.category(),
                mapped.status(),
                progress,
                mapped.targetDate(),
                goalUiMetaResolver.timeLeft(goal),
                mapped.pausedAt(),
                mapped.totalPausedDays(),
                uiMeta.accent(),
                uiMeta.icon(),
                uiMeta.iconType(),
                mapped.items()
        );
    }

    /**
     * Собирает response-объект для завершенной цели.
     */
    private CompletedGoalResponse toCompletedGoalResponse(GoalEntity goal) {
        GoalUiMetaResolver.UiMeta uiMeta = goalUiMetaResolver.resolve(goal.getCategory());

        return new CompletedGoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getCategory(),
                goal.getCompletedAt() != null ? goal.getCompletedAt().toString() : null,
                goalsStatsCalculator.progress(goal.getItems()),
                uiMeta.accent(),
                uiMeta.icon()
        );
    }
}
