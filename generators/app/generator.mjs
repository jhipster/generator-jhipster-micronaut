import AppGenerator from 'generator-jhipster/generators/app';
import command from './command.mjs';

export default class extends AppGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      checkBlueprint: true,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });
  }

  get [AppGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [AppGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,
    });
  }

  get [AppGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
    });
  }

  get [AppGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      ...super.composing,
    });
  }

  get [AppGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
    });
  }

  get [AppGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
    });
  }

  get [AppGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
    });
  }

  get [AppGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
    });
  }

  get [AppGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
    });
  }

  get [AppGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      ...super.install,
    });
  }

  get [AppGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
    });
  }
}
