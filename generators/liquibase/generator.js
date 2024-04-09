import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      micronautLiquibase({ application, source }) {
        if (application.buildToolMaven) {
          source.addMavenDefinition?.({
            properties: [{ property: 'liquibase.version', value: application.javaDependencies.liquibase }],
            dependencies: [
              {
                groupId: 'io.micronaut.liquibase',
                artifactId: 'micronaut-liquibase',
                scope: 'compile',
              },
              {
                groupId: 'org.liquibase.ext',
                artifactId: 'liquibase-hibernate6',
                version: '${liquibase.version}',
                scope: 'runtime',
                exclusions: {
                  exclusion: {
                    groupId: 'org.slf4j',
                    artifactId: 'slf4j-simple',
                  },
                },
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
