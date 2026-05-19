package com.liveimprove.goals.dto.response;

import java.util.List;
import java.util.UUID;

public record GoalResponse(
        UUID id,
        String title,
        String category,
        int progress,
        String targetDate,
        String timeLeft,
        String accent,
        String icon,
        String iconType,
        List<GoalItemResponse> items
) {
}
