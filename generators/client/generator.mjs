import chalk from 'chalk';
import ClientGenerator from 'generator-jhipster/esm/generators/client';
import { PRIORITY_PREFIX, DEFAULT_PRIORITY, WRITING_PRIORITY, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';
import { angularFiles, reactFiles } from './files.cjs';
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

  get [DEFAULT_PRIORITY]() {
    return {
      async setHipster() {
        this.options.jhipsterContext.hipster = this.getHipster();
      },
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      async writeCustomFiles({ application }) {
        const { clientFrameworkAngular, clientFrameworkReact } = application;
        if (clientFrameworkAngular) {
          this.deleteDestination(`src/main/webapp/app/admin/configuration`);
          await this.writeFiles({
            sections: angularFiles,
            context: application,
          });
        } else if (clientFrameworkReact) {
          await this.writeFiles({
            sections: reactFiles,
            context: application,
          });
        }
      },
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      customizeAngularForMicronaut({ application: { clientFrameworkAngular, authenticationTypeJwt, authenticationTypeOauth2 } }) {
        if (!clientFrameworkAngular) return;

        // Update home with mhipster
        this.editFile('src/main/webapp/app/home/home.component.html', content =>
          content
            .replaceAll('https://github.com/jhipster/generator-jhipster', 'https://github.com/jhipster/generator-jhipster-micronaut')
            .replace('If you like JHipster', 'If you like MHipster')
            .replace('JHipster bug tracker', 'MHipster bug tracker')
            .replace('If you have any question on JHipster', 'If you have any question on JHipster or MHipster')
        );

        // health api
        this.editFile('src/main/webapp/app/admin/health/health.model.ts', content => content.replaceAll('components', 'details'));
        this.editFile('src/main/webapp/app/admin/health/health.component.html', content => content.replaceAll('components', 'details'));
        this.editFile('src/main/webapp/app/admin/health/health.component.spec.ts', content => content.replaceAll('components', 'details'));

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.ts', content => content.replaceAll('id_token', 'access_token'));
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.spec.ts', content =>
            content.replaceAll('id_token', 'access_token')
          );
        }
        if (!authenticationTypeOauth2) {
          // Should be dropped when the blueprint supports public/admin users.
          this.editFile('src/main/webapp/app/admin/user-management/service/user-management.service.ts', content =>
            content.replaceAll('api/admin/users', 'api/users')
          );
        }
      },

      customizeReactForMicronaut({ application: { clientFrameworkReact, authenticationTypeJwt, authenticationTypeOauth2 } }) {
        if (!clientFrameworkReact) return;

        // Update home with mhipster
        this.editFile('src/main/webapp/app/modules/home/home.tsx', content =>
          content
            .replaceAll('https://github.com/jhipster/generator-jhipster', 'https://github.com/jhipster/generator-jhipster-micronaut')
            .replace('If you like JHipster', 'If you like MHipster')
            .replace('JHipster bug tracker', 'MHipster bug tracker')
            .replace('If you have any question on JHipster', 'If you have any question on JHipster or MHipster')
        );

        // health api
        this.editFile('src/main/webapp/app/modules/administration/health/health.tsx', content =>
          content.replaceAll('components', 'details')
        );

        // active-profiles api
        this.editFile('src/main/webapp/app/shared/reducers/application-profile.ts', content =>
          content.replaceAll('.activeProfiles', "['active-profiles']")
        );
        this.editFile('src/main/webapp/app/shared/reducers/application-profile.spec.ts', content =>
          content.replaceAll('activeProfiles', "['active-profiles']")
        );
        this.editFile('src/main/webapp/app/modules/administration/administration.reducer.spec.ts', content =>
          content.replaceAll('activeProfiles', "['active-profiles']")
        );

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile('src/main/webapp/app/shared/reducers/authentication.spec.ts', content =>
            content.replaceAll("headers: { authorization: 'Bearer ", "data: { access_token: '")
          );
          this.editFile('src/main/webapp/app/shared/reducers/authentication.ts', content =>
            content
              .replace('const bearerToken = response?.headers?.authorization;', 'const jwt = response?.data?.access_token;')
              .replace("bearerToken && bearerToken.slice(0, 7) === 'Bearer '", 'jwt')
              .replace('const jwt = bearerToken.slice(7, bearerToken.length);', '')
          );
        }
        if (!authenticationTypeOauth2) {
          // Should be dropped when the blueprint supports public/admin users.
          this.editFile('src/main/webapp/app/modules/administration/user-management/user-management.reducer.ts', content =>
            content.replaceAll('api/admin/users', 'api/users')
          );
        }
      },
    };
  }
}
