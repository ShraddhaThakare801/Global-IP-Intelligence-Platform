package com.ipplatform.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/*this exclude is for ignoring jpa for now , but once the db is added, we have to remove this exclude*/
@SpringBootApplication(
    exclude = {
        DataSourceAutoConfiguration.class,
        HibernateJpaAutoConfiguration.class
    }
)
public class IpBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(IpBackendApplication.class, args);
	}

}
