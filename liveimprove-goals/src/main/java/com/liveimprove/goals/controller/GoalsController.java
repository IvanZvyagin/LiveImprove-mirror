package com.liveimprove.goals.controller;

import com.liveimprove.common.security.JwtClaimsExtractor;
import com.liveimprove.goals.dto.CreateGoalRequest;
import com.liveimprove.goals.dto.ToggleGoalItemRequest;
import com.liveimprove.goals.dto.response.GoalsDataResponse;
import com.liveimprove.goals.service.GoalsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import java.util.UUID;

/**
 * REST-контроллер для целей.
 * Содержит HTTP-слой и делегирует бизнес-логику в сервис.
 */
@RestController
@RequiredArgsConstructor
public class GoalsController implements GoalsApi {

    private final GoalsService goalsService;
    private final JwtClaimsExtractor claimsExtractor;

    @Override
    public ResponseEntity<GoalsDataResponse> getGoals(Jwt jwt) {
        return ResponseEntity.ok(goalsService.getGoalsData(claimsExtractor.getUserIdAsUuid(jwt)));
    }

    @Override
    public ResponseEntity<Void> createGoal(Jwt jwt, CreateGoalRequest request) {
        goalsService.createGoal(claimsExtractor.getUserIdAsUuid(jwt), request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Override
    public ResponseEntity<Void> toggleItem(Jwt jwt, UUID itemId, ToggleGoalItemRequest request) {
        goalsService.toggleItem(claimsExtractor.getUserIdAsUuid(jwt), itemId, request.done());
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> completeGoal(Jwt jwt, UUID goalId) {
        goalsService.completeGoal(claimsExtractor.getUserIdAsUuid(jwt), goalId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> pauseGoal(Jwt jwt, UUID goalId) {
        goalsService.pauseGoal(claimsExtractor.getUserIdAsUuid(jwt),goalId);
        return  ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> resumeGoal(Jwt jwt, UUID goalId) {
        goalsService.resumeGoal(claimsExtractor.getUserIdAsUuid(jwt),goalId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<Void> deleteGoal(Jwt jwt, UUID goalId) {
        goalsService.deleteGoal(claimsExtractor.getUserIdAsUuid(jwt), goalId);
        return ResponseEntity.noContent().build();
    }
}
