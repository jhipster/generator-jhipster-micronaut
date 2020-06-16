/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
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
    sqlDbDrivers: {
        h2Disk: 'org.h2.Driver',
        h2Memory: 'org.h2.Driver',
        mysql: 'com.mysql.jdbc.Driver',
        postgresql: 'org.postgresql.Driver',
    },
    versions: {
        micronaut: '2.0.0.RC1',
        micronautData: '1.1.0.RC3',

        micronautLiquibaseConfiguration: '1.3.0',
        micronautHikariConfiguration: '2.2.6',
        micronautJmxConfiguration: '1.2.0',
        micronautMicrometerConfiguration: '1.3.1',
        micronautThymeleaf: '1.3.2',
        micronautSecurityJwt: '1.4.0',

        hibernate: '5.4.10.Final',
        javassist: '3.24.0-GA', // Should match Hibernate deps
        javaxMail: '1.6.2',
        jbcrypt: '0.4',
        jhipsterDeps: '3.8.0',
        liquibase: '3.6.3',
        liquibaseHibernate5: '3.6',
        logback: '1.2.3',
        mapstruct: '1.3.1.Final',
        mockito: '3.1.0',
        problem: '0.24.0',
        caffeine: '2.8.4',
        archunit: '0.14.1',
    },
};
