import ServerGenerator from 'generator-jhipster/generators/server';
import { GENERATOR_DOCKER, GENERATOR_GRADLE, GENERATOR_LANGUAGES, GENERATOR_MAVEN } from 'generator-jhipster/generators';
import { createNeedleCallback } from 'generator-jhipster/generators/base/support';
import mnConstants from '../constants.cjs';
import { writeFiles } from './files.mjs';

import command from './command.mjs';
import { entityFiles } from './entity-files.mjs';

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      checkBlueprint: true,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });

    if (!this.options.help) {
      this.jhipsterTemplatesFolders.push(
        this.fetchFromInstalledJHipster('spring-data-relational/templates'),
        this.fetchFromInstalledJHipster('liquibase/templates'),
      );
    }
  }

  get [ServerGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [ServerGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,
      async promptingTemplateTask() {},
    });
  }

  get [ServerGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
      async configuringTemplateTask() {},
    });
  }

  get [ServerGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
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
        */
        if (['ehcache', 'caffeine', 'hazelcast', 'infinispan', 'memcached', 'redis'].includes(cacheProvider)) {
          await this.composeWithJHipster('jhipster-micronaut:micronaut-cache');
        }
      },
    });
  }

  get [ServerGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
    });
  }

  get [ServerGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,

      prepareForTemplates({ application }) {
        application.hipster = 'jhipster_family_member_4';
        application.addSpringMilestoneRepository = false;
        application.MN_CONSTANTS = mnConstants;
        application.gradleVersion = mnConstants.GRADLE_VERSION;
        application.dockerContainers.redis = mnConstants.DOCKER_REDIS;
        application.jhipsterDependenciesVersion = '7.9.3';
      },

      registerSpringFactory: undefined,

      addLogNeedles({ source, application }) {
        source.addIntegrationTestAnnotation = ({ package: packageName, annotation }) =>
          this.editFile(this.destinationPath(`${application.javaPackageTestDir}IntegrationTest.java`), content =>
            addJavaAnnotation(content, { package: packageName, annotation }),
          );
        source.addLogbackMainLog = ({ name, level }) =>
          this.editFile(
            this.destinationPath(`${application.srcMainResources}logback.xml`),
            createNeedleCallback({
              needle: 'logback-add-log',
              contentToAdd: `<logger name="${name}" level="${level}"/>`,
            }),
          );
        source.addLogbackTestLog = ({ name, level }) =>
          this.editFile(
            this.destinationPath(`${application.srcTestResources}logback.xml`),
            createNeedleCallback({
              needle: 'logback-add-log',
              contentToAdd: `<logger name="${name}" level="${level}"/>`,
            }),
          );
      },
    });
  }

  get [ServerGenerator.CONFIGURING_EACH_ENTITY]() {
    return this.asConfiguringEachEntityTaskGroup({
      ...super.configuringEachEntity,
    });
  }

  get [ServerGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
      relationships({ entities }) {
        for (const entity of entities) {
          entity.fieldsContainOwnerManyToMany = entity => entity.relationships.some(rel => rel.ownerSide && rel.relationshipManyToMany);
        }
      },
    });
  }

  get [ServerGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...writeFiles.call(this),
    });
  }

  get [ServerGenerator.WRITING_ENTITIES]() {
    return this.asWritingTaskGroup({
      async writeMicronautServerFiles({ application, entities }) {
        const rootTemplatesPath = application.reactive ? ['reactive', ''] : undefined;
        for (const entity of entities.filter(entity => !entity.skipServer && !entity.builtIn)) {
          this.writeFiles({
            sections: entityFiles,
            context: { ...application, ...entity },
            rootTemplatesPath,
          });
        }
      },
    });
  }

  get [ServerGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      disableJavadocTest() {
        this.packageJson.merge({
          scripts: {
            'backend:nohttp:test': '',
            'backend:doc:test': '',
          },
        });
      },
    });
  }

  get [ServerGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      customizeMapstruct({ entities, application }) {
        for (const entity of entities.filter(entity => !entity.skipServer && !entity.builtIn)) {
          if (entity.dto !== 'mapstruct') return;
          this.editFile(
            `src/main/java/${entity.entityAbsoluteFolder}/service/dto/${entity.restClass}.java`,
            content =>
              content.replace(
                'import java.io.Serializable;',
                `import io.micronaut.core.annotation.Introspected;
import java.io.Serializable;`,
              ),
            content => content.replace('jakarta', 'javax'),
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
    return this.asInstallTaskGroup({
      ...super.install,
    });
  }

  get [ServerGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
    });
  }
}
