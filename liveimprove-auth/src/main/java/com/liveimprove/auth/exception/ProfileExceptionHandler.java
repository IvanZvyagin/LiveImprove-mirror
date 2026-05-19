package com.liveimprove.auth.exception;

import com.liveimprove.auth.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class ProfileExceptionHandler {
    @ExceptionHandler(ProfileNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ProfileNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("Профиль не найден", "PROFILE_NOT_FOUND"));
    }

    @ExceptionHandler(UsernameAlreadyTakenException.class)
    public ResponseEntity<ErrorResponse> handleConflict(UsernameAlreadyTakenException ex){
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("Имя пользователя занято", "USERNAME_ALREADY_TAKEN"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex){
        String details = ex.getBindingResult().getFieldErrors().stream()
                .map(e -> e.getField() + ": " + e.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Ошибка валидации: " + details, "VALIDATION_ERROR"));
    }
}
