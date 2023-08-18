/**
 * Copyright 2019-2023 the original author or authors from the JHipster project.
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
const constants = require('generator-jhipster/generators/generator-constants');
const baseServerFiles = require('generator-jhipster/generators/server/files').serverFiles;

/* Constants use throughout */
const { INTERPOLATE_REGEX, SERVER_MAIN_SRC_DIR, SERVER_MAIN_RES_DIR, SERVER_TEST_SRC_DIR, SERVER_TEST_RES_DIR, DOCKER_DIR } = constants;

/* TODO: Do a PR in the parent JHipster project to export and re-use here as well in order to have a single source of truth!!!
const TEST_DIR = constants.TEST_DIR;
*/
const shouldSkipUserManagement = generator =>
  generator.skipUserManagement && (generator.applicationType !== 'monolith' || generator.authenticationType !== 'oauth2');

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
  jib: baseServerFiles.jib,
  docker: [
    {
      path: DOCKER_DIR,
      templates: [
        'sonar.yml',
        'monitoring.yml',
        'prometheus/prometheus.yml',
        'grafana/provisioning/dashboards/dashboard.yml',
        'grafana/provisioning/dashboards/JVM.json',
        'grafana/provisioning/datasources/datasource.yml',
      ],
    },
    {
      path: DOCKER_DIR,
      templates: [{ file: 'app.yml', useBluePrint: true }],
    },
    {
      condition: generator => generator.prodDatabaseType !== 'no' && generator.prodDatabaseType !== 'oracle',
      path: DOCKER_DIR,
      templates: [{ file: generator => `${generator.prodDatabaseType}.yml`, useBluePrint: true }],
    },
    {
      condition: generator => generator.prodDatabaseType === 'mongodb',
      path: DOCKER_DIR,
      templates: ['mongodb-cluster.yml', 'mongodb/MongoDB.Dockerfile', 'mongodb/scripts/init_replicaset.js'],
    },
    {
      condition: generator => generator.prodDatabaseType === 'couchbase',
      path: DOCKER_DIR,
      templates: ['couchbase-cluster.yml', 'couchbase/Couchbase.Dockerfile', 'couchbase/scripts/configure-node.sh'],
    },
    {
      condition: generator => generator.prodDatabaseType === 'cassandra',
      path: DOCKER_DIR,
      templates: [
        // docker-compose files
        'cassandra-cluster.yml',
        'cassandra-migration.yml',
        // dockerfiles
        'cassandra/Cassandra-Migration.Dockerfile',
        // scripts
        'cassandra/scripts/autoMigrate.sh',
        'cassandra/scripts/execute-cql.sh',
      ],
    },
    {
      condition: generator => generator.cacheProvider === 'hazelcast',
      path: DOCKER_DIR,
      templates: ['hazelcast-management-center.yml'],
    },
    {
      condition: generator => generator.cacheProvider === 'memcached',
      path: DOCKER_DIR,
      templates: ['memcached.yml'],
    },
    {
      condition: generator => generator.cacheProvider === 'redis',
      path: DOCKER_DIR,
      templates: ['redis.yml', 'redis-cluster.yml', 'redis/Redis-Cluster.Dockerfile', 'redis/connectRedisCluster.sh'],
    },
    {
      condition: generator => generator.searchEngine === 'elasticsearch',
      path: DOCKER_DIR,
      templates: ['elasticsearch.yml'],
    },
    {
      condition: generator => generator.messageBroker === 'kafka',
      path: DOCKER_DIR,
      templates: ['kafka.yml'],
    },
    {
      condition: generator => !!generator.serviceDiscoveryType,
      path: DOCKER_DIR,
      templates: [{ file: 'config/README.md', renameTo: () => 'central-server-config/README.md' }],
    },
    {
      condition: generator => generator.serviceDiscoveryType && generator.serviceDiscoveryType === 'consul',
      path: DOCKER_DIR,
      templates: [
        'consul.yml',
        'config/git2consul.json',
        {
          file: 'config/consul-config/application.yml',
          useBluePrint: true,
          renameTo: () => 'central-server-config/application.yml',
        },
      ],
    },
    {
      condition: generator => generator.serviceDiscoveryType && generator.serviceDiscoveryType === 'eureka',
      path: DOCKER_DIR,
      templates: [
        'jhipster-registry.yml',
        {
          file: 'config/docker-config/application.yml',
          renameTo: () => 'central-server-config/docker-config/application.yml',
        },
        {
          file: 'config/localhost-config/application.yml',
          renameTo: () => 'central-server-config/localhost-config/application.yml',
        },
      ],
    },
    {
      condition: generator => !!generator.enableSwaggerCodegen,
      path: DOCKER_DIR,
      templates: ['swagger-editor.yml'],
    },
    {
      condition: generator => generator.authenticationType === 'oauth2' && generator.applicationType !== 'microservice',
      path: DOCKER_DIR,
      templates: ['keycloak.yml', { file: 'config/realm-config/jhipster-realm.json', renameTo: () => 'realm-config/jhipster-realm.json' }],
    },
  ],
  serverResources: [
    {
      condition: generator => generator.devDatabaseType === 'h2Disk' || generator.devDatabaseType === 'h2Memory',
      path: SERVER_MAIN_RES_DIR,
      templates: [{ file: 'h2.server.properties', renameTo: () => '.h2.server.properties' }],
    },
    {
      condition: generator => !!generator.enableSwaggerCodegen,
      path: SERVER_MAIN_RES_DIR,
      templates: ['swagger/api.yml'],
    },
    {
      condition: generator => !generator.skipClient,
      transform: false,
      templates: ['npmw', 'npmw.cmd'],
    },
    {
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'templates/error.html',
          renameTo: () => 'views/error.html',
        },
        { file: 'logback.xml', useBluePrint: true },
        { file: 'application.yml', useBluePrint: true },
        { file: 'application-dev.yml', useBluePrint: true },
        { file: 'application-tls.yml', useBluePrint: true },
        { file: 'application-prod.yml', useBluePrint: true },
        { file: 'i18n/messages.properties', useBluePrint: true, noEjs: true },
      ],
    },
    {
      path: SERVER_TEST_RES_DIR,
      templates: [{ file: 'application-test.yml', useBluePrint: true }],
    },
    // Emails should be fine to import from base generator, no need for useBluePrint
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_MAIN_RES_DIR,
      templates: [
        { file: 'templates/mail/activationEmail.html', renameTo: () => 'views/mail/activationEmail.html' },
        { file: 'templates/mail/creationEmail.html', renameTo: () => 'views/mail/creationEmail.html' },
        { file: 'templates/mail/passwordResetEmail.html', renameTo: () => 'views/mail/passwordResetEmail.html' },
        { file: 'views/mail/testEmail.html', useBluePrint: true, noEjs: true },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_TEST_RES_DIR,
      templates: [
        /* User management java test files */
        'i18n/messages_en.properties',
      ],
    },
    {
      condition: generator => generator.databaseType === 'sql',
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'config/liquibase/master.xml',
          useBluePrint: true,
        },
        {
          file: 'config/liquibase/changelog/initial_schema.xml',
          renameTo: () => 'config/liquibase/changelog/00000000000000_initial_schema.xml',
          options: { interpolate: INTERPOLATE_REGEX },
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator =>
        generator.databaseType === 'sql' && (!generator.skipUserManagement || generator.authenticationType === 'oauth2'),
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'config/liquibase/data/authority.csv',
        },
        {
          file: 'config/liquibase/data/user_authority.csv',
        },
        {
          file: 'config/liquibase/data/user.csv',
        },
      ],
    },
    {
      condition: generator =>
        generator.databaseType === 'mongodb' &&
        (!generator.skipUserManagement || (generator.skipUserManagement && generator.authenticationType === 'oauth2')),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/dbmigrations/InitialSetupMigration.kt',
          renameTo: generator => `${generator.javaDir}config/dbmigrations/InitialSetupMigration.kt`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => generator.databaseType === 'couchbase',
      path: SERVER_MAIN_RES_DIR,
      templates: ['config/couchmove/changelog/V0__create_indexes.n1ql'],
    },
    {
      condition: generator =>
        generator.databaseType === 'couchbase' && (!generator.skipUserManagement || generator.authenticationType === 'oauth2'),
      path: SERVER_MAIN_RES_DIR,
      templates: [
        'config/couchmove/changelog/V0.1__initial_setup/ROLE_ADMIN.json',
        'config/couchmove/changelog/V0.1__initial_setup/ROLE_USER.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__admin.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__anonymoususer.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__system.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__user.json',
      ],
    },
    {
      condition: generator => generator.databaseType === 'cassandra',
      path: SERVER_MAIN_RES_DIR,
      templates: [
        'config/cql/create-keyspace-prod.cql',
        'config/cql/create-keyspace.cql',
        'config/cql/drop-keyspace.cql',
        { file: 'config/cql/changelog/README.md', method: 'copy' },
      ],
    },
    {
      condition: generator =>
        generator.databaseType === 'cassandra' &&
        generator.applicationType !== 'microservice' &&
        (!generator.skipUserManagement || generator.authenticationType === 'oauth2'),
      path: SERVER_MAIN_RES_DIR,
      templates: [
        { file: 'config/cql/changelog/create-tables.cql', renameTo: () => 'config/cql/changelog/00000000000000_create-tables.cql' },
        {
          file: 'config/cql/changelog/insert_default_users.cql',
          renameTo: () => 'config/cql/changelog/00000000000001_insert_default_users.cql',
        },
      ],
    },
  ],
  serverMicroserviceAndGateway: [
    {
      condition: generator => generator.serviceDiscoveryType,
      path: SERVER_MAIN_RES_DIR,
      templates: [{ file: 'bootstrap.yml', useBluePrint: true }],
    },
    {
      condition: generator => generator.serviceDiscoveryType,
      path: SERVER_TEST_RES_DIR,
      templates: [{ file: 'bootstrap-test.yml', useBluePrint: true }],
    },
  ],
  // TODO WIP Adding files in here, will need to properly conditional and remove some in the future
  serverJavaApp: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/App.java',
          renameTo: generator => `${generator.javaDir}${generator.mainClass}.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  // I'm going to organize these by package, for lack of a better means of organizing right now
  serverJavaConfig: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/ActiveProfilesInfoSource.java',
          renameTo: generator => `${generator.javaDir}config/ActiveProfilesInfoSource.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/ApplicationProperties.java',
          renameTo: generator => `${generator.javaDir}config/ApplicationProperties.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/Constants.java',
          renameTo: generator => `${generator.javaDir}config/Constants.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/DefaultProfileUtil.java',
          renameTo: generator => `${generator.javaDir}config/DefaultProfileUtil.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/JacksonConfiguration.java',
          renameTo: generator => `${generator.javaDir}config/JacksonConfiguration.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/JHipsterConfigurationEndpoint.java',
          renameTo: generator => `${generator.javaDir}config/JHipsterConfigurationEndpoint.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/LoggingConfiguration.java',
          renameTo: generator => `${generator.javaDir}config/LoggingConfiguration.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/MessagesBundleMessageSource.java',
          renameTo: generator => `${generator.javaDir}config/MessagesBundleMessageSource.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/package-info.java',
          renameTo: generator => `${generator.javaDir}config/package-info.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/SnakeCasePhysicalNamingStrategy.java',
          renameTo: generator => `${generator.javaDir}config/SnakeCasePhysicalNamingStrategy.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/metric/JHipsterMetricsEndpoint.java',
          renameTo: generator => `${generator.javaDir}config/metric/JHipsterMetricsEndpoint.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => ['ehcache', 'caffeine', 'redis'].includes(generator.cacheProvider),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/config/CacheConfiguration.java',
          renameTo: generator => `${generator.javaDir}config/CacheConfiguration.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => generator.cacheProvider === 'redis',
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/RedisTestContainerExtension.java',
          renameTo: generator => `${generator.testDir}RedisTestContainerExtension.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaDomain: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/package-info.java',
          renameTo: generator => `${generator.javaDir}domain/package-info.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/Authority.java',
          renameTo: generator => `${generator.javaDir}domain/Authority.java`,
          useBluePrint: true,
        },
        {
          file: 'package/domain/User.java',
          renameTo: generator => `${generator.javaDir}domain/User.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaRepository: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/repository/package-info.java',
          renameTo: generator => `${generator.javaDir}repository/package-info.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/repository/AuthorityRepository.java',
          renameTo: generator => `${generator.javaDir}repository/AuthorityRepository.java`,
          useBluePrint: true,
        },
        {
          file: 'package/repository/UserRepository.java',
          renameTo: generator => `${generator.javaDir}repository/UserRepository.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaOpenApi: [
    {
      templates: [
        {
          file: 'openapi.properties',
          useBluePrint: true,
        },
      ],
    },
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/SwaggerResource.java',
          renameTo: generator => `${generator.javaDir}web/rest/SwaggerResource.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaSecurity: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/security/AuthoritiesConstants.java',
          renameTo: generator => `${generator.javaDir}security/AuthoritiesConstants.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/NotAuthenticatedResponse.java',
          renameTo: generator => `${generator.javaDir}security/NotAuthenticatedResponse.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/package-info.java',
          renameTo: generator => `${generator.javaDir}security/package-info.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/SecurityUtils.java',
          renameTo: generator => `${generator.javaDir}security/SecurityUtils.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/SecurityHeaderFilter.java',
          renameTo: generator => `${generator.javaDir}security/SecurityHeaderFilter.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/security/Logout.java',
          renameTo: generator => `${generator.javaDir}security/Logout.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/UserNotActivatedException.java',
          renameTo: generator => `${generator.javaDir}security/UserNotActivatedException.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => generator.authenticationType === 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/security/ApiLogoutController.java',
          renameTo: generator => `${generator.javaDir}security/ApiLogoutController.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/JHipsterOpenIdUserDetailsMapper.java',
          renameTo: generator => `${generator.javaDir}security/JHipsterOpenIdUserDetailsMapper.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/JHipsterEndSessionEndpoint.java',
          renameTo: generator => `${generator.javaDir}security/JHipsterEndSessionEndpoint.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement && generator.authenticationType !== 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/security/PasswordEncoder.java',
          renameTo: generator => `${generator.javaDir}security/PasswordEncoder.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/BcryptPasswordEncoder.java',
          renameTo: generator => `${generator.javaDir}security/BcryptPasswordEncoder.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/DatabaseAuthenticationProvider.java',
          renameTo: generator => `${generator.javaDir}security/DatabaseAuthenticationProvider.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaService: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/package-info.java',
          renameTo: generator => `${generator.javaDir}service/dto/package-info.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/mapper/package-info.java',
          renameTo: generator => `${generator.javaDir}service/mapper/package-info.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/util/RandomUtil.java',
          renameTo: generator => `${generator.javaDir}service/util/RandomUtil.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/package-info.java',
          renameTo: generator => `${generator.javaDir}service/package-info.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/PasswordChangeDTO.java',
          renameTo: generator => `${generator.javaDir}service/dto/PasswordChangeDTO.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/mapper/UserMapper.java',
          renameTo: generator => `${generator.javaDir}service/mapper/UserMapper.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/MailSenderFactory.java',
          renameTo: generator => `${generator.javaDir}service/MailSenderFactory.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/MailService.java',
          renameTo: generator => `${generator.javaDir}service/MailService.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/AdminUserDTO.java',
          renameTo: generator => `${generator.javaDir}service/dto/${generator.asDto('AdminUser')}.java`,
          useBluePrint: true,
        },

        {
          file: 'package/service/dto/UserDTO.java',
          renameTo: generator => `${generator.javaDir}service/dto/${generator.asDto('User')}.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/UserService.java',
          renameTo: generator => `${generator.javaDir}service/UserService.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaUtil: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/util/HeaderUtil.java',
          renameTo: generator => `${generator.javaDir}util/HeaderUtil.java`,
          useBluePrint: true,
        },
        {
          file: 'package/util/JHipsterProperties.java',
          renameTo: generator => `${generator.javaDir}util/JHipsterProperties.java`,
          useBluePrint: true,
        },
        {
          file: 'package/util/PaginationUtil.java',
          renameTo: generator => `${generator.javaDir}util/PaginationUtil.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaRest: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        // Handlers
        {
          file: 'package/web/rest/errors/handlers/AbstractThrowableProblemHandler.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/handlers/AbstractThrowableProblemHandler.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/handlers/ConstraintViolationExceptionHandler.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/handlers/ConstraintViolationExceptionHandler.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/handlers/ProblemHandler.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/handlers/ProblemHandler.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/handlers/ProblemRejectionHandler.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/handlers/ProblemRejectionHandler.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/handlers/UnsatisfiedRouteExceptionHandler.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/handlers/UnsatisfiedRouteExceptionHandler.java`,
          useBluePrint: true,
        },
        // Errors
        {
          file: 'package/web/rest/errors/BadRequestAlertException.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/BadRequestAlertException.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/ErrorConstants.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/ErrorConstants.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/FieldErrorVM.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/FieldErrorVM.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/package-info.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/package-info.java`,
          useBluePrint: true,
        },
        // VM
        {
          file: 'package/web/rest/vm/package-info.java',
          renameTo: generator => `${generator.javaDir}web/rest/vm/package-info.java`,
          useBluePrint: true,
        },
        // Base rest pkg
        {
          file: 'package/web/rest/package-info.java',
          renameTo: generator => `${generator.javaDir}web/rest/package-info.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        // Handlers
        {
          file: 'package/web/rest/errors/EmailAlreadyUsedException.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/EmailAlreadyUsedException.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/EmailNotFoundException.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/EmailNotFoundException.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/InvalidPasswordException.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/InvalidPasswordException.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/LoginAlreadyUsedException.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/LoginAlreadyUsedException.java`,
          useBluePrint: true,
        },
        // VM
        {
          file: 'package/web/rest/vm/KeyAndPasswordVM.java',
          renameTo: generator => `${generator.javaDir}web/rest/vm/KeyAndPasswordVM.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/vm/LoginVM.java',
          renameTo: generator => `${generator.javaDir}web/rest/vm/LoginVM.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/vm/ManagedUserVM.java',
          renameTo: generator => `${generator.javaDir}web/rest/vm/ManagedUserVM.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/PublicUserResource.java',
          renameTo: generator => `${generator.javaDir}web/rest/PublicUserResource.java`,
          useBluePrint: true,
        },
        // Base rest pkg
        {
          file: 'package/web/rest/ClientForwardController.java',
          renameTo: generator => `${generator.javaDir}web/rest/ClientForwardController.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/UserResource.java',
          renameTo: generator => `${generator.javaDir}web/rest/UserResource.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement || generator.authenticationType === 'oauth2',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        // Base rest pkg
        {
          file: 'package/web/rest/AccountResource.java',
          renameTo: generator => `${generator.javaDir}web/rest/AccountResource.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipClient && !generator.reactive,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/ClientForwardController.java',
          renameTo: generator => `${generator.javaDir}web/rest/ClientForwardController.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaConfigTest: [
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/config/timezone/HibernateTimeZoneIT.java',
          renameTo: generator => `${generator.javaDir}config/timezone/HibernateTimeZoneIT.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/CorsController.java',
          renameTo: generator => `${generator.javaDir}config/CorsController.java`,
          useBluePrint: true,
        },
        {
          file: 'package/config/CorsTest.java',
          renameTo: generator => `${generator.javaDir}config/CorsTest.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaRepositoryTest: [
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/repository/timezone/DateTimeWrapper.java',
          renameTo: generator => `${generator.javaDir}repository/timezone/DateTimeWrapper.java`,
          useBluePrint: true,
        },
        {
          file: 'package/repository/timezone/DateTimeWrapperRepository.java',
          renameTo: generator => `${generator.javaDir}repository/timezone/DateTimeWrapperRepository.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaSecurityTest: [
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/security/SecurityUtilsUnitTest.java',
          renameTo: generator => `${generator.javaDir}security/SecurityUtilsUnitTest.java`,
          useBluePrint: true,
        },
        {
          file: 'package/security/SecurityHeaderFilterTest.java',
          renameTo: generator => `${generator.javaDir}security/SecurityHeaderFilterTest.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/security/jwt/JWTFilterTest.java',
          renameTo: generator => `${generator.javaDir}security/jwt/JWTFilterTest.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !shouldSkipUserManagement(generator) && generator.authenticationType !== 'oauth2',
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/security/DomainUserDetailsServiceIT.java',
          renameTo: generator => `${generator.javaDir}security/DomainUserDetailsServiceIT.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaServiceTest: [
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/service/mapper/UserMapperIT.java',
          renameTo: generator => `${generator.javaDir}service/mapper/UserMapperIT.java`,
          useBluePrint: true,
        },
        {
          file: 'package/service/MailServiceIT.java',
          renameTo: generator => `${generator.javaDir}service/MailServiceIT.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !shouldSkipUserManagement(generator),
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/service/UserServiceIT.java',
          renameTo: generator => `${generator.javaDir}service/UserServiceIT.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverJavaRestTest: [
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/errors/ExceptionTranslatorIT.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/ExceptionTranslatorIT.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/ExceptionTranslatorTestController.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/ExceptionTranslatorTestController.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/errors/TestDTO.java',
          renameTo: generator => `${generator.javaDir}web/rest/errors/TestDTO.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/TestUtil.java',
          renameTo: generator => `${generator.javaDir}web/rest/TestUtil.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipClient,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/ClientForwardControllerIT.java',
          renameTo: generator => `${generator.javaDir}web/rest/ClientForwardControllerIT.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/AccountResourceIT.java',
          renameTo: generator => `${generator.javaDir}web/rest/AccountResourceIT.java`,
          useBluePrint: true,
        },
        {
          file: 'package/web/rest/UserResourceIT.java',
          renameTo: generator => `${generator.javaDir}web/rest/UserResourceIT.java`,
          useBluePrint: true,
        },
      ],
    },
    {
      condition: generator => !generator.skipUserManagement && generator.authenticationType !== 'oauth2',
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/UserJWTControllerIT.java',
          renameTo: generator => `${generator.javaDir}web/rest/UserJWTControllerIT.java`,
          useBluePrint: true,
        },
      ],
    },
  ],
  serverBuild: [
    {
      templates: [{ file: 'checkstyle.xml', options: { interpolate: INTERPOLATE_REGEX } }],
    },
    {
      condition: generator => generator.buildTool === 'gradle',
      templates: [
        { file: 'build.gradle', useBluePrint: true },
        { file: 'settings.gradle', useBluePrint: true },
        { file: 'gradle.properties', useBluePrint: true },
        'gradle/sonar.gradle',
        { file: 'gradle/docker.gradle', useBluePrint: true },
        { file: 'gradle/profile_dev.gradle', options: { interpolate: INTERPOLATE_REGEX }, useBluePrint: true },
        { file: 'gradle/profile_prod.gradle', options: { interpolate: INTERPOLATE_REGEX }, useBluePrint: true },
        'gradle/war.gradle',
        'gradle/zipkin.gradle',
        { file: 'gradlew', method: 'copy', noEjs: true },
        { file: 'gradlew.bat', method: 'copy', noEjs: true },
        { file: 'gradle/wrapper/gradle-wrapper.jar', method: 'copy', noEjs: true },
        'gradle/wrapper/gradle-wrapper.properties',
      ],
    },
    {
      condition: generator => generator.buildTool === 'gradle' && !!generator.enableSwaggerCodegen,
      templates: ['gradle/swagger.gradle'],
    },
    {
      condition: generator => generator.buildTool === 'maven',
      templates: [
        { file: 'mvnw', method: 'copy', noEjs: true, useBluePrint: true },
        { file: 'mvnw.cmd', method: 'copy', noEjs: true, useBluePrint: true },
        { file: '.mvn/wrapper/maven-wrapper.jar', method: 'copy', noEjs: true, useBluePrint: true },
        { file: '.mvn/wrapper/maven-wrapper.properties', method: 'copy', noEjs: true, useBluePrint: true },
        { file: '.mvn/wrapper/MavenWrapperDownloader.java', method: 'copy', noEjs: true, useBluePrint: true },
        { file: 'pom.xml', options: { interpolate: INTERPOLATE_REGEX }, useBluePrint: true },
      ],
    },
  ],
};

/* eslint-disable no-template-curly-in-string */
function writeFiles() {
  return {
    async writeFiles({ application: { reactive } }) {
      const rootTemplatesPath = reactive ? ['reactive', ''] : undefined;
      this.javaDir = `${this.packageFolder}/`;
      this.testDir = `${this.packageFolder}/`;

      this.writeFiles({
        sections: serverFiles,
        context: this,
        rootTemplatesPath,
      });
    },

    modifyFiles() {
      if (this.buildTool === 'gradle') {
        // Add Gradle dependencies here
      }

      if (this.buildTool === 'maven') {
        // Add Maven dependencies here
      }
    },
  };
}

module.exports = {
  writeFiles,
  serverFiles,
};
