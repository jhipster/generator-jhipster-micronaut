import chalk from 'chalk';
import ClientGenerator from 'generator-jhipster/esm/generators/client';
import { PRIORITY_PREFIX, WRITING_PRIORITY, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';
import { writeFiles } from './files.cjs';

export default class extends ClientGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, priorityArgs: true, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
    }

    this.sbsBlueprint = true;
  }

  async _postConstruct() {
    await this.dependsOnJHipster('bootstrap-application');
  }

  get [WRITING_PRIORITY]() {
    return {
      // ...writeFiles(),
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      customizeForMicronaut({ application: { clientFrameworkAngular } }) {
        if (clientFrameworkAngular) {
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.ts', content => content.replaceAll('id_token', 'access_token'));
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.spec.ts', content =>
            content.replaceAll('id_token', 'access_token')
          );

          // Should be dropped when the blueprint supports public/admin users.
          this.editFile('src/main/webapp/app/admin/user-management/service/user-management.service.ts', content =>
            content.replaceAll('api/admin/users', 'api/users')
          );
        }
      },
    };
  }

  editFile(filePath, ...transformCallbacks) {
    let content = this.readDestination(filePath);
    for (const cb of transformCallbacks) {
      content = cb(content);
    }
    this.writeDestination(filePath, content);
  }
}
