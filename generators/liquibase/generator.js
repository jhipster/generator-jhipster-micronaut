import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import constants from '../constants.cjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
    if (!this.options.help) {
      this.jhipsterTemplatesFolders.push(this.fetchFromInstalledJHipster('liquibase/templates'));
    }
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      micronautLiquibase({ application, source }) {
        if (application.buildToolMaven) {
          source.addMavenDefinition?.({
            properties: [{ property: 'liquibase-hibernate6.version', value: constants.versions.liquibaseHibernate6 }],
            dependencies: [
              {
                groupId: 'io.micronaut.liquibase',
                artifactId: 'micronaut-liquibase',
                scope: 'compile',
              },
              {
                groupId: 'org.liquibase.ext',
                artifactId: 'liquibase-hibernate6',
                version: '${liquibase-hibernate6.version}',
                scope: 'runtime',
              },
            ],
            plugins: [
              {
                groupId: 'org.liquibase',
                artifactId: 'liquibase-maven-plugin',
                version: '${liquibase.version}',
              },
            ],
          });
        } else if (application.buildToolGradle) {
          source.addGradleDependency?.({
            groupId: 'io.micronaut.liquibase',
            artifactId: 'micronaut-liquibase',
            scope: 'implementation',
          });
        }
      },
    });
  }
}
