import chalk from 'chalk';
import EntityGenerator from 'generator-jhipster/generators/entity';

export default class extends EntityGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints mhipster",
        )}`,
      );
    }
  }

  get [EntityGenerator.INITIALIZING]() {
    return {
      async initializingTemplateTask() {},
      ...super.initializing,
    };
  }

  get [EntityGenerator.PROMPTING]() {
    return {
      ...super.prompting,
      askForFiltering: undefined,
    };
  }

  get [EntityGenerator.CONFIGURING]() {
    return {
      ...super.configuring,
    };
  }

  get [EntityGenerator.COMPOSING]() {
    return {
      ...super.composing,
    };
  }

  get [EntityGenerator.LOADING]() {
    return {
      ...super.loading,
    };
  }

  get [EntityGenerator.PREPARING_EACH_ENTITY_FIELD]() {
    return {
      ...super.preparingEachEntityField,
    };
  }

  get [EntityGenerator.PREPARING_EACH_ENTITY_RELATIONSHIP]() {
    return {
      ...super.preparingEachEntityRelationship,
    };
  }

  get [EntityGenerator.DEFAULT]() {
    return {
      ...super.default,
    };
  }

  get [EntityGenerator.WRITING]() {
    return {
      ...super.writing,
    };
  }

  get [EntityGenerator.POST_WRITING]() {
    return {
      ...super.postWriting,
    };
  }

  get [EntityGenerator.INSTALL]() {
    return {
      ...super.install,
    };
  }

  get [EntityGenerator.END]() {
    return {
      ...super.end,
    };
  }
}
