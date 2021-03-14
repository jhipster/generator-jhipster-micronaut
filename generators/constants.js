/**
 * Copyright 2019-2021 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

module.exports = {
    GRADLE_VERSION: '6.8.1',
    DOCKER_REDIS: 'redis:6.2.1',
    sqlDb: {
        h2Disk: {
            driver: 'org.h2.Driver',
            dialect: 'io.github.jhipster.domain.util.FixedH2Dialect',
        },
        h2Memory: {
            driver: 'org.h2.Driver',
            dialect: 'io.github.jhipster.domain.util.FixedH2Dialect',
        },
        mysql: {
            driver: 'com.mysql.jdbc.Driver',
            dialect: 'org.hibernate.dialect.MySQL5InnoDBDialect',
        },
        mariadb: {
            driver: 'org.mariadb.jdbc.Driver',
            dialect: 'org.hibernate.dialect.MariaDB103Dialect',
        },
        postgresql: {
            driver: 'org.postgresql.Driver',
            dialect: 'io.github.jhipster.domain.util.FixedPostgreSQL10Dialect',
        },
    },
    versions: {
        micronaut: '2.4.0',
        micronautData: '2.3.1',
        micronautOpenApi: '2.3.1',

        hibernate: '5.4.29.Final',
        jackson: '2.12.2',
        javassist: '3.27.0-GA', // Should match Hibernate deps
        javaxMail: '1.6.2',
        jbcrypt: '0.4',
        liquibase: '4.3.1',
        liquibaseHibernate5: '4.1.1',
        logback: '1.2.3',
        mapstruct: '1.3.1.Final',
        swaggerAnnotations: '2.1.6',
        mockito: '3.1.0',
        problem: '0.24.0',
        caffeine: '2.8.8',
        archunit: '0.14.1',
        simplejavamail: '6.4.4',
        testcontainers: '1.15.2',
    },
};
