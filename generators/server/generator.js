import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {
        // Disables some prompts by making it configured, it will be shown using `--ask-answered` option.
        this.jhipsterConfig.reactive = false;
        this.jhipsterConfig.databaseType = 'sql';
      },
    });
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
