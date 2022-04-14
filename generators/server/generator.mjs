import chalk from 'chalk';
import os from 'os';
import { utils as jhipsterUtils } from 'generator-jhipster';
import ServerGenerator from 'generator-jhipster/esm/generators/server';
import {
  PRIORITY_PREFIX,
  INITIALIZING_PRIORITY,
  PROMPTING_PRIORITY,
  CONFIGURING_PRIORITY,
  COMPOSING_PRIORITY,
  LOADING_PRIORITY,
  PREPARING_PRIORITY,
  DEFAULT_PRIORITY,
  WRITING_PRIORITY,
  POST_WRITING_PRIORITY,
  INSTALL_PRIORITY,
  END_PRIORITY,
} from 'generator-jhipster/esm/priorities';

import { writeFiles } from './files.cjs';
import { askForModuleName, askForServerSideOpts } from './prompts.cjs';
import mnConstants from '../constants.cjs';
import { extendGenerator } from '#lib/utils.mjs';

const { getBase64Secret } = jhipsterUtils;

export default class extends extendGenerator(ServerGenerator) {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, priorityArgs: true, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
    }
  }

  get [INITIALIZING_PRIORITY]() {
    return {
      ...super._initializing(),
    };
  }

  get [PROMPTING_PRIORITY]() {
    return {
      ...super._prompting(),
      askForModuleName,
      askForServerSideOpts,
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {
      ...super._configuring(),

      configureMicronaut() {
        const { applicationType, authenticationType, jwtSecretKey } = this.jhipsterConfig;
        if (applicationType !== 'monolith' && applicationType !== 'microservice') {
          throw new Error('Application should be only monolith or microservice for this blueprint');
        }
        if (authenticationType === 'oauth2' && !jwtSecretKey) {
          this.jhipsterConfig.jwtSecretKey = getBase64Secret.call(this, null, 64);
        }
      },
    };
  }

  get [COMPOSING_PRIORITY]() {
    return {
      ...super._composing(),
    };
  }

  get [LOADING_PRIORITY]() {
    return {
      ...super._loading(),
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      ...super._preparing(),

      setupMnConstants() {
        this.MN_CONSTANTS = mnConstants;
        this.GRADLE_VERSION = mnConstants.GRADLE_VERSION;
        this.DOCKER_REDIS = mnConstants.DOCKER_REDIS;
        this.DOCKER_CONSUL_CONFIG_LOADER = 'jhipster/consul-config-loader:v0.4.1'; // overrides jhipster value until main generator is updated
        this.JHIPSTER_DEPENDENCIES_VERSION = '3.9.1';
      },
    };
  }

  get [DEFAULT_PRIORITY]() {
    return {
      ...super._default(),
    };
  }

  get [WRITING_PRIORITY]() {
    const { writeEnumFiles } = super._writing();
    return {
      ...writeFiles(),
      writeEnumFiles,
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      ...super._postWriting(),

      customizeMaven({ application: { buildToolMaven } }) {
        if (!buildToolMaven) return;
        this.packageJson.merge({
          scripts: {
            'postci:e2e:package':
              'rm target/original*.$npm_package_config_packaging && cp target/*.$npm_package_config_packaging target/e2e.$npm_package_config_packaging',
          },
        });
      },

      customizeGradle({ application: { buildToolGradle } }) {
        if (!buildToolGradle) return;
        this.packageJson.merge({
          scripts: {
            'java:jar': './gradlew shadowJar -x test -x integrationTest',
            'java:war': './gradlew shadowWar -Pwar -x test -x integrationTest',
            'java:docker': './gradlew shadowJar -Pprod jibDockerBuild',
          },
        });
      },
    };
  }

  get [INSTALL_PRIORITY]() {
    return {
      ...super._install(),
    };
  }

  get [END_PRIORITY]() {
    return {
      end() {
        this.log(chalk.green.bold('\nServer application generated successfully.\n'));

        let executable = 'mvnw';
        if (this.buildTool === 'gradle') {
          executable = 'gradlew';
        }

        let logMsgComment = '';
        if (os.platform() === 'win32') {
          logMsgComment = ` (${chalk.yellow.bold(executable)} if using Windows Command Prompt)`;
        }
        this.log(
          chalk.green(`Run your ${chalk.blue.bold('Micronaut')} application:\n ${chalk.yellow.bold(`./${executable}`)}${logMsgComment}`)
        );
      },
    };
  }
}
