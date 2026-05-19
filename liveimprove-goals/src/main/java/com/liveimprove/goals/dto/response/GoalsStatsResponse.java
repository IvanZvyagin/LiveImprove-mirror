package com.liveimprove.goals.dto.response;

import java.util.List;

public record GoalsStatsResponse(
        int active,
        int completed,
        int averageProgress,
        List<Integer> trend,
        String period
) {
}
