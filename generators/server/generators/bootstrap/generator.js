import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.CONFIGURING]() {
    return this.asPreparingTaskGroup({
      async preparingMicronaut() {
        // Set the default backend to micronaut if not set.
        // Needs to be done in the server:bootstrap generator as it is called before server generator.
        // jhipster:server:bootstrap generator needs to know the backend type so it won't compose with the jhipster:spring-boot:bootstrap generator.
        this.jhipsterConfig.backendType ??= 'micronaut';
      },
    });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composingTemplateTask() {
        if (this.jhipsterConfig.backendType === 'micronaut') {
          await this.composeWith('jhipster-micronaut:micronaut:bootstrap');
        }
      },
    });
  }
}
