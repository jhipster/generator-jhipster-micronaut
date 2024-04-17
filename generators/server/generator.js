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

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composingTemplateTask() {
        await this.composeWithJHipster('jhipster-micronaut:micronaut');
      },
    });
  }
}
