package com.liveimprove.auth.controller;

import com.liveimprove.auth.dto.UpdateAvatarRequest;
import com.liveimprove.auth.dto.UpdateNotificationsRequest;
import com.liveimprove.auth.dto.UpdateProfileRequest;
import com.liveimprove.auth.dto.UserProfileResponse;
import com.liveimprove.auth.mapper.UserProfileMapper;
import com.liveimprove.auth.service.ProfileService;
import com.liveimprove.common.security.JwtClaimsExtractor;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final ProfileService profileService;
    private final UserProfileMapper profileMapper;
    private final JwtClaimsExtractor claimsExtractor;

    @GetMapping("/me")
    public UserProfileResponse getMyProfile(@AuthenticationPrincipal Jwt jwt){
        return profileMapper.toResponse(profileService.getOrCreateProfile(
                claimsExtractor.getUserId(jwt),
                claimsExtractor.getEmail(jwt),
                claimsExtractor.getFullName(jwt)));
    }

    @PutMapping("/me")
    @ResponseStatus(HttpStatus.OK)
    public UserProfileResponse updateMyProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateProfileRequest request){
        return profileMapper.toResponse(profileService.updateProfile(claimsExtractor.getUserId(jwt), request));
    }

    @PutMapping("/me/avatar")
    @ResponseStatus(HttpStatus.OK)
    public UserProfileResponse updateMyAvatar(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateAvatarRequest request){
        return profileMapper.toResponse(profileService.updateAvatar(
                claimsExtractor.getUserId(jwt), request.avatarDataUrl()));
    }

    @PutMapping("/me/notifications")
    @ResponseStatus(HttpStatus.OK)
    public UserProfileResponse updateMyNotifications(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody UpdateNotificationsRequest request){
        return profileMapper.toResponse(profileService.updateNotifications(claimsExtractor.getUserId(jwt), request));
    }
}
