import { readFileSync } from 'fs';
import chalk from 'chalk';

export function getLogo() {
  const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));

  return `
${chalk.blue(' ███╗   ███╗')}${chalk.green(' ██╗   ██╗ ████████╗ ███████╗   ██████╗ ████████╗ ████████╗ ███████╗')}
${chalk.blue(' ████╗ ████║')}${chalk.green(' ██║   ██║ ╚══██╔══╝ ██╔═══██╗ ██╔════╝ ╚══██╔══╝ ██╔═════╝ ██╔═══██╗')}
${chalk.blue(' ██╔████╔██║')}${chalk.green(' ████████║    ██║    ███████╔╝ ╚█████╗     ██║    ██████╗   ███████╔╝')}
${chalk.blue(' ██║╚██╔╝██║')}${chalk.green(' ██╔═══██║    ██║    ██╔════╝   ╚═══██╗    ██║    ██╔═══╝   ██╔══██║')}
${chalk.blue(' ██║ ╚═╝ ██║')}${chalk.green(' ██║   ██║ ████████╗ ██║       ██████╔╝    ██║    ████████╗ ██║  ╚██╗')}
${chalk.blue(' ╚═╝     ╚═╝')}${chalk.green(' ╚═╝   ╚═╝ ╚═══════╝ ╚═╝       ╚═════╝     ╚═╝    ╚═══════╝ ╚═╝   ╚═╝')}

${chalk.white.bold('                            https://www.jhipster.tech')}
${chalk.blue.bold('                              https://micronaut.io\n')}
${chalk.white(` Welcome to MHipster v${chalk.white.bold(version)}`)}
${chalk.white(' This blueprint generates your backend as a Micronaut Java project.')}
${chalk.green(' _______________________________________________________________________________________________________________\n')}
${chalk.white(` ${chalk.yellow('::')} This project is a ${chalk.blue.bold('Micronaut')} blueprint for ${chalk.green.bold('JHipster')}`)}
${chalk.white(` ${chalk.yellow('::')} Please let us know if you encounter issues`)}
${chalk.yellow(` :: ${chalk.yellow.bold('https://github.com/jhipster/generator-jhipster-micronaut/issues')}`)}
${chalk.green(' _______________________________________________________________________________________________________________\n')}
${chalk.white('  If you find MHipster useful, support and star the project at:')}
${chalk.yellow.bold('  https://github.com/jhipster/generator-jhipster-micronaut')}
${chalk.green(' _______________________________________________________________________________________________________________\n')}`;
}
