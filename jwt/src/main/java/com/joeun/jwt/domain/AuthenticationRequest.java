package com.joeun.jwt.domain;

import lombok.Data;

@Data
public class AuthenticationRequest {
    private String username;
    private String password;
    //얘네를 파라미터로 바인딩해서 가져오겠습니다. 
}
