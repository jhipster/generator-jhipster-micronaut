import os from 'os';
import chalk from 'chalk';
import BaseApplicationGenerator from 'generator-jhipster/generators/server';
import { GENERATOR_DOCKER, GENERATOR_LANGUAGES, GENERATOR_LIQUIBASE, GENERATOR_SERVER } from 'generator-jhipster/generators';
import { createNeedleCallback, createBase64Secret } from 'generator-jhipster/generators/base/support';
import { addJavaAnnotation } from 'generator-jhipster/generators/java/support';
import { parseMavenPom } from 'generator-jhipster/generators/maven/support';
import mnConstants from '../constants.cjs';
import { writeFiles } from './files.js';

import { entityFiles } from './entity-files.js';
import { getCommonMavenDefinition, getDatabaseDriverForDatabase, getImperativeMavenDefinition } from './internal/dependencies.js';
import { serverTestFrameworkChoices } from './command.js';

export default class extends BaseApplicationGenerator {
  async beforeQueue() {
    this.jhipsterTemplatesFolders.push(
      this.fetchFromInstalledJHipster('server/templates'),
      // For _persistClass_.java.jhi.hibernate_cache/_persistClass_.java.jhi.jakarta_persistence file
      this.fetchFromInstalledJHipster('spring-data-relational/templates'),
      // For _global_partials_entity_/field_validators file
      this.fetchFromInstalledJHipster('java/generators/domain/templates'),
    );
    await this.dependsOnJHipster(GENERATOR_SERVER);
    await this.dependsOnJHipster('jhipster:java:build-tool');
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializing() {
        await this.parseCurrentJHipsterCommand();
      },
    });
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
        if (this.jhipsterConfigWithDefaults.authenticationType === 'oauth2') {
          this.jhipsterConfig.jwtSecretKey = this.jhipsterConfig.jwtSecretKey ?? createBase64Secret(64, this.options.reproducibleTests);
        }
      },
    });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composing() {
        const { enableTranslation, databaseType, cacheProvider, skipClient, clientFramework = 'no' } = this.jhipsterConfigWithDefaults;

        await this.composeWithJHipster('jhipster:java:domain');
        await this.composeWithJHipster('jhipster:java:code-quality');
        await this.composeWithJHipster('jhipster:java:jib');
        await this.composeWithJHipster(GENERATOR_DOCKER);

        if (!skipClient && clientFramework !== 'no') {
          await this.composeWithJHipster('jhipster:java:node');
        }

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

  get [BaseApplicationGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      async loading({ application }) {
        await this.loadCurrentJHipsterCommandConfig(application);
      },
      loadMicronautPlatformPom({ application }) {
        const pomFile = this.readTemplate(this.templatePath('../resources/micronaut-platform.pom')).toString();
        const pom = parseMavenPom(pomFile);
        Object.assign(application.javaManagedProperties, pom.project.properties);

        // Liquibase generator uses this property, otherwise it will be used from gradle's dependenciesManagement plugin.
        application.javaDependencies.liquibase = application.javaManagedProperties['liquibase.version'];

        // Used by getImperativeMavenDefinition for annotation processor.
        application.javaDependencies.hibernate = application.javaManagedProperties['hibernate.version'];

        // Used by micronaut-cache.
        application.javaDependencies.ehcache = application.javaManagedProperties['ehcache.version'];
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      loadDependencies({ application }) {
        application.micronautDependencies = { ...mnConstants.versions };
        this.loadJavaDependenciesFromGradleCatalog(application.micronautDependencies);
        Object.assign(application.javaDependencies, application.micronautDependencies);
      },
      prepareForTemplates({ application }) {
        // Workaround
        application.MN_CONSTANTS = mnConstants;
        application.dockerContainers.redis = mnConstants.DOCKER_REDIS;
        // Add liquibase h2 database references.
        application.liquibaseAddH2Properties = true;
        Object.assign(application, {
          useNpmWrapper: application.clientFrameworkAny && !application.skipClient,
        });
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
      addMicronautDependencies({ application, source }) {
        const { javaDependencies } = application;
        source.addJavaDefinition({
          dependencies: [
            {
              groupId: 'net.logstash.logback',
              artifactId: 'logstash-logback-encoder',
              version: javaDependencies['logstash-logback-encoder'],
            },
            { groupId: 'tech.jhipster', artifactId: 'jhipster-framework', version: application.jhipsterDependenciesVersion },
            { groupId: 'org.apache.commons', artifactId: 'commons-lang3', version: javaDependencies['commons-lang3'] },
            { groupId: 'io.swagger.core.v3', artifactId: 'swagger-annotations', version: javaDependencies['swagger-annotations'] },
            { groupId: 'org.mockito', artifactId: 'mockito-core', scope: 'test' },
            { groupId: 'org.zalando', artifactId: 'jackson-datatype-problem', version: javaDependencies['jackson-datatype-problem'] },
            { groupId: 'org.zalando', artifactId: 'problem-violations', version: javaDependencies['problem-violations'] },
          ],
        });
        if (application.buildToolMaven) {
          source.addMavenDefinition({
            properties: [{ property: 'modernizer.failOnViolations', value: 'false' }],
          });
        } else if (application.buildToolGradle) {
          source.addGradleDependencyCatalogPlugins([
            {
              id: 'io.micronaut.application',
              pluginName: 'micronaut-application',
              version: application.javaDependencies['micronaut-application'],
              addToBuild: true,
            },
            {
              id: 'com.gorylenko.gradle-git-properties',
              pluginName: 'gradle-git-properties',
              version: application.javaDependencies['gradle-git-properties'],
              addToBuild: true,
            },
            {
              id: 'com.github.johnrengelman.shadow',
              pluginName: 'shadow',
              version: application.javaDependencies['shadow'],
              addToBuild: true,
            },
          ]);
          if (application.enableSwaggerCodegen) {
            source.addGradleDependencyCatalogPlugin({
              id: 'org.openapi.generator',
              pluginName: 'openapi-generator',
              version: application.javaDependencies['openapi-generator'],
              addToBuild: true,
            });
          }
        }

        if (!application.skipUserManagement) {
          source.addJavaDefinition({
            dependencies: [{ groupId: 'org.mindrot', artifactId: 'jbcrypt', version: javaDependencies.jbcrypt }],
          });
        }
      },
      sqlDependencies({ application, source }) {
        if (application.databaseTypeSql) {
          source.addMavenDefinition?.(
            getImperativeMavenDefinition({ javaDependencies: { hibernate: application.javaManagedProperties['hibernate.version'] } }),
          );
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
