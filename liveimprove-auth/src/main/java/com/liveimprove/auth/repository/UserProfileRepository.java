package com.liveimprove.auth.repository;

import com.liveimprove.auth.entity.UserProfileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfileEntity, String> {

    Optional<UserProfileEntity> findByUsername(String username);

    boolean existsByUsername(String username);
}
