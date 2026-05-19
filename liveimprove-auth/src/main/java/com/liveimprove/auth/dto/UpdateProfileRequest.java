package com.liveimprove.auth.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(min = 1, max = 255, message = "Имя должно быть от 1 до 255 символов")
        String name,
        @Size(min = 3, max = 100, message = "Имя пользователя может быть от 3 до 100 символов")
        @Pattern(regexp = "^[a-zA-Z0-9_-]+$",
                message = "Имя пользователя может содержать только буквы, цифры, подчеркивания и дефисы")
        String username
) {}
