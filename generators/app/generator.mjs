import chalk from 'chalk';
import AppGenerator from 'generator-jhipster/generators/app';

import { askForApplicationType } from './prompts.cjs';

export default class extends AppGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints mhipster')}`);
    }
  }

  get [AppGenerator.INITIALIZING]() {
    return {
      ...super.initializing,
      async initializingTemplateTask() {},
    };
  }

  get [AppGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      askForApplicationType,
    };
  }

  get [AppGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
    };
  }

  get [AppGenerator.COMPOSING]() {
    return {
      ...super.composing,
      askForMoreModules: undefined,
    };
  }

  get [AppGenerator.LOADING]() {
    return {
      ...super.loading,
    };
  }

  get [AppGenerator.PREPARING]() {
    return {
      ...super.preparing,
    };
  }

  get [AppGenerator.DEFAULT]() {
    return {
      ...super.default,
    };
  }

  get [AppGenerator.WRITING]() {
    return {
      ...super.writing,
    };
  }

  get [AppGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
    };
  }

  get [AppGenerator.INSTALL]() {
    return {
      ...super.install,
    };
  }

  get [AppGenerator.END]() {
    return {
      ...super.end,
    };
  }
}
