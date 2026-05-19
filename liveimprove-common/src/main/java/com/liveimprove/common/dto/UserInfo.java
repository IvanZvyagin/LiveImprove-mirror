package com.liveimprove.common.dto;

import lombok.Builder;

@Builder
public record UserInfo(
        String userId,
        String email,
        String phone,
        String fullName)
{}
