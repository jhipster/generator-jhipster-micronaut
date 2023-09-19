import chalk from 'chalk';
import HerokuGenerator from 'generator-jhipster/generators/heroku';

export default class extends HerokuGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);

    if (this.options.help) return;

    if (!this.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints mhipster')}`);
    }
  }

  get [HerokuGenerator.INITIALIZING]() {
    return {
      async initializingTemplateTask() {},
      ...super.initializing,
    };
  }

  get [HerokuGenerator.PROMPTING]() {
    return {
      async promptingTemplateTask() {},
      ...super.prompting,
    };
  }

  get [HerokuGenerator.CONFIGURING]() {
    return {
      async configuringTemplateTask() {},
      ...super.configuring,
    };
  }

  get [HerokuGenerator.COMPOSING]() {
    return {
      async composingTemplateTask() {},
      ...super.composing,
    };
  }

  get [HerokuGenerator.LOADING]() {
    return {
      async loadingTemplateTask() {},
      ...super.loading,
    };
  }

  get [HerokuGenerator.PREPARING]() {
    return {
      async preparingTemplateTask() {},
      ...super.preparing,
    };
  }

  get [HerokuGenerator.DEFAULT]() {
    return {
      async defaultTemplateTask() {},
      ...super.default,
    };
  }

  get [HerokuGenerator.WRITING]() {
    return {
      ...super.writing,
    };
  }

  get [HerokuGenerator.POST_WRITING]() {
    return {
      async postWritingTemplateTask() {},
      ...super.postWriting,
    };
  }

  get [HerokuGenerator.INSTALL]() {
    return {
      async installTemplateTask() {},
      ...super.install,
    };
  }

  get [HerokuGenerator.END]() {
    return {
      async endTemplateTask() {},
      ...super.end,
    };
  }

  /**
   * build a generated application.
   *
   * @param {String} buildTool - maven | gradle
   * @param {String} profile - dev | prod
   * @param {Boolean} buildWar - build a war instead of a jar
   * @param {Function} cb - callback when build is complete
   * @returns {object} the command line and its result
   */
  buildApplication(buildTool, profile, buildWar, cb) {
    let buildCmd = 'mvnw -ntp verify -B';

    if (buildTool === 'gradle') {
      buildCmd = 'gradlew shadowJar';
    }

    if (os.platform() !== 'win32') {
      buildCmd = `./${buildCmd}`;
    }
    buildCmd += ` -P${profile}`;
    return {
      stdout: ChildProcess.exec(buildCmd, { maxBuffer: 1024 * 10000 }, cb).stdout,
      buildCmd,
    };
  }
}
