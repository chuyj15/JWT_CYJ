package com.joeun.jwt.controller;
import org.springframework.web.bind.annotation.RestController;
import com.joeun.jwt.constants.SecurityConstants;
import com.joeun.jwt.domain.AuthenticationRequest;
import com.joeun.jwt.prop.JwtProp;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.GetMapping;

@Slf4j
@RestController
public class LoginController {

    @Autowired
    JwtProp jwtProp;

    //login
    //  {”username” : “user”, “password” : “123456” } 
    @PostMapping("login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        String username = request.getUsername();
        String password = request.getPassword();
        log.info("password는" + password);
        log.info("username은 " + username);
        //사용자 권한
        List<String> roles = new ArrayList<>();
        roles.add("ROLE_ADMIN");
        roles.add("ROLE_USER");

        byte[] signingKey = jwtProp.getSecretKey().getBytes();
        //참고: builder()가 스태틱메소드이기 때문에 Jwts 객체를 생성하기 전에(new Jwts()) 이 메소드를 사용할 수있는 거에요. 
        //Jwts는 jwts 라이브러리에서 가져왔습니다. 
        //✅jwt 토큰 생성
        String jwt = Jwts.builder() //JWT를 생성하기 위한 빌더 객체를 시작합니다.
                            // .signWith(시크릿키, 알고리즘)   //  JWT에 서명을 추가합니다. 
                            .signWith(Keys.hmacShaKeyFor(signingKey), Jwts.SIG.HS512)  //시그니처 사용할 비밀키, 알고리즘 설정
                            .header()  // JWT의 헤더 부분을 설정하기 위해 호출합니다.
                            .add("typ", SecurityConstants.TOKEN_TYPE)       //type: JWT
                            .and() //헤더 부분의 설정을 마치고, 이제 페이로드(Payload) 부분의 설정을 시작합니다.
                            .expiration(new Date(System.currentTimeMillis() + 1000*60*60*24*5) )        //토큰 만료 시간 설정 (5일)
                            .claim("uid", username)     //PAYLOAD에 데이터 집어넣기 - uid : user
                            .claim("rol", roles)           //PAYLOAD에 데이터 집어넣기 - rol : roles
                            .compact();         //최종적으로 JWT(토큰)를 생성하고 문자열로 변환합니다
        log.info("jwt: "+jwt);
        return new ResponseEntity<String>(jwt, HttpStatus.OK);
    }
    
    @GetMapping("/user/info")
    public ResponseEntity<?> userInfo(@RequestHeader(name="Authorization") String header) {
        log.info("====header====");
        log.info("Authorization : "+ header);
        //Authorization : Bearer ${jwt}
        String jwt = header.replace(SecurityConstants.TOKEN_PREFIX, ""); // "Bearer " 다음에 오는 JWT에서 "Bearer " 부분을 제거하여 순수한 JWT 문자열을 얻습니다.
        byte[] signingKey = jwtProp.getSecretKey().getBytes();
        //✅토큰 해석
        // Jws는 "Json Web Signature"의 약자로, 서명된 JWT를 나타냅니다. 
        //Claims는 JWT의 페이로드에 포함된 클레임 정보를 나타냅니다.
        Jws<Claims> parsedToken = Jwts.parser() //JWT를 해석하고 검증하는 데 사용되는 JwtParser 인스턴스를 생성합니다.
                                    .verifyWith(Keys.hmacShaKeyFor(signingKey)) //HMAC (Hash-based Message Authentication Code) 서명에 사용되는 키를 생성
                                    .build() // JwtParser 인스턴스를 빌드합니다. 이때 설정한 서명 검증 알고리즘과 키 등이 적용됩니다.
                                    .parseSignedClaims(jwt); //주어진 JWT 문자열을 검증하고 해석 (서명검증, 만료시간 확인...)
        log.info("parsedToken : "+ parsedToken);
        String username = parsedToken.getPayload().get("uid").toString();
        log.info("username : "+ username);
        Claims claims = parsedToken.getPayload();
        Object roles = claims.get("rol");
        log.info("roles : "+roles);
        return new ResponseEntity<String>(parsedToken.toString(), HttpStatus.OK);
    }
    //토큰 해석 ---필터에서 해줘야 한다. 
    //클라이언트에선 암호화된 jwt만 알아도 된다. 

}