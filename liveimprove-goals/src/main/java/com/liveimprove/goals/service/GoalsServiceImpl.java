package com.liveimprove.goals.service;

import com.liveimprove.goals.presentation.GoalsViewBuilder;
import com.liveimprove.goals.dto.CreateGoalRequest;
import com.liveimprove.goals.dto.response.GoalsDataResponse;
import com.liveimprove.goals.entity.GoalEntity;
import com.liveimprove.goals.entity.GoalStatus;
import com.liveimprove.goals.entity.SubgoalEntity;
import com.liveimprove.goals.exception.GoalNotFoundException;
import com.liveimprove.goals.repository.GoalRepository;
import com.liveimprove.goals.repository.SubgoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Реализация сервисного слоя для работы с целями.
 * Содержит бизнес-логику и операции CRUD.
 */
@Service
@RequiredArgsConstructor
public class GoalsServiceImpl implements GoalsService {

    private final GoalRepository goalRepository;
    private final SubgoalRepository subgoalRepository;
    private final GoalsViewBuilder goalsViewBuilder;

    /**
     * Возвращает агрегированные данные по целям пользователя:
     * активные, завершенные и статистику.
     *
     * @param userId идентификатор пользователя-владельца целей
     * @return DTO для экрана целей
     */
    @Override
    @Transactional(readOnly = true)
    public GoalsDataResponse getGoalsData(UUID userId) {
        List<GoalEntity> activeGoals = goalRepository.findActiveByUserId(userId);
        List<GoalEntity> completedGoals = goalRepository.findCompletedByUserId(userId);
        return goalsViewBuilder.build(activeGoals, completedGoals);
    }

    /**
     * Создает цель пользователя и список подцелей.
     * Пустые подцели (blank) отбрасываются.
     *
     * @param userId идентификатор пользователя-владельца
     * @param request данные для создания цели
     */
    @Override
    @Transactional
    public void createGoal(UUID userId, CreateGoalRequest request) {
        GoalEntity goal = new GoalEntity(
                null,
                userId,
                request.title().trim(),
                request.category().trim(),
                blankToNull(request.description()),
                request.targetDate(),
                GoalStatus.ACTIVE,
                null,
                null,
                new ArrayList<>()
        );

        List<String> titles = request.subGoalTitles().stream()
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        for (int i = 0; i < titles.size(); i++) {
            SubgoalEntity item = new SubgoalEntity();
            item.setGoal(goal);
            item.setTitle(titles.get(i));
            item.setCompleted(false);
            item.setOrderIndex(i);
            goal.getItems().add(item);
        }

        goalRepository.save(goal);
    }

    /**
     * Меняет признак выполнения подцели и пересчитывает статус родительской цели.
     *
     * @param userId идентификатор пользователя-владельца
     * @param itemId идентификатор подцели
     * @param done новое состояние подцели
     * @throws GoalNotFoundException если подцель не найдена
     * или не принадлежит пользователю
     */
    @Override
    @Transactional
    public void toggleItem(UUID userId, UUID itemId, boolean done) {
        SubgoalEntity item = subgoalRepository.findByIdAndGoal_UserId(itemId, userId)
                .orElseThrow(() -> new GoalNotFoundException(itemId));

        item.setCompleted(done);
        syncGoalStatus(item.getGoal());
    }

    /**
     * Удаляет цель пользователя вместе с подцелями
     * (за счет cascade + orphanRemoval в entity).
     *
     * @param userId идентификатор пользователя-владельца
     * @param goalId идентификатор цели
     * @throws GoalNotFoundException если цель не найдена
     * или не принадлежит пользователю
     */
    @Override
    @Transactional
    public void deleteGoal(UUID userId, UUID goalId) {
        GoalEntity goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new GoalNotFoundException(goalId));
        goalRepository.delete(goal);
    }

    /**
     * Синхронизирует статус цели по состоянию подцелей:
     * если все выполнены - COMPLETED, иначе ACTIVE.
     */
    private void syncGoalStatus(GoalEntity goal) {
        List<SubgoalEntity> items = goal.getItems();
        boolean allDone = items != null && !items.isEmpty() && items.stream().allMatch(SubgoalEntity::isCompleted);

        if (allDone) {
            goal.setStatus(GoalStatus.COMPLETED);
            goal.setCompletedAt(LocalDate.now());
        } else if (goal.getStatus() == GoalStatus.COMPLETED) {
            goal.setStatus(GoalStatus.ACTIVE);
            goal.setCompletedAt(null);
        }
    }

    /**
     * Нормализует строку: null/blank -> null.
     */
    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
