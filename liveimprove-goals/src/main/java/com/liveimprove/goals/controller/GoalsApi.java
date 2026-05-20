package com.liveimprove.goals.controller;

import com.liveimprove.goals.dto.CreateGoalRequest;
import com.liveimprove.goals.dto.ToggleGoalItemRequest;
import com.liveimprove.goals.dto.response.GoalsDataResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Контракт REST API для работы с целями пользователя.
 */
@RequestMapping("/api/v1/goals")
public interface GoalsApi {

    /**
     * Получить данные экрана целей:
     * активные, завершенные и статистику.
     *
     * @param jwt JWT текущего пользователя
     * @return агрегированный ответ для UI
     */
    @GetMapping
    ResponseEntity<GoalsDataResponse> getGoals(@AuthenticationPrincipal Jwt jwt);

    /**
     * Создать новую цель.
     *
     * @param jwt JWT текущего пользователя
     * @param request данные цели
     * @return 201 Created
     */
    @PostMapping
    ResponseEntity<Void> createGoal(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody CreateGoalRequest request);

    /**
     * Переключить статус выполнения подцели.
     *
     * @param jwt JWT текущего пользователя
     * @param itemId идентификатор подцели
     * @param request тело с новым состоянием done
     * @return 200 OK
     */
    @PostMapping("/items/{itemId}/toggle")
    ResponseEntity<Void> toggleItem(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID itemId,
            @Valid @RequestBody ToggleGoalItemRequest request
    );

    /**
     * Завершить Цель без подцелей.
     */
    @PatchMapping("/{goalId}/complete")
    ResponseEntity<Void> completeGoal(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID goalId
    );

    /**
     * Поставить Цель на паузу
     */
    @PatchMapping("/{goalId}/pause")
    ResponseEntity<Void> pauseGoal(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID goalId
    );

    /**
     * Возобновить Цель
     */
    @PatchMapping("/{goalId}/resume")
    ResponseEntity<Void> resumeGoal(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID goalId
    );

    /**
     * Удалить цель по идентификатору.
     *
     * @param jwt JWT текущего пользователя
     * @param goalId идентификатор цели
     * @return 204 No Content
     */
    @DeleteMapping("/{goalId}")
    ResponseEntity<Void> deleteGoal(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID goalId);
}
