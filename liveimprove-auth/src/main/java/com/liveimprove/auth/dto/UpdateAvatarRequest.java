package com.liveimprove.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateAvatarRequest(
        @NotBlank(message = "URL данных аватара не может быть пустым")
        @Size(max = 500, message = "Avatar URL must not exceed 500 characters")
        String avatarDataUrl
) {}
