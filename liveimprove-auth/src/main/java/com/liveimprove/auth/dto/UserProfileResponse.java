package com.liveimprove.auth.dto;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record UserProfileResponse(
        String userId,
        String email,
        String name,
        String username,
        String avatarDataUrl,
        NotificationSettings notification,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}
