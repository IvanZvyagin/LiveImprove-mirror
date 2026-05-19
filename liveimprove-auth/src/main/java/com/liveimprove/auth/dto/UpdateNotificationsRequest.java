package com.liveimprove.auth.dto;

public record UpdateNotificationsRequest(
        Boolean email,
        Boolean push,
        Boolean habits,
        Boolean goals
) {}
