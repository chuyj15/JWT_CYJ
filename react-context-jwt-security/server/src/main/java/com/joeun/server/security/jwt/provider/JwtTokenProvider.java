package com.joeun.server.security.jwt.provider;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.joeun.server.dto.CustomUser;
import com.joeun.server.dto.UserAuth;
import com.joeun.server.dto.Users;
import com.joeun.server.mapper.UserMapper;
import com.joeun.server.prop.JwtProps;
import com.joeun.server.security.jwt.constants.JwtConstants;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT토큰 관련 기능을 제공해주는 클래스
 * 1. 토큰 생성
 * 2. 토큰 해석
 * 3. 토큰 유효성 검사
 */
@Slf4j
@Component
public class JwtTokenProvider {

    @Autowired
    private JwtProps jwtProps; // 시크릿키를 가져오는 용도

    @Autowired
    private UserMapper userMapper;

    /*
     * 👩‍💼➡️🔐 토큰 생성
     */
    public String createToken(int userNo, String userId, List<String> roles) {
        byte[] signingKey = getSigningKey();

        // JWT 토큰 생성
        String jwt = Jwts.builder()
                .signWith(getShaKey(), Jwts.SIG.HS512) // 서명에 사용할 키와 알고리즘 설정
                // .setHeaderParam("typ", SecurityConstants.TOKEN_TYPE) // deprecated (version:
                // before 1.0)
                .header() // update (version : after 1.0)
                .add("typ", JwtConstants.TOKEN_TYPE) // 헤더 설정 (JWT)
                .and()
                .expiration(new Date(System.currentTimeMillis() + 864000000)) // 토큰 만료 시간 설정 (10일)
                .claim("uno", "" + userNo) // 클레임 설정: 사용자 번호
                .claim("uid", userId) // 클레임 설정: 사용자 아이디
                .claim("rol", roles) // 클레임 설정: 권한
                .compact();
        log.info("jwt : " + jwt);
        return jwt;
    }

    // secretKey ➡️ signingKey
    private byte[] getSigningKey() {
        return jwtProps.getSecretKey().getBytes();
    }

    // secretKey ➡️ (HMAC-SHA algorithms) ➡️ signingKey
    private SecretKey getShaKey() {
        return Keys.hmacShaKeyFor(getSigningKey());
    }

    /**
     * 🔐➡👩‍💼 토큰 해석
     * 
     * Authorization : Bearer + {jwt} (authHeader)
     * ➡ jwt 추출
     * ➡ UsernamePasswordAuthenticationToken
     * 
     * @param authHeader
     * @return
     * @throws Exception
     */
    public UsernamePasswordAuthenticationToken getAuthentication(String authHeader) {
        if (authHeader == null || authHeader.length() == 0)
            return null;

        try {

            // jwt 추출
            String jwt = authHeader.replace("Bearer ", "");

            // 🔐➡👩‍💼 JWT 파싱
            Jws<Claims> parsedToken = Jwts.parser()
                    .verifyWith(getShaKey())
                    .build()
                    .parseSignedClaims(jwt);

            log.info("parsedToken : " + parsedToken);

            // 인증된 사용자 번호
            String userNo = parsedToken.getPayload().get("uno").toString();
            int no = (userNo == null ? 0 : Integer.parseInt(userNo));
            log.info("userNo : " + userNo);

            // 인증된 사용자 아이디
            String userId = parsedToken.getPayload().get("uid").toString();
            log.info("userId : " + userId);

            // 인증된 사용자 권한
            Claims claims = parsedToken.getPayload();
            Object roles = claims.get("rol");
            log.info("roles : " + roles);

            // 토큰에 userId 있는지 확인
            if (userId == null || userId.length() == 0)
                return null;

            Users user = new Users();
            user.setNo(no);
            user.setUserId(userId);
            // OK: 권한도 바로 Users 객체에 담아보기
            List<UserAuth> authList = ((List<?>) roles)
                    .stream()
                    .map(auth -> new UserAuth(userId, auth.toString()))
                    .collect(Collectors.toList());
            user.setAuthList(authList);

            // OK
            // CustomeUser 에 권한 담기
            List<SimpleGrantedAuthority> authorities = ((List<?>) roles)
                    .stream()
                    .map(auth -> new SimpleGrantedAuthority((String) auth))
                    .collect(Collectors.toList());

            // 토큰 유효하면
            // name, email 도 담아주기
            try {
                Users userInfo = userMapper.select(no);
                if (userInfo != null) {
                    user.setName(userInfo.getName());
                    user.setEmail(userInfo.getEmail());
                }
            } catch (Exception e) {
                log.error(e.getMessage());
                log.error("토큰 유효 -> DB 추가 정보 조회시 에러 발생...");
            }

            UserDetails userDetails = new CustomUser(user);

            // OK
            // new UsernamePasswordAuthenticationToken( 사용자정보객체, 비밀번호, 사용자의 권한(목록) );
            return new UsernamePasswordAuthenticationToken(userDetails, null, authorities);

        } catch (ExpiredJwtException exception) {
            log.warn("Request to parse expired JWT : {} failed : {}", authHeader, exception.getMessage());
        } catch (UnsupportedJwtException exception) {
            log.warn("Request to parse unsupported JWT : {} failed : {}", authHeader, exception.getMessage());
        } catch (MalformedJwtException exception) {
            log.warn("Request to parse invalid JWT : {} failed : {}", authHeader, exception.getMessage());
        } catch (IllegalArgumentException exception) {
            log.warn("Request to parse empty or null JWT : {} failed : {}", authHeader, exception.getMessage());
        }

        return null;
    }

    // 토큰의 유효성 검사
    public boolean validateToken(String jwt) {
        try {
            Jws<Claims> parsedToken = Jwts.parser()
                    .verifyWith(getShaKey()) // 시그니처가 위변조가 되었거나 다른값일 때 예외발생가능성이 있습니다.
                    .build()
                    .parseSignedClaims(jwt);

            log.info("토큰 만료 기간 : " + parsedToken.getPayload().getExpiration());
            /*
             * PAYLOAD
             * {
             * "exp": 1703140095, ⬅ 만료기한 추출
             * "uid": "joeun",
             * "rol": [
             * "ROLE_USER"
             * ]
             * }
             */

            Date exp = parsedToken.getPayload().getExpiration();
            // 오늘날짜와 만료날짜를 비교합니다.
            // true : 만료됨
            // false : 유효함
            return !exp.before(new Date()); // new Date() 하면 오늘날짜로 객체가 생성됩니다.
        } catch (ExpiredJwtException exception) {
            log.error("Token Expired"); // 토큰 만료
            return false;
        } catch (JwtException exception) {
            log.error("Token Tampered"); // 토큰 손상 : 헤더나 페이로드가 변조되었거나 시크릿키가 일치하지 않을때
            return false;
        } catch (NullPointerException exception) {
            log.error("Token is null"); // 토큰 없음
            return false;
        } catch (Exception e) {
            return false;
        }

    }

}
