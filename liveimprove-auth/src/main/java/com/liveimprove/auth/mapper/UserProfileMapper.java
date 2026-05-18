package com.liveimprove.auth.mapper;

import com.liveimprove.auth.dto.NotificationSettings;
import com.liveimprove.auth.dto.UserProfileResponse;
import com.liveimprove.auth.entity.UserProfileEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserProfileMapper {

    @Mapping(target = "notification", expression = "java(toNotifications(entity))")
    UserProfileResponse toResponse(UserProfileEntity entity);

    default NotificationSettings toNotifications(UserProfileEntity entity) {
        return new NotificationSettings(
                entity.getNotifEmail(),
                entity.getNotifPush(),
                entity.getNotifHabits(),
                entity.getNotifGoals()
        );
    }
}
