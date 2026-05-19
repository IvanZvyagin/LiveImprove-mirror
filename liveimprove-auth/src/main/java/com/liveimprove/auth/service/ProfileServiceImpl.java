package com.liveimprove.auth.service;

import com.liveimprove.auth.dto.UpdateNotificationsRequest;
import com.liveimprove.auth.dto.UpdateProfileRequest;
import com.liveimprove.auth.entity.UserProfileEntity;
import com.liveimprove.auth.exception.ProfileNotFoundException;
import com.liveimprove.auth.exception.UsernameAlreadyTakenException;
import com.liveimprove.auth.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProfileServiceImpl implements ProfileService {
    private final UserProfileRepository profileRepository;

    /**
     * Получает профиль пользователя или создает новый при первом входе.
     */
    @Transactional
    public UserProfileEntity getOrCreateProfile(String userId, String email, String name) {
        return profileRepository.findById(userId)
                .orElseGet(() -> {
                    log.info("Создание профиля для нового пользователя: {}", userId);
                    return profileRepository.save(
                            UserProfileEntity.builder()
                                    .userId(userId)
                                    .email(email)
                                    .name(name)
                                    .build()
                    );
                });
    }

    /**
     * Обновляет имя и username профиля.
     *
     * @throws UsernameAlreadyTakenException если username занят
     */
    @Transactional
    public UserProfileEntity updateProfile(String userId, UpdateProfileRequest request) {
        UserProfileEntity profile = findProfileOrThrow(userId);
        if (request.username() != null && !request.username().equals(profile.getUsername())) {
            if (profileRepository.existsByUsername(request.username())) {
                throw new UsernameAlreadyTakenException(request.username());
            }
            profile.setUsername(request.username());
        }
        if (request.name() != null) {
            profile.setName(request.name());
        }
        return profileRepository.save(profile);
    }

    /**
     * Обновляет аватар пользователя.
     */
    @Transactional
    public UserProfileEntity updateAvatar(String userId, String avatarDataUrl) {
        UserProfileEntity profile = findProfileOrThrow(userId);
        profile.setAvatarDataUrl(avatarDataUrl);
        return profileRepository.save(profile);
    }

    /**
     * Обновляет настройки уведомлений.
     */
    @Transactional
    public UserProfileEntity updateNotifications(String userId, UpdateNotificationsRequest request) {
        UserProfileEntity profile = findProfileOrThrow(userId);
        if (request.email() != null)
            profile.setNotifEmail(request.email());
        if (request.push() != null)
            profile.setNotifPush(request.push());
        if (request.habits() != null)
            profile.setNotifHabits(request.habits());
        if (request.goals() != null)
            profile.setNotifGoals(request.goals());

        return profileRepository.save(profile);
    }
    /**
     * Поиск профиля или ошибка.
     *
     * @throws ProfileNotFoundException если профиль не найден
     */
    private UserProfileEntity findProfileOrThrow(String userId) {
        return profileRepository.findById(userId)
                .orElseThrow(() -> new ProfileNotFoundException(userId));
    }
}
