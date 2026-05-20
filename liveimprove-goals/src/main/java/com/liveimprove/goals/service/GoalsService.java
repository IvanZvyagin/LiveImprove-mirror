package com.liveimprove.goals.service;

import com.liveimprove.goals.dto.CreateGoalRequest;
import com.liveimprove.goals.dto.response.GoalsDataResponse;

import java.util.UUID;

/**
 * Сервисный слой для работы с целями пользователя.
 */
public interface GoalsService {

    /**
     * Получить агрегированные данные по целям пользователя
     * (активные, завершенные, статистика).
     *
     * @param userId идентификатор текущего пользователя (из JWT sub)
     * @return агрегированный ответ для страницы "Цели"
     */
    GoalsDataResponse getGoalsData(UUID userId);

    /**
     * Создать новую цель с подцелями.
     *
     * @param userId идентификатор текущего пользователя (владелец цели)
     * @param request входные данные для создания цели
     */
    void createGoal(UUID userId, CreateGoalRequest request);

    /**
     * Поставить цель на паузу
     */
    void pauseGoal(UUID userId, UUID goalId);

    /**
     * Снять Цель с паузы
     */
    void resumeGoal(UUID userId, UUID goalId);

    /**
     * Переключить статус выполнения подцели.
     *
     * @param userId идентификатор текущего пользователя
     * @param itemId идентификатор подцели
     * @param done новое состояние выполнения (true = выполнено)
     */
    void toggleItem(UUID userId, UUID itemId, boolean done);

    /**
     * Удалить цель пользователя.
     *
     * @param userId идентификатор текущего пользователя
     * @param goalId идентификатор цели
     */
    void deleteGoal(UUID userId, UUID goalId);

    /**
     * Завершить цель под подцелей
     * @param userId
     * @param goalId
     */
    void completeGoal(UUID userId, UUID goalId);
}
