import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { angularFiles } from './files.mjs';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask({ application }) {
        this.deleteDestination(`src/main/webapp/app/admin/configuration`);
        await this.writeFiles({
          sections: angularFiles,
          context: application,
        });
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeAngularForMicronaut({ application: { authenticationTypeJwt } }) {
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
    });
  }
}
