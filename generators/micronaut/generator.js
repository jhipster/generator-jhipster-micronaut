import os from 'os';

import chalk from 'chalk';
import { createNeedleCallback } from 'generator-jhipster/generators/base-core/support';
import { addJavaAnnotation } from 'generator-jhipster/generators/java/support';
import { parseMavenPom } from 'generator-jhipster/generators/java-simple-application/generators/maven/support';
import BaseApplicationGenerator from 'generator-jhipster/generators/server';
import { prepareSqlApplicationProperties } from 'generator-jhipster/generators/spring-boot/generators/data-relational/support';
import { createBase64Secret } from 'generator-jhipster/utils';

import mnConstants from '../constants.cjs';

import { serverTestFrameworkChoices } from './command.js';
import { entityFiles } from './entity-files.js';
import { writeFiles } from './files.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);
  }

  async beforeQueue() {
    this.jhipsterTemplatesFolders.push(
      // For error.html file
      this.fetchFromInstalledJHipster('spring-boot/templates'),
      // For messages.properties files
      this.fetchFromInstalledJHipster('java/generators/i18n/templates'),
      // For _persistClass_.java.jhi.hibernate_cache/_persistClass_.java.jhi.jakarta_persistence file
      this.fetchFromInstalledJHipster('spring-boot/generators/data-relational/templates'),
      // For _global_partials_entity_/field_validators file
      this.fetchFromInstalledJHipster('java/generators/domain/templates'),
    );
    await this.dependsOnJHipster('server');
    await this.dependsOnJHipster('java');
    await this.dependsOnJHipster('jhipster:java-simple-application:build-tool');
    await this.dependsOnJHipster('jhipster:java:server');
  }

  get [BaseApplicationGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      prepareForPrompt({ control }) {
        this.jhipsterConfig.testFrameworks = this.jhipsterConfig.testFrameworks ?? [];

        const supportedServerOptions = serverTestFrameworkChoices.map(({ value }) => value);
        const serverTestFrameworks = [
          ...(this.jhipsterConfig.serverTestFrameworks ?? []),
          this.jhipsterConfig.testFrameworks.filter(framework => supportedServerOptions.includes(framework)),
        ];
        if (serverTestFrameworks.length > 0) {
          this.jhipsterConfig.serverTestFrameworks = serverTestFrameworks;
          this.jhipsterConfig.testFrameworks = this.jhipsterConfig.testFrameworks.filter(
            framework => !supportedServerOptions.includes(framework),
          );
        } else if (control.existingProject) {
          this.jhipsterConfig.serverTestFrameworks = [];
        }
      },
      async prompting({ control }) {
        if (control.existingProject && this.options.askAnswered !== true) return;
        await this.promptCurrentJHipsterCommand();
      },
      loadFromPrompt() {
        this.jhipsterConfig.testFrameworks = [
          ...new Set([...this.jhipsterConfig.testFrameworks, ...this.jhipsterConfig.serverTestFrameworks]),
        ];
        this.jhipsterConfig.serverTestFrameworks = [];
      },
    });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      async configuringTemplateTask() {
        if (this.jhipsterConfigWithDefaults.authenticationType === 'jwt') {
          this.jhipsterConfig.jwtSecretKey = this.jhipsterConfig.jwtSecretKey ?? createBase64Secret(64, this.options.reproducibleTests);
        }
      },
    });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composing() {
        const { enableTranslation, databaseType, cacheProvider, skipClient, clientFramework = 'no' } = this.jhipsterConfigWithDefaults;

        await this.composeWithJHipster('jhipster-micronaut:micronaut:base-dependencies');
        await this.composeWithJHipster('jhipster:java:i18n');
        await this.composeWithJHipster('jhipster:java:domain');
        await this.composeWithJHipster('jhipster:java-simple-application:code-quality');
        await this.composeWithJHipster('jhipster:java-simple-application:jib');
        await this.composeWithJHipster('docker');

        if (!skipClient && clientFramework !== 'no') {
          await this.composeWithJHipster('jhipster:java:node');
        }

        // We don't expose client/server to cli, composing with languages is used for test purposes.
        if (enableTranslation) {
          const languagesGenerator = await this.composeWithJHipster('languages');
          languagesGenerator.writeJavaLanguageFiles = true;
        }
        if (databaseType === 'sql') {
          await this.composeWithJHipster('liquibase');
        }
        if (['ehcache', 'caffeine', 'hazelcast', 'infinispan', 'memcached', 'redis'].includes(cacheProvider)) {
          await this.composeWithJHipster('jhipster-micronaut:micronaut:cache');
        }
      },
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      loadMicronautPlatformPom({ application }) {
        const pomFile = this.readTemplate(this.templatePath('../resources/micronaut-platform.pom')).toString();
        const pom = parseMavenPom(pomFile);
        Object.assign(application.javaManagedProperties, pom.project.properties);

        // Liquibase generator uses this property, otherwise it will be used from gradle's dependenciesManagement plugin.
        application.javaDependencies.liquibase = application.javaManagedProperties['liquibase.version'];
        // Required by Liquibase generator due to liquibase-maven-plugin
        application.javaDependencies.h2 = application.javaManagedProperties['h2.version'];

        // Used by getImperativeMavenDefinition for annotation processor.
        application.javaDependencies.hibernate = application.javaManagedProperties['hibernate.version'];

        // Used by micronaut-cache.
        application.javaDependencies.ehcache = application.javaManagedProperties['ehcache.version'];
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      defaults({ application, applicationDefaults }) {
        applicationDefaults({
          saveUserSnapshot: ({ applicationTypeMicroservice, authenticationTypeOauth2, hasRelationshipWithBuiltInUser, dto }) =>
            applicationTypeMicroservice && authenticationTypeOauth2 && hasRelationshipWithBuiltInUser && dto === 'no',
        });

        if (application.databaseTypeSql) {
          prepareSqlApplicationProperties({ application });
        }
      },
      prepareForTemplates({ application }) {
        // Workaround
        application.MN_CONSTANTS = mnConstants;
        // Add liquibase h2 database references.
        application.liquibaseAddH2Properties = true;
        Object.assign(application, {
          useNpmWrapper: application.clientFrameworkAny && !application.skipClient,
        });
      },

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

  get [BaseApplicationGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      relationships({ entities }) {
        for (const entity of entities) {
          entity.fieldsContainOwnerManyToMany = entity => entity.relationships.some(rel => rel.ownerSide && rel.relationshipManyToMany);
        }
      },
    });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...writeFiles.call(this),
    });
  }

  get [BaseApplicationGenerator.WRITING_ENTITIES]() {
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

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      addMicronautGradleScript({ application, source }) {
        if (application.buildToolGradle) {
          source.applyFromGradle({ script: 'gradle/micronaut.gradle' });
        }
      },
      addMysqlSleep({ application }) {
        if (application.prodDatabaseTypeMysql) {
          this.editFile(`${application.dockerServicesDir}mysql.yml`, content =>
            content
              .replace(/test: [^\n]*/, "test: ['CMD-SHELL', 'mysql -e \"SHOW DATABASES;\" && sleep 5']")
              .replace('timeout: 5s', 'timeout: 10s'),
          );
        }
      },
      packageJsonCustomizations({ application }) {
        this.packageJson.merge({
          scripts: {
            'backend:nohttp:test': '',
            'backend:doc:test': '',
          },
        });
        if (application.buildToolGradle) {
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

  get [BaseApplicationGenerator.POST_WRITING_ENTITIES]() {
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

  get [BaseApplicationGenerator.END]() {
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
