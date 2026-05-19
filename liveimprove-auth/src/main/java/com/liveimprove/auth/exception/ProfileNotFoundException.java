package com.liveimprove.auth.exception;

public class ProfileNotFoundException extends RuntimeException {
    public ProfileNotFoundException(String userId) {
        super("Профиль не пользователя не найден: " + userId);
    }
}
