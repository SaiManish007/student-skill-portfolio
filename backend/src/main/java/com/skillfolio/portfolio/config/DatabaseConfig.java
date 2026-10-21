package com.skillfolio.portfolio.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConfig.class);

    private final Environment environment;

    public DatabaseConfig(Environment environment) {
        this.environment = environment;
    }

    /**
     * Parses standard cloud DATABASE_URL (e.g. Render, Railway, Heroku) if present.
     * Format: postgres://username:password@hostname:port/database
     * Falls back to standard spring.datasource.* properties if DATABASE_URL is not set.
     */
    @Bean
    @Primary
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource dataSourceFromDatabaseUrl() {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        logger.info("Initializing DataSource from DATABASE_URL environment variable");

        try {
            // Normalize postgres:// to postgresql:// URI parsing
            if (databaseUrl.startsWith("postgres://")) {
                databaseUrl = "postgresql://" + databaseUrl.substring("postgres://".length());
            }

            URI dbUri = new URI(databaseUrl);
            String userInfo = dbUri.getUserInfo();
            String username = "";
            String password = "";

            if (userInfo != null && userInfo.contains(":")) {
                String[] credentials = userInfo.split(":", 2);
                username = credentials[0];
                password = credentials[1];
            } else if (userInfo != null) {
                username = userInfo;
            }

            int port = dbUri.getPort() > 0 ? dbUri.getPort() : 5432;
            String path = dbUri.getPath();
            String dbName = (path != null && path.length() > 1) ? path.substring(1) : "skillfolio";

            String jdbcUrl = String.format("jdbc:postgresql://%s:%d/%s", dbUri.getHost(), port, dbName);

            // Append query parameters if present (e.g. sslmode)
            if (dbUri.getQuery() != null && !dbUri.getQuery().isEmpty()) {
                jdbcUrl += "?" + dbUri.getQuery();
            }

            return DataSourceBuilder.create()
                    .driverClassName("org.postgresql.Driver")
                    .url(jdbcUrl)
                    .username(username)
                    .password(password)
                    .build();
        } catch (URISyntaxException e) {
            logger.error("Failed to parse DATABASE_URL: {}. Falling back to standard DataSource.", e.getMessage());
            throw new IllegalStateException("Invalid DATABASE_URL configuration", e);
        }
    }
}
