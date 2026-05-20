package com.liveimprove.goals.service;

import com.liveimprove.goals.presentation.GoalsViewBuilder;
import com.liveimprove.goals.dto.CreateGoalRequest;
import com.liveimprove.goals.dto.response.GoalsDataResponse;
import com.liveimprove.goals.entity.GoalEntity;
import com.liveimprove.goals.entity.GoalStatus;
import com.liveimprove.goals.entity.SubgoalEntity;
import com.liveimprove.goals.exception.GoalInvalidStatusException;
import com.liveimprove.goals.exception.GoalNotFoundException;
import com.liveimprove.goals.repository.GoalRepository;
import com.liveimprove.goals.repository.SubgoalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
     * активные, завершённые и статистику.
     *
     * @param userId идентификатор пользователя-владельца целей
     * @return DTO для экрана «Цели»
     */
    @Override
    @Transactional(readOnly = true)
    public GoalsDataResponse getGoalsData(UUID userId) {
        List<GoalEntity> activeGoals = goalRepository.findActiveByUserId(userId);
        List<GoalEntity> completedGoals = goalRepository.findCompletedByUserId(userId);
        return goalsViewBuilder.build(activeGoals, completedGoals);
    }

    /**
     * Создаёт новую цель пользователя вместе со списком подцелей.
     * Пустые подцели (blank) отбрасываются; порядок подцелей сохраняется.
     *
     * @param userId  идентификатор пользователя-владельца
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
                0,
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
     * Переключает признак выполнения подцели и пересчитывает статус родительской цели.
     * Если все подцели выполнены — цель получает статус {@link GoalStatus#COMPLETED}.
     * Если хотя бы одна снята — цель возвращается в {@link GoalStatus#ACTIVE}.
     *
     * @param userId идентификатор пользователя-владельца
     * @param itemId идентификатор подцели
     * @param done   новое состояние подцели ({@code true} — выполнено)
     * @throws GoalNotFoundException если подцель не найдена или не принадлежит пользователю
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
     * Ставит активную цель на паузу.
     * Фиксирует дату начала паузы в {@code pausedAt}.
     * Пока цель на паузе, дедлайн не уменьшается.
     *
     * @param userId идентификатор пользователя-владельца
     * @param goalId идентификатор цели
     * @throws GoalNotFoundException      если цель не найдена или не принадлежит пользователю
     * @throws GoalInvalidStatusException если цель уже не в статусе {@link GoalStatus#ACTIVE}
     */
    @Override
    @Transactional
    public void pauseGoal(UUID userId, UUID goalId) {
        GoalEntity goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new GoalNotFoundException(goalId));

        if (goal.getStatus() != GoalStatus.ACTIVE) {
            throw new GoalInvalidStatusException("Приостановить можно только активные цели");
        }

        goal.setStatus(GoalStatus.PAUSED);
        goal.setPausedAt(LocalDate.now());
    }

    /**
     * Снимает цель с паузы и возобновляет отсчёт дедлайна.
     * Длительность текущей паузы накапливается в {@code totalPausedDays},
     * чтобы компенсировать «заморозку» дедлайна в UI.
     *
     * @param userId идентификатор пользователя-владельца
     * @param goalId идентификатор цели
     * @throws GoalNotFoundException      если цель не найдена или не принадлежит пользователю
     * @throws GoalInvalidStatusException если цель не находится в статусе {@link GoalStatus#PAUSED}
     */
    @Override
    @Transactional
    public void resumeGoal(UUID userId, UUID goalId) {
        GoalEntity goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new GoalNotFoundException(goalId));

        if (goal.getStatus() != GoalStatus.PAUSED) {
            throw new GoalInvalidStatusException("Снять с паузы можно только цель на паузе");
        }

        accumulatePausedDays(goal);

        goal.setStatus(GoalStatus.ACTIVE);
        goal.setPausedAt(null);
    }

    /**
     * Добавляет длительность текущей паузы в накопленный счётчик {@code totalPausedDays}.
     * Вызывается при снятии цели с паузы, чтобы зафиксировать «заморозку» дедлайна.
     *
     * @param goal цель, которую снимают с паузы
     */
    private void accumulatePausedDays(GoalEntity goal) {
        if (goal.getPausedAt() == null)
            return;
        long days = ChronoUnit.DAYS.between(goal.getPausedAt(), LocalDate.now());
        goal.setTotalPausedDays(goal.getTotalPausedDays() + (int) days);
    }

    /**
     * Удаляет цель пользователя вместе со всеми подцелями
     * (каскадное удаление через {@code CascadeType.ALL + orphanRemoval}).
     *
     * @param userId идентификатор пользователя-владельца
     * @param goalId идентификатор цели
     * @throws GoalNotFoundException если цель не найдена или не принадлежит пользователю
     */
    @Override
    @Transactional
    public void deleteGoal(UUID userId, UUID goalId) {
        GoalEntity goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new GoalNotFoundException(goalId));
        goalRepository.delete(goal);
    }

    /**
     * Вручную завершает цель без подцелей.
     * Устанавливает статус {@link GoalStatus#COMPLETED} и фиксирует дату завершения.
     * Для целей с подцелями завершение происходит автоматически через {@link #toggleItem}.
     *
     * @param userId идентификатор пользователя-владельца
     * @param goalId идентификатор цели
     * @throws GoalNotFoundException если цель не найдена или не принадлежит пользователю
     */
    @Override
    @Transactional
    public void completeGoal(UUID userId, UUID goalId) {
        GoalEntity goal = goalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new GoalNotFoundException(goalId));
        goal.setStatus(GoalStatus.COMPLETED);
        goal.setCompletedAt(LocalDate.now());
    }

    /**
     * Пересчитывает статус цели по текущему состоянию её подцелей.
     * Не трогает цели в статусе {@link GoalStatus#PAUSED} —
     * их статус меняется только через {@link #pauseGoal} / {@link #resumeGoal}.
     *
     * @param goal цель, у которой изменилась одна из подцелей
     */
    private void syncGoalStatus(GoalEntity goal) {
        if (goal.getStatus() == GoalStatus.PAUSED) {
            return;
        }

        Optional.ofNullable(goal.getItems())
                .filter(items -> !items.isEmpty())
                .ifPresent(items -> {
                    boolean allDone = items.stream().allMatch(SubgoalEntity::isCompleted);
                    if (allDone) {
                        goal.setStatus(GoalStatus.COMPLETED);
                        goal.setCompletedAt(LocalDate.now());
                    } else if (goal.getStatus() == GoalStatus.COMPLETED) {
                        goal.setStatus(GoalStatus.ACTIVE);
                        goal.setCompletedAt(null);
                    }
                });
    }

    /**
     * Нормализует строку: {@code null} или пустую/пробельную возвращает как {@code null}.
     *
     * @param value входная строка
     * @return обрезанная строка или {@code null}
     */
    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
