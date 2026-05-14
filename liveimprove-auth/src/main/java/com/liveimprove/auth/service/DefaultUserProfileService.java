package com.liveimprove.auth.service;

import com.liveimprove.common.security.JwtClaimsExtractor;
import com.liveimprove.common.dto.UserInfo;
import com.liveimprove.domain.spi.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DefaultUserProfileService implements UserProfileService {
    private final JwtClaimsExtractor claimsExtractor;
//  private final ProfileRepository profileRepository;
    @Override
    public UserInfo getUserInfo(String userId) {
        // Здесь можно при необходимости найти/создать профиль в БД
        // Profile profile = profileRepository.findById(UUID.fromString(userId))
        //     .orElseGet(() -> createProfile(userId, email, fullName));

        return new UserInfo(userId,null,null,null);
    }



}
