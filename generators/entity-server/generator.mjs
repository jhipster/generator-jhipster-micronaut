import chalk from 'chalk';
import EntityServerGenerator from 'generator-jhipster/esm/generators/entity-server';
import {
  PRIORITY_PREFIX,
  INITIALIZING_PRIORITY,
  PROMPTING_PRIORITY,
  CONFIGURING_PRIORITY,
  COMPOSING_PRIORITY,
  LOADING_PRIORITY,
  PREPARING_PRIORITY,
  PREPARING_FIELDS_PRIORITY,
  PREPARING_RELATIONSHIPS_PRIORITY,
  DEFAULT_PRIORITY,
  WRITING_PRIORITY,
  POST_WRITING_PRIORITY,
  INSTALL_PRIORITY,
  END_PRIORITY,
} from 'generator-jhipster/esm/priorities';
import { writeFiles } from './files.cjs';

export default class extends EntityServerGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
    }
  }

  get [INITIALIZING_PRIORITY]() {
    return {
      ...super._initializing(),
    };
  }

  get [PROMPTING_PRIORITY]() {
    return {
      ...super._prompting(),
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {
      ...super._configuring(),
    };
  }

  get [COMPOSING_PRIORITY]() {
    return {
      ...super._composing(),
    };
  }

  get [LOADING_PRIORITY]() {
    return {
      ...super._loading(),
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      ...super._preparing(),
    };
  }

  get [PREPARING_FIELDS_PRIORITY]() {
    return {
      ...super._preparingFields(),
    };
  }

  get [PREPARING_RELATIONSHIPS_PRIORITY]() {
    return {
      ...super._preparingRelationships(),
    };
  }

  get [DEFAULT_PRIORITY]() {
    return {
      ...super._default(),
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      ...super._writing(),
      cleanupMicronautCustomizedFiles() {
        this.deleteDestination(`${this.packageFolder}/repository`);
        this.deleteDestination(`${this.packageFolder}/service`);
        this.deleteDestination(`${this.packageFolder}/web`);
      },
      ...writeFiles(),
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      ...super._postWriting(),
    };
  }

  get [INSTALL_PRIORITY]() {
    return {
      ...super._install(),
    };
  }

  get [END_PRIORITY]() {
    return {
      ...super._end(),
    };
  }
}
