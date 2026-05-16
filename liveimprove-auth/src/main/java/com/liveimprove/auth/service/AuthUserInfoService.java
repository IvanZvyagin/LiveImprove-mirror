package com.liveimprove.auth.service;

import com.liveimprove.common.dto.UserInfo;
import com.liveimprove.common.security.JwtClaimsExtractor;
import com.liveimprove.domain.spi.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthUserInfoService {
    private final UserProfileService userProfileService;
    private final JwtClaimsExtractor claimsExtractor;

    public UserInfo resolveUserInfo(Jwt jwt) {
        String userId = claimsExtractor.getUserId(jwt);
        UserInfo base = userProfileService.getUserInfo(userId);
        String email = claimsExtractor.getEmail(jwt);
        String phone = claimsExtractor.getPhone(jwt);
        String fullName = claimsExtractor.getFullName(jwt);
        return new UserInfo(
                userId,
                email != null ? email : base.email(),
                phone != null ? phone : base.phone(),
                fullName != null ? fullName : base.fullName());
    }
}
