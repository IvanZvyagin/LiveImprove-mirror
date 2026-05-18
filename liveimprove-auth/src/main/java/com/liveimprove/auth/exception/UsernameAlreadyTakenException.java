package com.liveimprove.auth.exception;

public class UsernameAlreadyTakenException extends RuntimeException {
    public UsernameAlreadyTakenException(String username) {
        super("Имя пользователя занято: " + username);
    }
}
