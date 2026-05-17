package com.liveimprove.auth.dto;

import lombok.Builder;

@Builder
public record NotificationSettings(
        Boolean email,
        Boolean push,
        Boolean habits,
        Boolean goals
) {}
