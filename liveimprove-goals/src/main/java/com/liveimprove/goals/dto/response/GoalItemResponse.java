package com.liveimprove.goals.dto.response;

import java.util.UUID;

public record GoalItemResponse(
        UUID id,
        String title,
        String date,
        boolean done
) {
}
