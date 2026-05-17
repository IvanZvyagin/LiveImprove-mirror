package com.liveimprove.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileEntity {

    @Id
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "email")
    private String email;

    @Column(name = "name")
    private String name;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "avatar_data_url", columnDefinition = "TEXT")
    private String avatarDataUrl;

    @Column(name = "notif_email")
    private Boolean notifEmail = true;

    @Column(name = "notif_push")
    private Boolean notifPush = true;

    @Column(name = "notif_habits")
    private Boolean notifHabits = true;

    @Column(name = "notif_goals")
    private Boolean notifGoals = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if(notifEmail == null) notifEmail =true;
        if(notifPush == null) notifPush =true;
        if(notifHabits == null) notifHabits =true;
        if(notifGoals == null) notifGoals =true;
    }

    @PreUpdate
    private void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
}
