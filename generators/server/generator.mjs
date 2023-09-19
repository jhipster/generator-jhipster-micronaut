import chalk from 'chalk';
import ServerGenerator from 'generator-jhipster/generators/server';
import { createBase64Secret, createSecret, createNeedleCallback } from 'generator-jhipster/generators/base/support';
import mnConstants from '../constants.cjs';

import { writeFiles } from './files.mjs';
import { GENERATOR_DOCKER, GENERATOR_GRADLE, GENERATOR_LANGUAGES, GENERATOR_MAVEN } from 'generator-jhipster/generators';

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
    super(args, opts, {
      ...features,
      checkBlueprint: true,
      jhipster7Migration: true,
    });

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints mhipster')}`);
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
      async composing() {
        const { buildTool, enableTranslation, databaseType, messageBroker, searchEngine, testFrameworks, websocket, cacheProvider } =
          this.jhipsterConfigWithDefaults;
        if (buildTool === 'gradle') {
          await this.composeWithJHipster(GENERATOR_GRADLE);
        } else if (buildTool === 'maven') {
          await this.composeWithJHipster(GENERATOR_MAVEN);
        } else {
          throw new Error(`Build tool ${buildTool} is not supported`);
        }

        await this.composeWithJHipster(GENERATOR_DOCKER);

        // We don't expose client/server to cli, composing with languages is used for test purposes.
        if (enableTranslation) {
          await this.composeWithJHipster(GENERATOR_LANGUAGES);
        }
        /*
        if (databaseType === SQL) {
          await this.composeWithJHipster(GENERATOR_SPRING_DATA_RELATIONAL);
        } else if (databaseType === CASSANDRA) {
          await this.composeWithJHipster(GENERATOR_SPRING_DATA_CASSANDRA);
        } else if (databaseType === COUCHBASE) {
          await this.composeWithJHipster(GENERATOR_SPRING_DATA_COUCHBASE);
        } else if (databaseType === MONGODB) {
          await this.composeWithJHipster(GENERATOR_SPRING_DATA_MONGODB);
        } else if (databaseType === NEO4J) {
          await this.composeWithJHipster(GENERATOR_SPRING_DATA_NEO4J);
        }
        if (messageBroker === KAFKA || messageBroker === PULSAR) {
          await this.composeWithJHipster(GENERATOR_SPRING_CLOUD_STREAM);
        }
        if (searchEngine === ELASTICSEARCH) {
          await this.composeWithJHipster(GENERATOR_SPRING_DATA_ELASTICSEARCH);
        }
        if (testFrameworks?.includes(CUCUMBER)) {
          await this.composeWithJHipster(GENERATOR_CUCUMBER);
        }
        if (testFrameworks?.includes(GATLING)) {
          await this.composeWithJHipster(GENERATOR_GATLING);
        }
        if (websocket === SPRING_WEBSOCKET) {
          await this.composeWithJHipster(GENERATOR_SPRING_WEBSOCKET);
        }
        if ([EHCACHE, CAFFEINE, HAZELCAST, INFINISPAN, MEMCACHED, REDIS].includes(cacheProvider)) {
          await this.composeWithJHipster(GENERATOR_SPRING_CACHE);
        }
        */
      },
    };
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
        application.hipster = 'jhipster_family_member_4';
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

  get [ServerGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      // Override jhipster customizeFiles
      customizeFiles({ source, entities, application: { cacheProvider, enableHibernateCache } }) {
        if (!enableHibernateCache || !cacheProvider) return;
        if (['ehcache', 'caffeine', 'infinispan', 'redis'].includes(cacheProvider)) {
          for (const entity of entities) {
            const { entityAbsoluteClass } = entity;
            source.addEntityToCache?.({
              entityAbsoluteClass,
              relationships: this.relationships,
            });
          }
        }
      },

      customizeMapstruct({ entities, application }) {
        for (const entity of entities) {
          if (entity.dto !== 'mapstruct') return;
          this.editFile(
            `src/main/java/${entity.entityAbsoluteFolder}/service/dto/${entity.restClass}.java`,
            content =>
              content.replace(
                'import java.io.Serializable;',
                `import io.micronaut.core.annotation.Introspected;
import java.io.Serializable;`,
              ),
            content =>
              content.replace(
                '\npublic class',
                `
@Introspected
public class`,
              ),
          );

          const hasUserRelationship = entity.relationships.find(({ otherEntity }) => otherEntity === application.user);
          let replacement = 'componentModel = "jsr330"';
          if (hasUserRelationship) {
            replacement += ', uses = UserMapper.class';
          }

          this.editFile(`src/main/java/${entity.entityAbsoluteFolder}/service/mapper/${entity.entityClass}Mapper.java`, content =>
            content.replace('componentModel = "spring"', replacement),
          );
        }
      },
    });
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
