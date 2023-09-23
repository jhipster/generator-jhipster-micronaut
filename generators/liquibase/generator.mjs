import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      hibernate5({ application }) {
        if (application.buildToolMaven) {
          this.editFile('pom.xml', { ignoreNonExisting: true }, content => content.replace('liquibase-hibernate6', 'liquibase-hibernate5'));
        }
      },
      micronautLiquibase({ application, source }) {
        if (application.buildToolGradle) {
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
