package com.liveimprove.auth.controller;

import com.liveimprove.common.dto.UserInfo;
import com.liveimprove.common.security.JwtClaimsExtractor;
import com.liveimprove.domain.spi.UserProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {
    private final UserProfileService userProfileService;
    private final JwtClaimsExtractor claimsExtractor;


    @GetMapping("/me")
    public UserInfo me(@AuthenticationPrincipal Jwt jwt) {
        if (jwt == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Требуется Bearer JWT (Supabase access token)");
        }
        String userId = claimsExtractor.getUserId(jwt);
        return userProfileService.getUserInfo(userId);
    }
}
