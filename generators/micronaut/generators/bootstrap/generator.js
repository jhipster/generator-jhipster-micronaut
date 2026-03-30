import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  async beforeQueue() {
    await this.dependsOnBootstrap('server');
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asPreparingTaskGroup({
      async preparingMicronaut({ applicationDefaults }) {
        applicationDefaults({
          backendTypeJavaAny: true,
          backendType: 'micronaut',
          hipster: 'jhipster_family_member_4',
          hipsterBugTrackerLink: 'https://github.com/jhipster/generator-jhipster-micronaut/issues?state=open',
          hipsterBugTrackerProductName: 'MHipster',
          hipsterHomePageProductName: 'MHipster',
          hipsterName: 'Micronaut Hipster',
          hipsterProductName: 'MHipster',
          hipsterProjectLink: 'https://github.com/jhipster/generator-jhipster-micronaut',
          // TODO Remove for v9.0.1
          temporaryDir: ({ buildTool }) => {
            switch (buildTool) {
              case 'maven':
                return 'target/';
              case 'gradle':
                return 'build/';
              default:
                return 'temp/';
            }
          },
          // TODO Remove for v9.0.1
          clientDistDir: ({ temporaryDir, buildTool }) => {
            switch (buildTool) {
              case 'maven':
                return `${temporaryDir}classes/static/`;
              case 'gradle':
                return `${temporaryDir}resources/main/static/`;
              default:
                return 'dist/';
            }
          },
        });
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      configure({ application }) {
        if (application.authenticationType === 'oauth2') {
          application.syncUserWithIdp = true;
          application.generateBuiltInUserEntity = true;
        }
      },
    });
  }
}
