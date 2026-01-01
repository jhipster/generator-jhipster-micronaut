/**
 * Copyright 2019-2026 the original author or authors from the JHipster project.
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
import {
  javaMainPackageTemplatesBlock,
  javaMainResourceTemplatesBlock,
  javaTestPackageTemplatesBlock,
  javaTestResourceTemplatesBlock,
} from 'generator-jhipster/generators/java/support';

/* Constants use throughout */
import { JAVA_SERVER_TEST_RESOURCES_DIR as SERVER_TEST_RES_DIR } from 'generator-jhipster';

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
  readme: [{ templates: ['README.md.jhi.micronaut'] }],
  serverResources: [
    javaMainResourceTemplatesBlock({
      condition: generator => generator.devDatabaseType === 'h2Disk' || generator.devDatabaseType === 'h2Memory',
      templates: [{ file: 'h2.server.properties', renameTo: () => '.h2.server.properties' }],
    }),
    javaMainResourceTemplatesBlock({
      templates: [{ file: 'templates/error.html', renameTo: () => 'views/error.html' }],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: [
        { file: 'templates/mail/activationEmail.html', renameTo: () => 'views/mail/activationEmail.html' },
        { file: 'templates/mail/creationEmail.html', renameTo: () => 'views/mail/creationEmail.html' },
        { file: 'templates/mail/passwordResetEmail.html', renameTo: () => 'views/mail/passwordResetEmail.html' },
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
  ],
  micronautResources: [
    javaMainResourceTemplatesBlock({
      condition: generator => !!generator.enableSwaggerCodegen,
      templates: ['swagger/api.yml'],
    }),
    javaMainResourceTemplatesBlock({
      templates: [
        { file: 'logback.xml' },
        { file: 'application.yml' },
        { file: 'application-dev.yml' },
        { file: 'application-tls.yml' },
        { file: 'application-prod.yml' },
        { file: 'i18n/messages.properties', noEjs: true },
      ],
    }),
    javaTestResourceTemplatesBlock({
      templates: [{ file: 'logback.xml' }, { file: 'application-test.yml' }],
    }),
    javaMainResourceTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: [{ file: 'views/mail/testEmail.html', noEjs: true }],
    }),
  ],
  serverMicroserviceAndGateway: [
    javaMainResourceTemplatesBlock({
      condition: generator => generator.serviceDiscoveryType,
      templates: [{ file: 'bootstrap.yml' }],
    }),
    javaTestResourceTemplatesBlock({
      condition: generator => generator.serviceDiscoveryType,
      templates: [{ file: 'bootstrap-test.yml' }],
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
    javaMainPackageTemplatesBlock({
      templates: ['web/rest/SwaggerResource.java'],
    }),
  ],
  serverJavaSecurity: [
    javaMainPackageTemplatesBlock({
      templates: [
        'security/AuthoritiesConstants.java',
        'security/NotAuthenticatedResponse.java',
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
      templates: ['service/util/RandomUtil.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => !generator.skipUserManagement,
      templates: [
        'service/dto/PasswordChangeDTO.java',
        'service/mapper/UserMapper.java',
        'service/MailSenderFactory.java',
        'service/MailService.java',
      ],
    }),
    javaMainPackageTemplatesBlock({
      condition: ctx => ctx.generateBuiltInUserEntity,
      renameTo: (data, file) =>
        file.replace('/UserDTO.java', `/${data.user.dtoClass}.java`).replace('/AdminUserDTO.java', `/${data.user.adminUserDto}.java`),
      templates: ['service/UserService.java', 'service/dto/UserDTO.java', 'service/dto/AdminUserDTO.java'],
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
      condition: generator => generator.buildTool === 'gradle',
      templates: [
        { file: 'build.gradle' },
        { file: 'settings.gradle' },
        { file: 'gradle.properties' },
        { file: 'gradle/docker.gradle' },
        { file: 'gradle/profile_dev.gradle' },
        { file: 'gradle/profile_prod.gradle' },
      ],
    },
    {
      condition: generator => generator.buildTool === 'gradle' && !!generator.enableSwaggerCodegen,
      templates: ['gradle/swagger.gradle'],
    },
    {
      condition: generator => generator.buildTool === 'maven',
      templates: [{ file: 'pom.xml' }],
    },
  ],
};

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
