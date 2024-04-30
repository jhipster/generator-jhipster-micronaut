import { beforeAll, describe, expect, it } from 'vitest';

import { defaultHelpers as helpers, result } from 'generator-jhipster/testing';

const SUB_GENERATOR = 'bootstrap-application-base';
const BLUEPRINT_NAMESPACE = `jhipster:${SUB_GENERATOR}`;

describe('SubGenerator bootstrap-application-base of micronaut JHipster blueprint', () => {
  describe('run', () => {
    beforeAll(async function () {
      await helpers
        .run(BLUEPRINT_NAMESPACE)
        .withJHipsterConfig()
        .withOptions({
          ignoreNeedlesError: true,
          blueprint: 'micronaut',
        })
        .withJHipsterLookup()
        .withParentBlueprintLookup()
        .withMockedJHipsterGenerators();
    });

    it('should succeed', () => {
      expect({ ...result.generator.sharedData.getApplication() }).toMatchInlineSnapshot(
        {
          authority: expect.any(Object),
          userManagement: expect.any(Object),
          user: expect.any(Object),
          backendType: 'micronaut',
          backendTypeSpringBoot: false,
          backendTypeJavaAny: true,
        },
        `
        {
          "applicationType": "monolith",
          "applicationTypeAny": true,
          "applicationTypeGateway": false,
          "applicationTypeMicroservice": false,
          "applicationTypeMonolith": true,
          "authenticationType": "jwt",
          "authenticationTypeJwt": true,
          "authenticationTypeOauth2": false,
          "authenticationTypeSession": false,
          "authority": Any<Object>,
          "backendType": "micronaut",
          "backendTypeJavaAny": true,
          "backendTypeSpringBoot": false,
          "baseName": "jhipster",
          "blueprints": [
            {
              "name": "generator-jhipster-micronaut",
              "version": "3.2.0",
            },
          ],
          "camelizedBaseName": "jhipster",
          "capitalizedBaseName": "Jhipster",
          "clientPackageManager": "npm",
          "cucumberTests": false,
          "cypressTests": false,
          "dasherizedBaseName": "jhipster",
          "dockerServicesDir": "src/main/docker/",
          "dtoSuffix": "DTO",
          "enableI18nRTL": false,
          "enableTranslation": true,
          "endpointPrefix": "",
          "entitySuffix": "",
          "fakerSeed": undefined,
          "gatewayServerPort": undefined,
          "gatlingTests": false,
          "generateAuthenticationApi": true,
          "generateBuiltInAuthorityEntity": true,
          "generateBuiltInUserEntity": true,
          "generateInMemoryUserCredentials": false,
          "generateUserManagement": true,
          "hipster": "jhipster_family_member_4",
          "hipsterBugTrackerLink": "https://github.com/jhipster/generator-jhipster-micronaut/issues?state=open",
          "hipsterBugTrackerProductName": "MHipster",
          "hipsterChatLink": "https://gitter.im/jhipster/generator-jhipster",
          "hipsterChatProductName": "JHipster",
          "hipsterDocumentationLink": "https://www.jhipster.tech/",
          "hipsterHomePageProductName": "MHipster",
          "hipsterName": "Micronaut Hipster",
          "hipsterProductName": "MHipster",
          "hipsterProjectLink": "https://github.com/jhipster/generator-jhipster-micronaut",
          "hipsterStackOverflowProductName": "JHipster",
          "hipsterStackoverflowLink": "https://stackoverflow.com/tags/jhipster/info",
          "hipsterTwitterLink": "https://twitter.com/jhipster",
          "hipsterTwitterUsername": "@jhipster",
          "humanizedBaseName": "JHipster",
          "jhiPrefix": "jhi",
          "jhiPrefixCapitalized": "Jhi",
          "jhiPrefixDashed": "jhi",
          "jhipsterVersion": "JHIPSTER_VERSION",
          "jwtSecretKey": undefined,
          "languages": [],
          "languagesDefinition": [],
          "lowercaseBaseName": "jhipster",
          "microfrontend": false,
          "microfrontends": undefined,
          "nativeLanguage": "en",
          "nativeLanguageDefinition": {
            "angularLocale": "en",
            "dayjsLocale": "en",
            "displayName": "English",
            "fakerjsLocale": "en",
            "javaLocaleMessageSourceSuffix": "en",
            "languageTag": "en",
            "name": "English",
            "rtl": false,
          },
          "nodeDependencies": {
            "concurrently": "CONCURRENTLY_VERSION",
            "husky": "HUSKY_VERSION",
            "lint-staged": "LINT_STAGED_VERSION",
            "npm": "NPM_VERSION",
            "prettier": "PRETTIER_VERSION",
            "prettier-plugin-java": "PRETTIER_PLUGIN_JAVA_VERSION",
            "prettier-plugin-packagejson": "PRETTIER_PLUGIN_PACKAGEJSON_VERSION",
            "wait-on": "WAIT_ON_VERSION",
          },
          "nodePackageManager": "npm",
          "nodeVersion": "NODE_VERSION",
          "pages": [],
          "prettierJava": undefined,
          "projectDescription": "Description for jhipster",
          "reactive": false,
          "rememberMeKey": undefined,
          "skipCheckLengthOfIdentifier": false,
          "skipClient": undefined,
          "skipCommitHook": undefined,
          "skipFakeData": false,
          "skipJhipsterDependencies": undefined,
          "skipServer": undefined,
          "skipUserManagement": false,
          "syncUserWithIdp": undefined,
          "testFrameworks": [],
          "upperFirstCamelCaseBaseName": "Jhipster",
          "user": Any<Object>,
          "userManagement": Any<Object>,
          "withAdminUi": true,
        }
      `,
      );
    });
  });
});
