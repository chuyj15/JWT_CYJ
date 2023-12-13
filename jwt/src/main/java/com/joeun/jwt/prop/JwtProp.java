package com.joeun.jwt.prop;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

//applicaion.properties에 넣어놓은 시크릿키를 가져오는 클래스
@Data //겟터, 셋터
@Component //클래스를 빈으로 등록하는 어노테이션
@ConfigurationProperties("com.joeun.jwt") //com.joeun.jwt 경로 하위 속성들을 지정
//key값이 secret-key 과 같이 중앙 하이픈(-)이 포함된 경우 카멜표기법으로 변환된 key가 멤버변수와 연결된다.
public class JwtProp {
    //com.joeun.jwt.secret-key 
    private String secretKey;
}