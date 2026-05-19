package com.liveimprove.auth.controller;

import com.liveimprove.auth.service.AuthUserInfoService;
import com.liveimprove.common.dto.UserInfo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@Slf4j
@RequiredArgsConstructor
public class AuthController {
    private final AuthUserInfoService authUserInfoService;


    @GetMapping("/me")
    public UserInfo me(@AuthenticationPrincipal Jwt jwt) {
        return authUserInfoService.resolveUserInfo(jwt);
    }
}
