package com.liveimprove.goals.dto.response;

import java.util.List;
import java.util.UUID;

public record GoalResponse(
        UUID id,
        String title,
        String category,
        String status,
        int progress,
        String targetDate,
        String timeLeft,
        String pausedAt,
        int totalPausedDays,
        String accent,
        String icon,
        String iconType,
        List<GoalItemResponse> items
) {
}
