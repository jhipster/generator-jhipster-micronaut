import chalk from 'chalk';
import { constants as jhipsterConstants } from 'generator-jhipster';
import CommonGenerator from 'generator-jhipster/esm/generators/common';
import { PRIORITY_PREFIX, LOADING_PRIORITY, PREPARING_PRIORITY, WRITING_PRIORITY } from 'generator-jhipster/esm/priorities';
import { writeFiles } from './files.cjs';

export default class extends CommonGenerator {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
    }

    this.sbsBlueprint = true;
  }

  get [LOADING_PRIORITY]() {
    return {
      loadConfig() {
        this.loadAppConfig();
        this.loadClientConfig();
        this.loadServerConfig();
      },
      loadDerivedProperties() {
        this.loadDerivedAppConfig();
        this.loadDerivedClientConfig();
        this.loadDerivedServerConfig();
      },
      loadConstants() {
        // Make constants available in templates
        this.MAIN_DIR = jhipsterConstants.MAIN_DIR;
        this.TEST_DIR = jhipsterConstants.TEST_DIR;
        this.SERVER_MAIN_RES_DIR = jhipsterConstants.SERVER_MAIN_RES_DIR;
        this.ANGULAR = jhipsterConstants.SUPPORTED_CLIENT_FRAMEWORKS.ANGULAR;
        this.REACT = jhipsterConstants.SUPPORTED_CLIENT_FRAMEWORKS.REACT;

        // Make documentation URL available in templates
        this.DOCUMENTATION_URL = jhipsterConstants.JHIPSTER_DOCUMENTATION_URL;
        this.DOCUMENTATION_ARCHIVE_PATH = jhipsterConstants.JHIPSTER_DOCUMENTATION_ARCHIVE_PATH;
      },
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      prepare() {
        this.BUILD_DIR = this.getBuildDirectoryForBuildTool(this.buildTool);
        this.CLIENT_DIST_DIR = this.getResourceBuildDirectoryForBuildTool(this.buildTool) + jhipsterConstants.CLIENT_DIST_DIR;
      },
    };
  }

  get [WRITING_PRIORITY]() {
    return {
      ...writeFiles(),
    };
  }
}
