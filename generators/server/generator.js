import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      async composingTemplateTask() {
        if (this.jhipsterConfig.backendType === 'micronaut') {
          await this.composeWithJHipster('jhipster-micronaut:micronaut');
        }
      },
    });
  }
}
