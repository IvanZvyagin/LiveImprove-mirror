package com.liveimprove.goals.repository;

import com.liveimprove.goals.entity.SubgoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SubgoalRepository extends JpaRepository<SubgoalEntity, UUID> {

    /**
     * item принадлежит пользователю через goal.userId
     * @param id
     * @param userId
     * @return
     */
    Optional<SubgoalEntity> findByIdAndGoal_UserId(UUID id, UUID userId);
}
