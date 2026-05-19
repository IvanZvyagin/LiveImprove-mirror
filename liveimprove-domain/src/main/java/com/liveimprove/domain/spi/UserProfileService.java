package com.liveimprove.domain.spi;

import com.liveimprove.common.dto.UserInfo;

public interface UserProfileService {
    UserInfo getUserInfo(String userId);
}
