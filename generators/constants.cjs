/**
 * Copyright 2019-2024 the original author or authors from the JHipster project.
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
  JAVA_VERSION: 17,
  GRADLE_VERSION: '8.6',
  DOCKER_REDIS: 'redis:6.0.10',
  sqlDb: {
    h2Disk: {
      driver: 'org.h2.Driver',
      dialect: 'org.hibernate.dialect.H2Dialect',
    },
    h2Memory: {
      driver: 'org.h2.Driver',
      dialect: 'org.hibernate.dialect.H2Dialect',
    },
    mysql: {
      driver: 'com.mysql.jdbc.Driver',
      dialect: 'org.hibernate.dialect.MySQL8Dialect',
    },
    mariadb: {
      driver: 'org.mariadb.jdbc.Driver',
      dialect: 'org.hibernate.dialect.MariaDB103Dialect',
    },
    postgresql: {
      driver: 'org.postgresql.Driver',
      dialect: 'org.hibernate.dialect.PostgreSQLDialect',
    },
    oracle: {
      driver: 'oracle.jdbc.OracleDriver',
      dialect: 'org.hibernate.dialect.Oracle12cDialect',
    },
    mssql: {
      driver: '',
      dialect: 'org.hibernate.dialect.SQLServer2012Dialect',
    },
  },
  versions: {
    netty: '4.1.107.Final',
    rxJava3: '2.3.0',
    hibernate: '6.4.4.Final',
    prometheusSimpleclient: '0.16.0',
    jackson: '2.15.2',
    javassist: '3.27.0-GA', // Should match Hibernate deps
    javaxMail: '2.0.1',
    jbcrypt: '0.4',
    logback: '1.5.3',
    mapstruct: '1.5.5.Final',
    swaggerAnnotations: '2.2.19',
    mockito: '5.10.0',
    problem: '0.29.1',
    caffeine: '3.1.8',
    archunit: '1.2.1',
    simplejavamail: '8.6.3',
    testcontainers: '1.19.6',
    assertj: '3.25.3',
  },
};
