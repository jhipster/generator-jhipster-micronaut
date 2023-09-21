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
import { files as baseServerFiles } from 'generator-jhipster/generators/server';
import {
  javaMainPackageTemplatesBlock,
  javaTestPackageTemplatesBlock,
  javaMainResourceTemplatesBlock,
  javaTestResourceTemplatesBlock,
} from 'generator-jhipster/generators/java/support';
import { moveToJavaPackageSrcDir } from 'generator-jhipster/generators/server/support';

/* Constants use throughout */
import { JAVA_SERVER_TEST_RESOURCES_DIR as SERVER_TEST_RES_DIR } from 'generator-jhipster';

const INTERPOLATE_REGEX = true;

/* TODO: Do a PR in the parent JHipster project to export and re-use here as well in order to have a single source of truth!!!
const TEST_DIR = constants.TEST_DIR;
*/
const shouldSkipUserManagement = generator =>
  generator.skipUserManagement && (generator.applicationType !== 'monolith' || generator.authenticationType !== 'oauth2');

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
export const serverFiles = {
  jib: baseServerFiles.jib,
  /*docker: [
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
      condition: generator => generator.databaseTypeMongodb,
      path: DOCKER_DIR,
      templates: ['mongodb-cluster.yml', 'mongodb/MongoDB.Dockerfile', 'mongodb/scripts/init_replicaset.js'],
    },
    {
      condition: generator => generator.databaseTypeCouchbase,
      path: DOCKER_DIR,
      templates: ['couchbase-cluster.yml', 'couchbase/Couchbase.Dockerfile', 'couchbase/scripts/configure-node.sh'],
    },
    {
      condition: generator => generator.databaseTypeCassandra,
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
      condition: generator => generator.authenticationTypeOauth2 && generator.applicationType !== 'microservice',
      path: DOCKER_DIR,
      templates: ['keycloak.yml', { file: 'config/realm-config/jhipster-realm.json', renameTo: () => 'realm-config/jhipster-realm.json' }],
    },
  ],*/
  serverResources: [
    javaMainResourceTemplatesBlock({
      condition: generator => generator.devDatabaseType === 'h2Disk' || generator.devDatabaseType === 'h2Memory',
      templates: [{ file: 'h2.server.properties', renameTo: () => '.h2.server.properties' }],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator => !!generator.enableSwaggerCodegen,
      templates: ['swagger/api.yml'],
    }),
    {
      condition: generator => !generator.skipClient,
      transform: false,
      templates: ['npmw', 'npmw.cmd'],
    },
    javaMainResourceTemplatesBlock({
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
    }),
    javaTestResourceTemplatesBlock({
      templates: [
        { file: 'logback.xml', useBluePrint: true },
        { file: 'application-test.yml', useBluePrint: true },
      ],
    }),
    // Emails should be fine to import from base generator, no need for useBluePrint
    javaMainResourceTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: [
        { file: 'templates/mail/activationEmail.html', renameTo: () => 'views/mail/activationEmail.html' },
        { file: 'templates/mail/creationEmail.html', renameTo: () => 'views/mail/creationEmail.html' },
        { file: 'templates/mail/passwordResetEmail.html', renameTo: () => 'views/mail/passwordResetEmail.html' },
        { file: 'views/mail/testEmail.html', useBluePrint: true, noEjs: true },
      ],
    }),
    {
      condition: generator => !generator.skipUserManagement,
      path: SERVER_TEST_RES_DIR,
      templates: [
        /* User management java test files */
        'i18n/messages_en.properties',
      ],
    },
    javaMainPackageTemplatesBlock({
      condition: generator =>
        generator.databaseType === 'mongodb' &&
        (!generator.skipUserManagement || (generator.skipUserManagement && generator.authenticationTypeOauth2)),
      templates: ['config/dbmigrations/InitialSetupMigration.kt'],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator => generator.databaseType === 'couchbase',
      templates: ['config/couchmove/changelog/V0__create_indexes.n1ql'],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator =>
        generator.databaseType === 'couchbase' && (!generator.skipUserManagement || generator.authenticationTypeOauth2),
      templates: [
        'config/couchmove/changelog/V0.1__initial_setup/ROLE_ADMIN.json',
        'config/couchmove/changelog/V0.1__initial_setup/ROLE_USER.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__admin.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__anonymoususer.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__system.json',
        'config/couchmove/changelog/V0.1__initial_setup/user__user.json',
      ],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator => generator.databaseType === 'cassandra',
      templates: [
        'config/cql/create-keyspace-prod.cql',
        'config/cql/create-keyspace.cql',
        'config/cql/drop-keyspace.cql',
        { file: 'config/cql/changelog/README.md', method: 'copy' },
      ],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator =>
        generator.databaseType === 'cassandra' &&
        generator.applicationType !== 'microservice' &&
        (!generator.skipUserManagement || generator.authenticationTypeOauth2),
      templates: [
        { file: 'config/cql/changelog/create-tables.cql', renameTo: () => 'config/cql/changelog/00000000000000_create-tables.cql' },
        {
          file: 'config/cql/changelog/insert_default_users.cql',
          renameTo: () => 'config/cql/changelog/00000000000001_insert_default_users.cql',
        },
      ],
    }),
  ],
  serverMicroserviceAndGateway: [
    javaMainResourceTemplatesBlock({
      condition: generator => generator.serviceDiscoveryType,
      templates: [{ file: 'bootstrap.yml', useBluePrint: true }],
    }),
    javaTestResourceTemplatesBlock({
      condition: generator => generator.serviceDiscoveryType,
      templates: [{ file: 'bootstrap-test.yml', useBluePrint: true }],
    }),
  ],
  // TODO WIP Adding files in here, will need to properly conditional and remove some in the future
  serverJavaApp: [
    javaMainPackageTemplatesBlock({
      templates: ['_mainClass_.java'],
    }),
  ],
  // I'm going to organize these by package, for lack of a better means of organizing right now
  serverJavaConfig: [
    javaMainPackageTemplatesBlock({
      templates: [
        'config/ActiveProfilesInfoSource.java',
        'config/ApplicationProperties.java',
        'config/Constants.java',
        'config/DefaultProfileUtil.java',
        'config/JacksonConfiguration.java',
        'config/JHipsterConfigurationEndpoint.java',
        'config/LoggingConfiguration.java',
        'config/MessagesBundleMessageSource.java',
        'config/package-info.java',
        'config/SnakeCasePhysicalNamingStrategy.java',
        'config/metric/JHipsterMetricsEndpoint.java',
      ],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => generator.cacheProvider === 'redis',
      templates: ['RedisTestContainerExtension.java'],
    }),
  ],
  serverJavaDomain: [
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement || generator.authenticationTypeOauth2,
      templates: ['domain/Authority.java', 'domain/User.java'],
    }),
  ],
  serverJavaRepository: [
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement || generator.authenticationTypeOauth2,
      templates: ['repository/AuthorityRepository.java', 'repository/UserRepository.java'],
    }),
  ],
  serverJavaOpenApi: [
    /*{
      templates: [
        {
          file: 'openapi.properties',
          useBluePrint: true,
        },
      ],
    },
    */
    javaMainPackageTemplatesBlock({
      templates: ['web/rest/SwaggerResource.java'],
    }),
  ],
  serverJavaSecurity: [
    javaMainPackageTemplatesBlock({
      templates: [
        'security/AuthoritiesConstants.java',
        'security/NotAuthenticatedResponse.java',
        'security/package-info.java',
        'security/SecurityUtils.java',
        'security/SecurityHeaderFilter.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement || generator.authenticationTypeOauth2,
      templates: ['security/Logout.java', 'security/UserNotActivatedException.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.authenticationTypeOauth2,
      templates: [
        'security/ApiLogoutController.java',
        'security/JHipsterOpenIdUserDetailsMapper.java',
        'security/JHipsterEndSessionEndpoint.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement && generator.authenticationType !== 'oauth2',
      templates: ['security/PasswordEncoder.java', 'security/BcryptPasswordEncoder.java', 'security/DatabaseAuthenticationProvider.java'],
    }),
  ],
  serverJavaService: [
    javaMainPackageTemplatesBlock({
      templates: [
        'service/dto/package-info.java',
        'service/mapper/package-info.java',
        'service/util/RandomUtil.java',
        'service/package-info.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: [
        'service/dto/PasswordChangeDTO.java',
        'service/mapper/UserMapper.java',
        'service/MailSenderFactory.java',
        'service/MailService.java',
        'service/UserService.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: ctx => ctx.generateBuiltInUserEntity,
      renameTo: (data, file) => moveToJavaPackageSrcDir(data, file).replace('/UserDTO.java', `/${data.user.dtoClass}.java`),
      templates: ['service/dto/UserDTO.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: ctx => ctx.generateBuiltInUserEntity,
      renameTo: (data, file) => moveToJavaPackageSrcDir(data, file).replace('/AdminUserDTO.java', `/${data.user.adminUserDto}.java`),
      templates: ['service/dto/AdminUserDTO.java'],
    }),
  ],
  serverJavaUtil: [
    javaMainPackageTemplatesBlock({
      templates: ['util/HeaderUtil.java', 'util/JHipsterProperties.java', 'util/PaginationUtil.java'],
    }),
  ],
  serverJavaRest: [
    javaMainPackageTemplatesBlock({
      templates: [
        // Handlers
        'web/rest/errors/handlers/AbstractThrowableProblemHandler.java',
        'web/rest/errors/handlers/ConstraintViolationExceptionHandler.java',
        'web/rest/errors/handlers/ProblemHandler.java',
        'web/rest/errors/handlers/ProblemRejectionHandler.java',
        'web/rest/errors/handlers/UnsatisfiedRouteExceptionHandler.java',
        // Errors
        'web/rest/errors/BadRequestAlertException.java',
        'web/rest/errors/ErrorConstants.java',
        'web/rest/errors/FieldErrorVM.java',
        'web/rest/errors/package-info.java',
        // VM
        'web/rest/vm/package-info.java',
        'web/rest/package-info.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: [
        // Handlers
        'web/rest/errors/EmailAlreadyUsedException.java',
        'web/rest/errors/EmailNotFoundException.java',
        'web/rest/errors/InvalidPasswordException.java',
        'web/rest/errors/LoginAlreadyUsedException.java',
        'web/rest/vm/KeyAndPasswordVM.java',
        'web/rest/vm/LoginVM.java',
        'web/rest/vm/ManagedUserVM.java',
        'web/rest/PublicUserResource.java',
        // Base rest pkg
        'web/rest/ClientForwardController.java',
        'web/rest/UserResource.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement || generator.authenticationTypeOauth2,
      templates: ['web/rest/AccountResource.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipClient && !generator.reactive,
      templates: ['web/rest/ClientForwardController.java'],
    }),
  ],
  serverJavaConfigTest: [
    javaTestPackageTemplatesBlock({
      templates: ['config/CorsController.java', 'config/CorsTest.java'],
    }),
  ],
  serverJavaSecurityTest: [
    javaTestPackageTemplatesBlock({
      templates: ['security/SecurityUtilsUnitTest.java', 'security/SecurityHeaderFilterTest.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: ['security/jwt/JWTFilterTest.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => !shouldSkipUserManagement(generator) && generator.authenticationType !== 'oauth2',
      templates: ['security/DomainUserDetailsServiceIT.java'],
    }),
  ],
  serverJavaServiceTest: [
    javaTestPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: ['service/mapper/UserMapperIT.java', 'service/MailServiceIT.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => !shouldSkipUserManagement(generator),
      templates: ['service/UserServiceIT.java'],
    }),
  ],
  serverJavaRestTest: [
    javaTestPackageTemplatesBlock({
      templates: [
        'web/rest/errors/ExceptionTranslatorIT.java',
        'web/rest/errors/ExceptionTranslatorTestController.java',
        'web/rest/errors/TestDTO.java',
        'web/rest/TestUtil.java',
      ],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => !generator.skipClient,
      templates: ['web/rest/ClientForwardControllerIT.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: ['web/rest/AccountResourceIT.java', 'web/rest/UserResourceIT.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement && generator.authenticationType !== 'oauth2',
      templates: ['web/rest/UserJWTControllerIT.java'],
    }),
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
        { file: 'gradle/sonar.gradle', useBluePrint: true },
        { file: 'gradle/docker.gradle', useBluePrint: true },
        { file: 'gradle/profile_dev.gradle', options: { interpolate: INTERPOLATE_REGEX }, useBluePrint: true },
        { file: 'gradle/profile_prod.gradle', options: { interpolate: INTERPOLATE_REGEX }, useBluePrint: true },
      ],
    },
    {
      condition: generator => generator.buildTool === 'gradle' && !!generator.enableSwaggerCodegen,
      templates: ['gradle/swagger.gradle'],
    },
    {
      condition: generator => generator.buildTool === 'maven',
      templates: [{ file: 'pom.xml', options: { interpolate: INTERPOLATE_REGEX }, useBluePrint: true }],
    },
  ],
};

/* eslint-disable no-template-curly-in-string */
export function writeFiles() {
  return this.asWritingTaskGroup({
    async writeFiles({ application }) {
      return this.writeFiles({
        sections: serverFiles,
        context: application,
      });
    },
  });
}
