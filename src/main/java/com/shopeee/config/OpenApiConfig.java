package com.shopeee.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI shopeeeOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Shopeee E-Commerce API")
                        .description("Microservices: Product · Cart · Order · Payment")
                        .version("1.0.0"));
    }
}
