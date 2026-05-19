package com.liveimprove.auth.dto;

public record ErrorResponse(
        String message,
        String code
) {}
