package com.liveimprove.goals.dto.response;

import java.util.List;

public record GoalsDataResponse(
        List<String> tabs,
        List<GoalResponse> goals,
        List<CompletedGoalResponse> completed,
        GoalsStatsResponse stats
) {
}
