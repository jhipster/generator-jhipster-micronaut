import HerokuGenerator from 'generator-jhipster/generators/heroku';
import command from './command.mjs';

export default class extends HerokuGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      checkBlueprint: true,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });
  }

  get [HerokuGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      ...super.initializing,
      async initializingTemplateTask() {
        this.parseJHipsterArguments(command.arguments);
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [HerokuGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      ...super.prompting,
    });
  }

  get [HerokuGenerator.CONFIGURING]() {
    return this.asConfiguringTaskGroup({
      ...super.configuring,
    });
  }

  get [HerokuGenerator.COMPOSING]() {
    return this.asComposingTaskGroup({
      ...super.composing,
    });
  }

  get [HerokuGenerator.LOADING]() {
    return this.asLoadingTaskGroup({
      ...super.loading,
    });
  }

  get [HerokuGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
    });
  }

  get [HerokuGenerator.DEFAULT]() {
    return this.asDefaultTaskGroup({
      ...super.default,
    });
  }

  get [HerokuGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
    });
  }

  get [HerokuGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
    });
  }

  get [HerokuGenerator.INSTALL]() {
    return this.asInstallTaskGroup({
      ...super.install,
    });
  }

  get [HerokuGenerator.END]() {
    return this.asEndTaskGroup({
      ...super.end,
    });
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
