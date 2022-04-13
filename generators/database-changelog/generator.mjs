import chalk from 'chalk';
import DatabaseChangelogGenerator from 'generator-jhipster/esm/generators/database-changelog';
import { PRIORITY_PREFIX, INITIALIZING_PRIORITY } from 'generator-jhipster/esm/priorities';

export default class extends DatabaseChangelogGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
    }
  }

  get [INITIALIZING_PRIORITY]() {
    return {};
  }
}
