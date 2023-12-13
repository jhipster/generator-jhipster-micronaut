/**
 * Copyright 2013-2023 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const databaseArtifactForDB = {
  mariadb: {
    jdbc: { groupId: 'org.mariadb.jdbc', artifactId: 'mariadb-java-client' },
    // maria-r2dbc driver is failing.
    // r2dbc: { groupId: 'org.mariadb', artifactId: 'r2dbc-mariadb' },
    r2dbc: { groupId: 'io.asyncer', artifactId: 'r2dbc-mysql' },
  },
  mssql: {
    jdbc: { groupId: 'com.microsoft.sqlserver', artifactId: 'mssql-jdbc' },
    r2dbc: { groupId: 'io.r2dbc', artifactId: 'r2dbc-mssql' },
  },
  mysql: {
    jdbc: { groupId: 'com.mysql', artifactId: 'mysql-connector-j' },
    r2dbc: { groupId: 'io.asyncer', artifactId: 'r2dbc-mysql' },
  },
  postgresql: {
    jdbc: { groupId: 'org.postgresql', artifactId: 'postgresql' },
    r2dbc: { groupId: 'org.postgresql', artifactId: 'r2dbc-postgresql' },
  },
};

export const getDatabaseDriverForDatabase = databaseType => databaseArtifactForDB[databaseType];

export const getCommonMavenDefinition = () => ({
  dependencies: [
    { groupId: 'com.zaxxer', artifactId: 'HikariCP' },
    // { groupId: 'org.testcontainers', artifactId: 'jdbc', scope: 'test' },
  ],
});

export const getImperativeMavenDefinition = ({ javaDependencies }) => ({
  properties: [{ property: 'hibernate.version', value: javaDependencies.hibernate }],
  dependencies: [
    // { groupId: 'org.springframework.boot', artifactId: 'spring-boot-starter-data-jpa' },
    { groupId: 'com.fasterxml.jackson.datatype', artifactId: 'jackson-datatype-hibernate6' },
    // TODO drop forced version. Refer to https://github.com/jhipster/generator-jhipster/issues/22579
    // eslint-disable-next-line no-template-curly-in-string
    { groupId: 'org.hibernate.orm', artifactId: 'hibernate-core', version: '${hibernate.version}' },
    { groupId: 'org.hibernate.orm', artifactId: 'hibernate-jpamodelgen', scope: 'provided' },
    // { groupId: 'org.hibernate.validator', artifactId: 'hibernate-validator' },
    // { groupId: 'org.springframework.security', artifactId: 'spring-security-data' },
    { inProfile: 'IDE', groupId: 'org.hibernate.orm', artifactId: 'hibernate-jpamodelgen' },
  ],
  annotationProcessors: [
    // eslint-disable-next-line no-template-curly-in-string
    { groupId: 'org.hibernate.orm', artifactId: 'hibernate-jpamodelgen', version: '${hibernate.version}' },
  ],
});
