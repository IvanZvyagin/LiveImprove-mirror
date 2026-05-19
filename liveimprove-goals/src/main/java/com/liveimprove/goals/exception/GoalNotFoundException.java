package com.liveimprove.goals.exception;

import java.util.UUID;

public class GoalNotFoundException extends RuntimeException {
    public GoalNotFoundException(UUID id) {
        super("Цель не найдена" + id);
    }
}
