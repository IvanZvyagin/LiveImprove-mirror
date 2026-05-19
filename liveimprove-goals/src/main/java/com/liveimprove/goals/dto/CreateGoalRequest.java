package com.liveimprove.goals.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;

public record CreateGoalRequest(
        @NotBlank @Size(max = 200) String title,
        @NotBlank @Size(max = 100) String category,
        @NotNull LocalDate targetDate,
        @Size(max = 500) String description,
        List<@NotBlank @Size(max = 300) String> subGoalTitles
        ) {
    public List<String> subGoalTitles() {
        return subGoalTitles == null ? List.of() : subGoalTitles;
    }
}
