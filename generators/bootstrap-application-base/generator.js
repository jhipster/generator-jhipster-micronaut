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
      async preparingMicronaut({ application, applicationDefaults }) {
        Object.assign(application, {
          backendTypeJavaAny: true,
          hipster: 'jhipster_family_member_4',
          hipsterBugTrackerLink: 'https://github.com/jhipster/generator-jhipster-micronaut/issues?state=open',
          hipsterBugTrackerProductName: 'MHipster',
          hipsterHomePageProductName: 'MHipster',
          hipsterName: 'Micronaut Hipster',
          hipsterProductName: 'MHipster',
          hipsterProjectLink: 'https://github.com/jhipster/generator-jhipster-micronaut',
        });
        applicationDefaults({
          messageBrokerPulsar: undefined,
        });
      },
    });
  }

  get [BaseApplicationGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      configure({ application }) {
        // bootstrap-application-base generator does not respect current configured hipster value.
        Object.assign(application, {
          hipster: 'jhipster_family_member_4',
        });
        if (application.authenticationType === 'oauth2') {
          application.syncUserWithIdp = true;
          application.generateBuiltInUserEntity = true;
        }
      },
    });
  }
}
