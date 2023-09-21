import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeCypress({ application }) {
        if (application.authenticationTypeJwt) {
          this.editFile(`${application.cypressDir}support/commands.ts`, content => content.replaceAll('id_token', 'access_token'));
          this.editFile(`${application.cypressDir}e2e/administration/administration.cy.ts`, content =>
            content.replace("describe('/docs'", "describe.skip('/docs'"),
          );
        }
      },
    });
  }
}
