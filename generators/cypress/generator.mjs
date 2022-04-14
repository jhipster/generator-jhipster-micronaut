import chalk from 'chalk';
import CypressGenerator from 'generator-jhipster/esm/generators/cypress';
import { PRIORITY_PREFIX, POST_WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';
import { extendGenerator } from '#lib/utils.mjs';

export default class extends extendGenerator(CypressGenerator) {
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

  get [POST_WRITING_PRIORITY]() {
    return {
      customizeCypressForMicronaut({ application: { authenticationTypeJwt, authenticationTypeOauth2 } }) {
        this.editFile('src/test/javascript/cypress/integration/administration/administration.spec.ts', content =>
          content.replaceAll('info.activeProfiles', "info['active-profiles']")
        );
        if (authenticationTypeJwt) {
          this.editFile('src/test/javascript/cypress/support/commands.ts', content => content.replaceAll('id_token', 'access_token'));
        }
      },
    };
  }
}
