import { existsSync, appendFileSync } from 'node:fs';
import os from 'node:os';
import { readdir } from 'node:fs/promises';
import BaseGenerator from 'generator-jhipster/generators/base';

export default class extends BaseGenerator {
  get [BaseGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      async buildMatrix() {
        const samples = await readdir(this.templatePath('../../generate-sample/templates/samples'));
        const matrix = {
          include: samples.map(sample => ({
            'sample-name': sample,
            'node-version': '18',
            'java-version': '17',
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
