import chalk from "chalk";
import ServerGenerator from "generator-jhipster/generators/server";
import { createBase64Secret, createSecret, createNeedleCallback } from 'generator-jhipster/generators/base/support';
import mnConstants from '../constants.cjs';

import { writeFiles } from './files.mjs';

/*import {
  GENERATOR_BOOTSTRAP_APPLICATION,
  GENERATOR_SPRING_DATA_CASSANDRA,
  GENERATOR_COMMON,
  GENERATOR_SPRING_DATA_COUCHBASE,
  GENERATOR_CUCUMBER,
  GENERATOR_DOCKER,
  GENERATOR_SPRING_DATA_ELASTICSEARCH,
  GENERATOR_GATLING,
  GENERATOR_GRADLE,
  GENERATOR_JAVA,
  GENERATOR_SPRING_CLOUD_STREAM,
  GENERATOR_LANGUAGES,
  GENERATOR_MAVEN,
  GENERATOR_SPRING_DATA_MONGODB,
  GENERATOR_SPRING_DATA_NEO4J,
  GENERATOR_SERVER,
  GENERATOR_SPRING_CACHE,
  GENERATOR_SPRING_WEBSOCKET,
  GENERATOR_SPRING_DATA_RELATIONAL,
} from '../generator-list.mjs';

import {
  applicationTypes,
  authenticationTypes,
  buildToolTypes,
  databaseTypes,
  cacheTypes,
  serviceDiscoveryTypes,
  websocketTypes,
  fieldTypes,
  entityOptions,
  validations,
  reservedKeywords,
  searchEngineTypes,
  messageBrokerTypes,
  clientFrameworkTypes,
  testFrameworkTypes,
} from 'generator-jhipster/jdl';

const { CUCUMBER, GATLING } = testFrameworkTypes;
const { GRADLE, MAVEN } = buildToolTypes;*/

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints mhipster",
        )}`,
      );
    }
  }

  get [ServerGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [ServerGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      async promptingTemplateTask() {},
    };
  }

  get [ServerGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
      async configuringTemplateTask() {},
    };
  }

  get [ServerGenerator.COMPOSING]() {
    return {
      ...super.composing,
      async composingTemplateTask() {},
    };
    /*return {
      async composingTemplateTask() {
        const { buildTool, enableTranslation, databaseType, messageBroker, searchEngine, testFrameworks, websocket, cacheProvider } =
          this.jhipsterConfigWithDefaults;
        if (buildTool === GRADLE) {
          await this.composeWithJHipster(GENERATOR_GRADLE);
        } else if (buildTool === MAVEN) {
          await this.composeWithJHipster(GENERATOR_MAVEN);
        } else {
          throw new Error(`Build tool ${buildTool} is not supported`);
        }

        await this.composeWithJHipster(GENERATOR_DOCKER);

        // We don't expose client/server to cli, composing with languages is used for test purposes.
        if (enableTranslation) {
          await this.composeWithJHipster(GENERATOR_LANGUAGES);
        }
        if (testFrameworks?.includes(CUCUMBER)) {
          await this.composeWithJHipster(GENERATOR_CUCUMBER);
        }
        if (testFrameworks?.includes(GATLING)) {
          await this.composeWithJHipster(GENERATOR_GATLING);
        }
      },
    };*/
  }

  get [ServerGenerator.LOADING]() {
    return {
      ...super.loading,
      async loadingTemplateTask() {},
    };
  }

  get [ServerGenerator.PREPARING]() {
    return {
      ...super.preparing,
      prepareForTemplates({ application }) {
        const SPRING_BOOT_VERSION = application.javaDependencies['spring-boot'];
        application.addSpringMilestoneRepository = false;
        application.MN_CONSTANTS = mnConstants;
        application.GRADLE_VERSION = mnConstants.GRADLE_VERSION;
        application.DOCKER_REDIS = mnConstants.DOCKER_REDIS;
        application.JHIPSTER_DEPENDENCIES_VERSION = '8.0.0-SNAPSHOT';
      },
      registerSpringFactory: undefined,
      addLogNeedles({ source, application }) {
        source.addIntegrationTestAnnotation = ({ package: packageName, annotation }) =>
          this.editFile(this.destinationPath(`${application.javaPackageTestDir}IntegrationTest.java`), content =>
            addJavaAnnotation(content, { package: packageName, annotation }),
          );
        source.addLogbackMainLog = ({ name, level }) =>
          this.editFile(
            this.destinationPath('src/main/resources/logback.xml'),
            createNeedleCallback({
              needle: 'logback-add-log',
              contentToAdd: `<logger name="${name}" level="${level}"/>`,
            }),
          );
        source.addLogbackTestLog = ({ name, level }) =>
          this.editFile(
            this.destinationPath('src/test/resources/logback.xml'),
            createNeedleCallback({
              needle: 'logback-add-log',
              contentToAdd: `<logger name="${name}" level="${level}"/>`,
            }),
          );
      },
    };
  }

  get [ServerGenerator.DEFAULT]() {
    return {
      ...super.default,
      async defaultTemplateTask() {},
    };
  }

  get [ServerGenerator.WRITING]() {
    return {
      ...writeFiles.call(this),
    };
    /*return {

      ...super.writing,
      async writingTemplateTask() {},
    };*/
  }

  get [ServerGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
      async postWritingTemplateTask() {},
    };
  }

  get [ServerGenerator.INSTALL]() {
    return {
      ...super.install,
      async installTemplateTask() {},
    };
  }

  get [ServerGenerator.END]() {
    return {
      ...super.end,
      async endTemplateTask() {},
    };
  }
}
