import chalk from 'chalk';
import CommonGenerator from 'generator-jhipster/generators/common';
import {
  JAVA_MAIN_RESOURCES_DIR as SERVER_MAIN_RES_DIR,
} from 'generator-jhipster';

export default class extends CommonGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(
        `This is a JHipster blueprint and should be used only like ${chalk.yellow(
          "jhipster --blueprints mhipster",
        )}`,
      );
    }

    this.sbsBlueprint = true;
  }

  get [CommonGenerator.LOADING]() {
    return {
      ...super.install,
    };
    /*return {
      loadConfig() {
        this.loadAppConfig();
        this.loadClientConfig();
        this.loadServerConfig();
      },
      loadDerivedProperties() {
        this.loadDerivedAppConfig();
        this.loadDerivedClientConfig();
        this.loadDerivedServerConfig();
      }
    };*/
  }
}
