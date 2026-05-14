package com.liveimprove.common.security;


import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class JwtClaimsExtractor {

    public String getUserId(Jwt jwt){
       return jwt.getSubject();
    }

    public String getEmail(Jwt jwt){
        return jwt.getClaimAsString("email");
    }

    public String getPhone(Jwt jwt){
        return jwt.getClaimAsString("phone");
    }

    public String getFullName(Jwt jwt){
        return jwt.getClaimAsString("user_metadata.full_name");
    }

}
