import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';
import { angularFiles } from './files.js';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async writingTemplateTask({ application }) {
        this.deleteDestination(`src/main/webapp/app/admin/configuration/configuration.model.ts`);
        await this.writeFiles({
          sections: angularFiles,
          context: application,
        });
      },
    });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeAngularForMicronaut({ application: { authenticationTypeJwt, clientSrcDir } }) {
        // health api
        this.editFile(`${clientSrcDir}app/admin/health/health.model.ts`, content => content.replaceAll('components', 'details'));
        this.editFile(`${clientSrcDir}app/admin/health/health.component.html`, content => content.replaceAll('components', 'details'));
        this.editFile(`${clientSrcDir}app/admin/health/health.component.spec.ts`, content => content.replaceAll('components', 'details'));

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile(`${clientSrcDir}app/core/auth/auth-jwt.service.ts`, content => content.replaceAll('id_token', 'access_token'));
          this.editFile(`${clientSrcDir}app/core/auth/auth-jwt.service.spec.ts`, content => content.replaceAll('id_token', 'access_token'));
        }
      },
    });
  }
}
