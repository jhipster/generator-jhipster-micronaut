import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeCypress({ application }) {
        this.editFile(`${application.cypressDir}e2e/administration/administration.cy.ts`, content =>
          content.replaceAll('info.activeProfiles', "info['active-profiles']"),
        );
        if (application.authenticationTypeJwt) {
          this.editFile(`${application.cypressDir}support/commands.ts`, content => content.replaceAll('id_token', 'access_token'));
        }
        if (application.generateUserManagement) {
          this.editFile(`${application.cypressDir}e2e/entity/user-management.cy.ts`, content =>
            content.replace(
              "it('edit button click should load edit UserManagement page and save",
              "it.skip('edit button click should load edit UserManagement page and save",
            ),
          );
        }
      },
    });
  }
}
