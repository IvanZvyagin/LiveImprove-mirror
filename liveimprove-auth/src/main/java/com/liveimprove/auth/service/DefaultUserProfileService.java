package com.liveimprove.auth.service;

import com.liveimprove.auth.entity.UserProfileEntity;
import com.liveimprove.auth.repository.UserProfileRepository;
import com.liveimprove.common.security.JwtClaimsExtractor;
import com.liveimprove.common.dto.UserInfo;
import com.liveimprove.domain.spi.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DefaultUserProfileService implements UserProfileService {

    private final UserProfileRepository profileRepository;
    @Override
    public UserInfo getUserInfo(String userId) {
        UserProfileEntity profile = profileRepository.findById(userId)
                .orElse(null);
        if(profile == null){
            return new UserInfo(userId,null,null,null);
        }

        return new UserInfo(
                userId,
                profile.getEmail(),
                null,
                profile.getName()
        );
    }
}
