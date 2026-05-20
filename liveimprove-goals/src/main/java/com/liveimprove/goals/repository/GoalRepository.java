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
    List<GoalEntity> findAllByUserIdAndStatusInOrderByCreatedAtDesc(UUID userId, List<GoalStatus> statuses);

    @EntityGraph(attributePaths = "items")
    Optional<GoalEntity> findByIdAndUserId(UUID id, UUID userId);

    /**
     * Незавершенные цели пользователя: активные и на паузе.
     */
    default List<GoalEntity> findActiveByUserId(UUID userId) {
        return findAllByUserIdAndStatusInOrderByCreatedAtDesc(
                userId, List.of(GoalStatus.ACTIVE, GoalStatus.PAUSED));
    }

    default List<GoalEntity> findCompletedByUserId(UUID userId) {
        return findAllByUserIdAndStatusOrderByCreatedAtDesc(userId, GoalStatus.COMPLETED);
    }
}
