import chalk from 'chalk';
import ClientGenerator from 'generator-jhipster/esm/generators/client';
import { PRIORITY_PREFIX, WRITING_PRIORITY, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';
import { angularFiles } from './files.cjs';
import { extendGenerator } from '#lib/utils.mjs';

export default class extends extendGenerator(ClientGenerator) {
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
      async writeCustomFiles({ application }) {
        const { clientFrameworkAngular } = application;
        if (clientFrameworkAngular) {
          this.deleteDestination(`src/main/webapp/app/admin/configuration`);
          await this.writeFiles({
            sections: angularFiles,
            context: application,
          });
        }
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      customizeAngularForMicronaut({ application: { clientFrameworkAngular, authenticationTypeJwt } }) {
        if (!clientFrameworkAngular) return;
        if (authenticationTypeJwt) {
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.ts', content => content.replaceAll('id_token', 'access_token'));
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.spec.ts', content =>
            content.replaceAll('id_token', 'access_token')
          );

          this.editFile('src/main/webapp/app/admin/health/health.model.ts', content => content.replaceAll('components', 'details'));
          this.editFile('src/main/webapp/app/admin/health/health.component.html', content => content.replaceAll('components', 'details'));
          this.editFile('src/main/webapp/app/admin/health/health.component.spec.ts', content =>
            content.replaceAll('components', 'details')
          );

          // Should be dropped when the blueprint supports public/admin users.
          this.editFile('src/main/webapp/app/admin/user-management/service/user-management.service.ts', content =>
            content.replaceAll('api/admin/users', 'api/users')
          );
        }
      },

      customizeCypressForMicronaut({ application: { cypressTests, authenticationTypeJwt, authenticationTypeOauth2 } }) {
        if (!cypressTests) return;
        this.editFile('src/test/javascript/cypress/integration/administration/administration.spec.ts', content =>
          content.replaceAll('info.activeProfiles', "info['active-profiles']")
        );
        if (authenticationTypeJwt) {
          this.editFile('src/test/javascript/cypress/support/commands.ts', content => content.replaceAll('id_token', 'access_token'));
        }
        if (!authenticationTypeOauth2) {
          this.editFile('src/test/javascript/cypress/integration/account/reset-password-page.spec.ts', content =>
            content.replaceAll('user@gmail.com', 'user@localhost.fr')
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
