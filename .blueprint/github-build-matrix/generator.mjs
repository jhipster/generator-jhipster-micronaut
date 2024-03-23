import { existsSync, appendFileSync } from 'node:fs';
import os from 'node:os';
import { readdir } from 'node:fs/promises';
import BaseGenerator from 'generator-jhipster/generators/base';
import { RECOMMENDED_NODE_VERSION, RECOMMENDED_JAVA_VERSION } from 'generator-jhipster';

export default class extends BaseGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, jhipsterBootstrap: false });
  }

  get [BaseGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async buildMatrix() {
        const samples = await readdir(this.templatePath('../../generate-sample/templates/samples'));
        const matrix = {
          include: samples
            .filter(sample => !sample.includes('disabled'))
            .map(sample => ({
              'sample-name': sample,
              'node-version': RECOMMENDED_NODE_VERSION,
              'java-version': RECOMMENDED_JAVA_VERSION,
              'build-tool': sample.includes('gradle') ? 'gradle' : 'maven',
            })),
        };
        const matrixoutput = `matrix<<EOF${os.EOL}${JSON.stringify(matrix)}${os.EOL}EOF${os.EOL}`;
        const filePath = process.env['GITHUB_OUTPUT'];
        if (filePath && existsSync(filePath)) {
          appendFileSync(filePath, matrixoutput, { encoding: 'utf8' });
        } else {
          console.log(matrixoutput);
        }
      },
    });
  }
}
