package com.liveimprove.auth.service;

import com.liveimprove.auth.dto.UpdateNotificationsRequest;
import com.liveimprove.auth.dto.UpdateProfileRequest;
import com.liveimprove.auth.entity.UserProfileEntity;

public interface ProfileService {
    UserProfileEntity getOrCreateProfile(String userId, String email, String name);

    UserProfileEntity updateProfile(String userId, UpdateProfileRequest request);

    UserProfileEntity updateAvatar(String userId, String avatarDataUrl);

    UserProfileEntity updateNotifications(String userId, UpdateNotificationsRequest request);


}
