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
    logback: '1.5.3',
  },
};
