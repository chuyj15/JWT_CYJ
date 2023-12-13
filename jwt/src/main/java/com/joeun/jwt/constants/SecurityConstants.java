package com.joeun.jwt.constants;


//Security 및 JWT 관련된 상수를 관리하는 클래스
public class SecurityConstants {
    //JWT 토큰을 담을 HTTP 요청 헤더 이름
    public static final String TOKEN_HEADER = "Authorization";
    //헤더의 접두시
    public static final String TOKEN_PREFIX = "Bearer ";
    //토큰 타입
    public static final String TOKEN_TYPE = "JWT";

    //static :  인스턴스를 생성하지 않고도 클래스 이름을 통해 접근할 수 있습니다.
   //클래스의 모든 인스턴스에서 동일한 값을 공유
}
