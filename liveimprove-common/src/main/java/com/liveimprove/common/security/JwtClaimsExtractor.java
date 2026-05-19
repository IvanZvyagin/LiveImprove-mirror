package com.liveimprove.common.security;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class JwtClaimsExtractor {

    public String getUserId(Jwt jwt) {
        return jwt.getSubject();
    }

    public UUID getUserIdAsUuid(Jwt jwt) {
        return UUID.fromString(getUserId(jwt));
    }

    public String getEmail(Jwt jwt) {
        return jwt.getClaimAsString("email");
    }

    public String getPhone(Jwt jwt) {
        return jwt.getClaimAsString("phone");
    }

    public String getFullName(Jwt jwt) {
        return fullNameFromMetadata(jwt);
    }

    private String fullNameFromMetadata(Jwt jwt) {
        Object userMetadata = jwt.getClaim("user_metadata");
        if (userMetadata instanceof Map<?, ?> map && map.get("full_name") instanceof String fullName) {
            return fullName;
        }
        return jwt.getClaimAsString("name");
    }
}
