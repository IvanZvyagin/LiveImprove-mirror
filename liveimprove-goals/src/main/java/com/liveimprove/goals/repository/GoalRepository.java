package com.liveimprove.goals.repository;

import com.liveimprove.goals.entity.GoalEntity;
import com.liveimprove.goals.entity.GoalStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface GoalRepository extends JpaRepository<GoalEntity, UUID> {

    @EntityGraph(attributePaths = "items")
    List<GoalEntity> findAllByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, GoalStatus status);

    @EntityGraph(attributePaths = "items")
    Optional<GoalEntity> findByIdAndUserId(UUID id, UUID userId);

    default List<GoalEntity> findActiveByUserId(UUID userId) {
        return findAllByUserIdAndStatusOrderByCreatedAtDesc(userId, GoalStatus.ACTIVE);
    }

    default List<GoalEntity> findCompletedByUserId(UUID userId) {
        return findAllByUserIdAndStatusOrderByCreatedAtDesc(userId, GoalStatus.COMPLETED);
    }
}
