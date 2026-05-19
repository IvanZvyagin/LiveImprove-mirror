package com.liveimprove.goals.dto.response;

import java.util.List;
import java.util.UUID;

public record CompletedGoalResponse(
        UUID id,
        String title,
        String category,
        String completedDate,
        int progress,
        String accent,
        String icon
) {

}
