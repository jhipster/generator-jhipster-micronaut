import os from 'os';
import chalk from 'chalk';
import ServerGenerator from 'generator-jhipster/generators/server';
import {
  GENERATOR_DOCKER,
  GENERATOR_GRADLE,
  GENERATOR_LANGUAGES,
  GENERATOR_LIQUIBASE,
  GENERATOR_MAVEN,
} from 'generator-jhipster/generators';
import { createNeedleCallback, createBase64Secret } from 'generator-jhipster/generators/base/support';
import { addJavaAnnotation } from 'generator-jhipster/generators/java/support';
import mnConstants from '../constants.cjs';
import { writeFiles } from './files.js';

import command from './command.js';
import { entityFiles } from './entity-files.js';
import { getCommonMavenDefinition, getDatabaseDriverForDatabase, getImperativeMavenDefinition } from './internal/dependencies.js';
import constants from '../constants.cjs';

export default class extends ServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      checkBlueprint: true,
    });

    this.command = command;
    if (!this.options.help) {
      this.jhipsterTemplatesFolders.push(
        // For _persistClass_.java.jhi.hibernate_cache/_persistClass_.java.jhi.jakarta_persistence file
        this.fetchFromInstalledJHipster('spring-data-relational/templates'),
        // For _global_partials_entity_/field_validators file
        this.fetchFromInstalledJHipster('java/templates'),
      );
    }
  }

  async beforeQueue() {
    await this.dependsOnJHipster('java');
    await this.dependsOnJHipster('common');
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
      // TODO move generator-jhipster prompts to command and customize micronaut's command based on generator-jhipster
      async promptingTemplateTask() {},
    });
  }

  get [ServerGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
      async configuringTemplateTask() {
        this.jhipsterConfig.backendType = 'Micronaut';
        if (this.jhipsterConfigWithDefaults.authenticationType === 'oauth2') {
          this.jhipsterConfig.jwtSecretKey = this.jhipsterConfig.jwtSecretKey ?? createBase64Secret(64, this.options.reproducibleTests);
        }
      },
    });
  }

  get [ServerGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composing() {
        const { buildTool, enableTranslation, databaseType, cacheProvider } = this.jhipsterConfigWithDefaults;
        if (buildTool === 'gradle') {
          await this.composeWithJHipster(GENERATOR_GRADLE);
        } else if (buildTool === 'maven') {
          (await this.composeWithJHipster(GENERATOR_MAVEN)).sortPomFile = false;
        } else {
          throw new Error(`Build tool ${buildTool} is not supported`);
        }

        await this.composeWithJHipster(GENERATOR_DOCKER);

        // We don't expose client/server to cli, composing with languages is used for test purposes.
        if (enableTranslation) {
          const languagesGenerator = await this.composeWithJHipster(GENERATOR_LANGUAGES);
          languagesGenerator.writeJavaLanguageFiles = true;
        }
        if (databaseType === 'sql') {
          await this.composeWithJHipster(GENERATOR_LIQUIBASE);
        }
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
        // Use Micronaut specific hipster
        application.hipster = 'jhipster_family_member_4';
        // Workaround
        application.addSpringMilestoneRepository = false;
        application.MN_CONSTANTS = mnConstants;
        application.dockerContainers.redis = mnConstants.DOCKER_REDIS;
        // Add liquibase h2 database references.
        application.liquibaseAddH2Properties = true;
        // Micronaut is a java project.
        application.backendTypeJavaAny = true;
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

  get [ServerGenerator.LOADING_ENTITIES]() {
    return this.asLoadingEntitiesTaskGroup({
      ...super.loadingEntities,
    });
  }

  get [ServerGenerator.PREPARING_EACH_ENTITY]() {
    return this.asPreparingEachEntityTaskGroup({
      ...super.preparingEachEntity,
    });
  }

  get [ServerGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return this.asPreparingEachEntityFieldTaskGroup({
      ...super.preparingEachEntityField,
    });
  }

  get [ServerGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return this.asPreparingEachEntityRelationshipTaskGroup({
      ...super.preparingEachEntityRelationship,
    });
  }

  get [ServerGenerator.POST_PREPARING_EACH_ENTITY]() {
    return this.asPostPreparingEachEntityTaskGroup({
      ...super.postPreparingEachEntity,
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
    const { writeEnumFiles } = super.writingEntities;
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
      writeEnumFiles,
    });
  }

  get [ServerGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      sqlDependencies({ application, source }) {
        if (application.databaseTypeSql) {
          source.addMavenDefinition?.(getImperativeMavenDefinition({ javaDependencies: { hibernate: constants.versions.hibernate } }));
          source.addMavenDefinition?.(getCommonMavenDefinition());
          source.addMavenDependency?.(getDatabaseDriverForDatabase(application.prodDatabaseType).jdbc);
        }
      },
      packageJsonCustomizations({ application }) {
        this.packageJson.merge({
          scripts: {
            'backend:nohttp:test': '',
            'backend:doc:test': '',
          },
        });
        if (application.buildToolMaven) {
          this.packageJson.merge({
            scripts: {
              // jhipster generates e2e.jar
              'postci:e2e:package':
                'mv target/original*.jar target/original.jar.back && cp target/*.$npm_package_config_packaging target/e2e.$npm_package_config_packaging',
            },
          });
        } else if (application.buildToolGradle) {
          this.editFile('package.json', contents => contents.replaceAll(' bootJar ', ' shadowJar '));
        }
        if (application.cacheProviderRedis) {
          this.packageJson.merge({
            scripts: {
              'ci:e2e:server:start': `${this.packageJson.getPath(
                'scripts.ci:e2e:server:start',
              )} --add-opens java.base/java.util=ALL-UNNAMED`,
            },
          });
        }
      },
    });
  }

  get [ServerGenerator.POST_WRITING_ENTITIES]() {
    return this.asPostWritingEntitiesTaskGroup({
      customizeMapstruct({ entities, application }) {
        for (const entity of entities.filter(entity => !entity.skipServer && !entity.builtIn && entity.dtoMapstruct)) {
          this.editFile(
            `src/main/java/${entity.entityAbsoluteFolder}/service/dto/${entity.dtoClass}.java`,
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
    return this.asInstallTaskGroup({
      ...super.install,
    });
  }

  get [ServerGenerator.POST_INSTALL]() {
    return this.asPostInstallTaskGroup({
      ...super.postInstall,
    });
  }

  get [ServerGenerator.END]() {
    return this.asEndTaskGroup({
      end() {
        this.log.ok('Micronaut application generated successfully.');

        let executable = 'mvnw';
        if (this.jhipsterConfigWithDefaults.buildTool === 'gradle') {
          executable = 'gradlew';
        }
        let logMsgComment = '';
        if (os.platform() === 'win32') {
          logMsgComment = ` (${chalk.yellow.bold(executable)} if using Windows Command Prompt)`;
        }
        this.log(chalk.green(`  Run your Micronaut application:\n  ${chalk.yellow.bold(`./${executable}`)}${logMsgComment}`));
      },
    });
  }
}
