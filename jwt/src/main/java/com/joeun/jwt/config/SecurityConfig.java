package com.joeun.jwt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

// //SpringSecurity 5.4 이하
// @EnableWebSecurity
// public class SecurityConfig extends WebSecurityConfigurerAdapter {

//     @Override
//     protected void configure(HttpSecurity http) throws Exception {
//         super.configure(http);
//     }
    
// }

//SpringSecurity 5.5 이상
@Configuration //빈 설정 클래스
@EnableWebSecurity
public class SecurityConfig {
    //참고) 아래 메서드를 빈등록해준 이유 : Spring Security에서 필터 체인을 정의하고 구성하는 메서드를 @Bean으로 등록하여 Spring IoC 컨테이너가 이를 관리할 수 있게 하기 때문
    //@Configuration 어노테이션이 있는 클래스에서 @Bean으로 선언된 메서드가 있으면, 이 메서드의 반환값은 Spring IoC 컨테이너에 의해 빈으로 관리됩니다.
    @Bean
    // 참고) HttpSecurity는 Spring Security에서 제공하는 구성 클래스로, 웹 보안을 구성하는 데 사용됩니다.
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        //폼기반 로그인 비활성화
        //http.formLogin().disable();   //람다식으로 쓰면
        http.formLogin((login)->login.disable());
        //http 기본인증 비활성화
        //http.httpBasic().disable(); //람다식으로 쓰면
        http.httpBasic((basic)->basic.disable());
        //CSRF 공격 방어 기능 비활성화
        http.csrf((csrf)->csrf.disable());
        //세션 관리 정책 설정 //세션인증을 사용하지 않고, JWT를 사용하여 인증하기 때문에 세션 불필요
        http.sessionManagement(management->management.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build(); //시큐리티필터체인을 반환해줌. 
    }

}

//참고 )  @Configuration 이랑 @Component랑 무슨 차이??
//@Component 어노테이션은 어떤 클래스를 Spring의 컴포넌트로 등록할 때 사용됩니다. 
//@Configuration 어노테이션은 이 클래스가 스프링의 구성 클래스임을 나타냅니다. 구성 클래스에서 @Bean으로 선언된 메서드들은 해당 클래스가 스프링 빈을 정의하고 구성한다는 것을 의미합니다.