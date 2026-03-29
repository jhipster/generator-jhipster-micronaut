import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      micronautLiquibase({ application, source }) {
        source.addJavaDefinition?.({
          dependencies: [
            {
              groupId: 'io.micronaut.liquibase',
              artifactId: 'micronaut-liquibase',
            },
          ],
        });
        if (application.buildToolMaven) {
          source.addMavenDefinition?.({
            properties: [
              { property: 'liquibase.version', value: application.javaDependencies.liquibase },
              { property: 'jboss-logging.version', value: application.javaDependencies['jboss-logging'] },
            ],
            dependencies: [
              {
                groupId: 'org.liquibase.ext',
                artifactId: 'liquibase-hibernate6',
                scope: 'runtime',
                exclusions: {
                  exclusion: {
                    groupId: 'org.slf4j',
                    artifactId: 'slf4j-simple',
                  },
                },
              },
            ],
            dependencyManagement: [
              {
                groupId: 'org.liquibase.ext',
                artifactId: 'liquibase-hibernate6',
                version: '${liquibase.version}',
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
        }
      },
    });
  }
}
