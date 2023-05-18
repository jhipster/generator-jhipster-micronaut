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
  GRADLE_VERSION: '7.4.2',
  DOCKER_REDIS: 'redis:6.0.10',
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
    micronaut: '3.9.1',
    micronautData: '3.10.0',
    micronautOpenApi: '2.3.1',
    rxJava3: '2.3.0',
    hibernate: '5.5.9.Final',
    jackson: '2.13.3',
    javassist: '3.27.0-GA', // Should match Hibernate deps
    javaxMail: '2.0.1',
    jbcrypt: '0.4',
    jhipsterDeps: '3.8.0',
    liquibase: '4.14.0',
    liquibaseHibernate5: '4.1.1',
    logback: '1.2.11',
    mapstruct: '1.3.1.Final',
    swaggerAnnotations: '2.2.2',
    mockito: '3.6.28',
    problem: '0.24.0',
    caffeine: '3.1.1',
    archunit: '0.23.1',
    simplejavamail: '7.5.0',
    testcontainers: '1.17.3',
  },
};
