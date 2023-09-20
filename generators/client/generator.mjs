import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { angularFiles, reactFiles } from './files.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
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
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeAngularForMicronaut({ application: { clientFrameworkAngular, authenticationTypeJwt, authenticationTypeOauth2 } }) {
        if (!clientFrameworkAngular) return;

        // Update home with mhipster
        this.editFile('src/main/webapp/app/home/home.component.html', content =>
          content
            .replaceAll('https://github.com/jhipster/generator-jhipster', 'https://github.com/jhipster/generator-jhipster-micronaut')
            .replace('If you like JHipster', 'If you like MHipster')
            .replace('JHipster bug tracker', 'MHipster bug tracker')
            .replace('If you have any question on JHipster', 'If you have any question on JHipster or MHipster'),
        );

        // health api
        this.editFile('src/main/webapp/app/admin/health/health.model.ts', content => content.replaceAll('components', 'details'));
        this.editFile('src/main/webapp/app/admin/health/health.component.html', content => content.replaceAll('components', 'details'));
        this.editFile('src/main/webapp/app/admin/health/health.component.spec.ts', content => content.replaceAll('components', 'details'));

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.ts', content => content.replaceAll('id_token', 'access_token'));
          this.editFile('src/main/webapp/app/core/auth/auth-jwt.service.spec.ts', content =>
            content.replaceAll('id_token', 'access_token'),
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
            .replace('If you have any question on JHipster', 'If you have any question on JHipster or MHipster'),
        );

        // health api
        this.editFile('src/main/webapp/app/modules/administration/health/health.tsx', content =>
          content.replaceAll('components', 'details'),
        );

        // active-profiles api
        this.editFile('src/main/webapp/app/shared/reducers/application-profile.ts', content =>
          content.replaceAll('.activeProfiles', "['active-profiles']"),
        );
        this.editFile('src/main/webapp/app/shared/reducers/application-profile.spec.ts', content =>
          content.replaceAll('activeProfiles', "['active-profiles']"),
        );
        this.editFile('src/main/webapp/app/modules/administration/administration.reducer.spec.ts', content =>
          content.replaceAll('activeProfiles', "['active-profiles']"),
        );

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile('src/main/webapp/app/shared/reducers/authentication.spec.ts', content =>
            content.replaceAll("headers: { authorization: 'Bearer ", "data: { access_token: '"),
          );
          this.editFile('src/main/webapp/app/shared/reducers/authentication.ts', content =>
            content
              .replace('const bearerToken = response?.headers?.authorization;', 'const jwt = response?.data?.access_token;')
              .replace("bearerToken && bearerToken.slice(0, 7) === 'Bearer '", 'jwt')
              .replace('const jwt = bearerToken.slice(7, bearerToken.length);', ''),
          );
        }
      },
    });
  }
}
