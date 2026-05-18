package com.liveimprove.goals.controller;

import com.liveimprove.common.security.JwtClaimsExtractor;
import com.liveimprove.goals.dto.CreateGoalRequest;
import com.liveimprove.goals.dto.ToggleGoalItemRequest;
import com.liveimprove.goals.dto.response.GoalsDataResponse;
import com.liveimprove.goals.service.GoalsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

/**
 * REST-контроллер для целей.
 * Содержит HTTP-слой и делегирует бизнес-логику в сервис.
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class GoalsController implements GoalsApi {

    private final GoalsService goalsService;
    private final JwtClaimsExtractor claimsExtractor;

    @Override
    public ResponseEntity<GoalsDataResponse> getGoals(Jwt jwt) {
        UUID userId = currentUserId(jwt);
        log.info("Запрос целей, userId={}", userId);
        return ResponseEntity.ok(goalsService.getGoalsData(userId));
    }

    @Override
    public ResponseEntity<Void> createGoal(Jwt jwt, CreateGoalRequest request) {
        UUID userId = currentUserId(jwt);
        log.info("Создание цели, userId={}, title={}", userId, request.title());
        goalsService.createGoal(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> toggleItem(Jwt jwt, UUID itemId, ToggleGoalItemRequest request) {
        UUID userId = currentUserId(jwt);
        log.info("Изменение подцели, userId={}, itemId={}, done={}", userId, itemId, request.done());
        goalsService.toggleItem(userId, itemId, request.done());
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteGoal(Jwt jwt, UUID goalId) {
        UUID userId = currentUserId(jwt);
        log.info("Удаление цели, userId={}, goalId={}", userId, goalId);
        goalsService.deleteGoal(userId, goalId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Извлекает UUID пользователя из JWT claim sub.
     */
    private UUID currentUserId(Jwt jwt) {
        if (jwt == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        try {
            return UUID.fromString(claimsExtractor.getUserId(jwt));
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT subject");
        }
    }
}
