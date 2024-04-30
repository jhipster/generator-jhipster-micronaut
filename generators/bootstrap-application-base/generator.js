import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asPreparingTaskGroup({
      async preparingMicronaut() {
        this.jhipsterConfig.backendType = 'micronaut';
      },
    });
  }

  get [BaseApplicationGenerator.LOADING]() {
    return this.asPreparingTaskGroup({
      async preparingMicronaut({ application }) {
        Object.assign(application, {
          backendTypeJavaAny: true,
          hipster: 'jhipster_family_member_4',
          hipsterBugTrackerLink: 'https://github.com/jhipster/generator-jhipster-micronaut/issues?state=open',
          hipsterBugTrackerProductName: 'MHipster',
          hipsterHomePageProductName: 'MHipster',
          hipsterName: 'Micronaut Hipster',
          hipsterProductName: 'MHipster',
          hipsterProjectLink: 'https://github.com/jhipster/generator-jhipster-micronaut',
          hipsterStackOverflowProductName: 'JHipster',
          hipsterStackoverflowLink: 'https://stackoverflow.com/tags/jhipster/info',
          hipsterTwitterLink: 'https://twitter.com/jhipster',
          hipsterTwitterUsername: '@jhipster',
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
