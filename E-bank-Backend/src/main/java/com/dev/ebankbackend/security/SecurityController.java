package com.dev.ebankbackend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class SecurityController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtEncoder jwtEncoder;

    @GetMapping("/profile")
    public org.apache.tomcat.util.net.openssl.ciphers.Authentication authentication(org.apache.tomcat.util.net.openssl.ciphers.Authentication authentication) {
        return authentication;
    }
    @PostMapping("/login")
    public Map<String, String> login(@RequestParam String email, @RequestParam String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
            System.out.println(authentication);
            Instant now = Instant.now();
            String roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(" "));

            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuedAt(now)
                    .expiresAt(now.plus(30, ChronoUnit.MINUTES))
                    .subject(authentication.getName())
                    .claim("roles", roles)
                    .build();

            String token = jwtEncoder.encode(JwtEncoderParameters.from(
                    JwsHeader.with(MacAlgorithm.HS512).build(),
                    claims
            )).getTokenValue();

            return Map.of("access-token", token);
        } catch (Exception e) {
            throw new RuntimeException("Invalid email or password", e);
        }
    }
}
