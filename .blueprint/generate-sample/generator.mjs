import { readdir } from 'node:fs/promises';
import process from 'node:process';
import BaseGenerator from 'generator-jhipster/generators/base';
import command from './command.mjs';
import { readFileSync } from 'node:fs';

export default class extends BaseGenerator {
  sampleName;

  get [BaseGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializeOptions() {
        this.parseJHipsterArguments(command.arguments);
        if (this.sampleName && !this.sampleName.endsWith('.jdl')) {
          this.sampleName += '.jdl';
        }
        this.parseJHipsterOptions(command.options);
      },
    });
  }

  get [BaseGenerator.PROMPTING]() {
    return this.asPromptingTaskGroup({
      async askForSample() {
        if (!this.sampleName) {
          const answers = await this.prompt({
            type: 'list',
            name: 'sampleName',
            message: 'which sample do you want to generate?',
            choices: async () => readdir(this.templatePath('samples')),
          });
          this.sampleName = answers.sampleName;
        }
      },
    });
  }

  get [BaseGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async copySample() {
        this.copyTemplate(`samples/${this.sampleName}`, this.sampleName, { noGlob: true });
      },
    });
  }

  get [BaseGenerator.END]() {
    return this.asEndTaskGroup({
      async generateSample() {
        const packageJson = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url)));
        const projectVersion = `${packageJson.version}-git`;

        process.env.JHI_PROFILE = 'dev';

        await this.composeWithJHipster('jdl', {
          generatorArgs: [this.sampleName],
          generatorOptions: {
            skipJhipsterDependencies: true,
            insight: false,
            skipChecks: true,
            skipInstall: true,
            projectVersion,
          },
        });
      },
      async jhipsterInfo() {
        await this.composeWithJHipster('info');
      },
    });
  }
}
