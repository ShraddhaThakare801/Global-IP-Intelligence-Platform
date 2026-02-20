package com.ipplatform.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class IpBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(IpBackendApplication.class, args);
    }

    // Temporary fix for approved column issue
    @Bean
    CommandLineRunner fixApprovedColumn(JdbcTemplate jdbcTemplate) {
        return args -> {
            jdbcTemplate.execute(
                "ALTER TABLE users ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT FALSE;"
            );
            jdbcTemplate.execute(
                "UPDATE users SET approved = FALSE WHERE approved IS NULL;"
            );
            jdbcTemplate.execute(
                "ALTER TABLE users ALTER COLUMN approved SET NOT NULL;"
            );
            System.out.println("Approved column fixed successfully");
        };
    }
}