package com.liveimprove.common.security;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class JwtClaimsExtractor {

    public String getUserId(Jwt jwt) {
        return jwt.getSubject();
    }

    public String getEmail(Jwt jwt) {
        return jwt.getClaimAsString("email");
    }

    public String getPhone(Jwt jwt) {
        return jwt.getClaimAsString("phone");
    }

    /**
     * Supabase кладёт произвольные поля в {@code user_metadata} (объект, не плоский claim с точкой).
     */
    public String getFullName(Jwt jwt) {
        Object raw = jwt.getClaim("user_metadata");
        if (raw instanceof Map<?, ?> map) {
            Object name = map.get("full_name");
            return name != null ? name.toString() : null;
        }
        return jwt.getClaimAsString("name");
    }
}
