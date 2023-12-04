import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { commonFiles } from './files.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writeCustomFiles({ application }) {
        await this.writeFiles({
          sections: commonFiles,
          context: application,
        });
      },
    });
  }
}
