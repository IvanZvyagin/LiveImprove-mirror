package com.liveimprove.goals.dto;

import jakarta.validation.constraints.NotNull;

public record ToggleGoalItemRequest(@NotNull Boolean done) {}
