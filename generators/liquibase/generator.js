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
            plugins: [
              {
                groupId: 'org.liquibase',
                artifactId: 'liquibase-maven-plugin',
                version: '${liquibase.version}',
              },
            ],
          });
          if (application.databaseTypeSql && !application.reactive) {
            source.addMavenDefinition?.({
              dependencies: [
                {
                  groupId: 'org.liquibase.ext',
                  artifactId: 'liquibase-hibernate7',
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
                  artifactId: 'liquibase-hibernate7',
                  version: '${liquibase.version}',
                },
              ],
            });
          }
        }
      },
      // Micronaut 5 uses Hibernate 7, generator-jhipster hardcodes liquibase-hibernate6.
      replaceLiquibaseHibernate6({ application }) {
        if (!application.databaseTypeSql) return;
        const replaceHibernate6 = content => content.replaceAll('liquibase-hibernate6', 'liquibase-hibernate7');
        if (application.buildToolMaven) {
          // liquibase-maven-plugin dependencies
          this.editFile('pom.xml', replaceHibernate6);
        } else if (application.buildToolGradle && !application.reactive) {
          // liquibaseRuntime dependency
          this.editFile('gradle/liquibase.gradle', replaceHibernate6);
        }
      },
    });
  }
}
