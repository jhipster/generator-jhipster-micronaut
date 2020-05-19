/* eslint-disable consistent-return */
const chalk = require('chalk');
const AppGenerator = require('generator-jhipster/generators/app');
// const jhipsterPackagejs = require('generator-jhipster/package.json');

const prompts = require('./prompts');

module.exports = class extends AppGenerator {
    // /**
    //  * Override yeoman standard storage function for yo-rc.json
    //  *  in order to save variables in generator-jhipster key.
    //  * @return {String} The name of the root generator
    //  */
    // rootGeneratorName() {
    //     return jhipsterPackagejs.name;
    // }

    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
        }

        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        const initPhaseFromJHipster = this._initializing();

        const jhipsterInitAppPhaseSteps = {
            displayLogo() {
                /* eslint-disable prettier/prettier */
                /* This just isn't going to be pretty */

                this.log('\n');
                this.log(`${chalk.blue(' ███╗   ███╗')}${chalk.green(' ██╗   ██╗ ████████╗ ███████╗   ██████╗ ████████╗ ████████╗ ███████╗')}`);
                this.log(`${chalk.blue(' ████╗ ████║')}${chalk.green(' ██║   ██║ ╚══██╔══╝ ██╔═══██╗ ██╔════╝ ╚══██╔══╝ ██╔═════╝ ██╔═══██╗')}`);
                this.log(`${chalk.blue(' ██╔████╔██║')}${chalk.green(' ████████║    ██║    ███████╔╝ ╚█████╗     ██║    ██████╗   ███████╔╝')}`);
                this.log(`${chalk.blue(' ██║╚██╔╝██║')}${chalk.green(' ██╔═══██║    ██║    ██╔════╝   ╚═══██╗    ██║    ██╔═══╝   ██╔══██║')}`);
                this.log(`${chalk.blue(' ██║ ╚═╝ ██║')}${chalk.green(' ██║   ██║ ████████╗ ██║       ██████╔╝    ██║    ████████╗ ██║  ╚██╗')}`);
                this.log(`${chalk.blue(' ╚═╝     ╚═╝')}${chalk.green(' ╚═╝   ╚═╝ ╚═══════╝ ╚═╝       ╚═════╝     ╚═╝    ╚═══════╝ ╚═╝   ╚═╝')}\n`);
                this.log(chalk.white.bold('                            https://www.jhipster.tech'));
                this.log(chalk.blue.bold('                              https://micronaut.io\n'));
                this.log(chalk.white(' Welcome to MHipster  🤓  :: Running Micronaut version 1.3.4'));
                this.log(chalk.white(' This blueprint generates your backend as a Micronaut Java project.'));
                this.log(chalk.green(' _______________________________________________________________________________________________________________\n'));
                this.log(
                    chalk.white(
                        `  If you find MHipster useful, support and star the project at ${chalk.yellow(
                            'https://github.com/jhipster/generator-jhipster-micronaut'
                        )}`
                    )
                );
                this.log(
                    chalk.green(
                        ' _______________________________________________________________________________________________________________\n'
                    )
                );
            }
        };

        return Object.assign(initPhaseFromJHipster, jhipsterInitAppPhaseSteps);
    }

    get prompting() {
        const defaultPhaseFromJHipster = super._prompting();

        return {
            ...defaultPhaseFromJHipster,
            askForApplicationType: prompts.askForApplicationType
        };
    }

    get configuring() {
        const configuringPhaseFromJHipster = super._configuring();

        const mhipsterConfigureAppPhaseSteps = {
            composeServer() {
                if (this.skipServer) return;
                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../server'), {
                    ...options,
                    configOptions,
                    'client-hook': !this.skipClient,
                    debug: this.isDebugEnabled
                });
            },

            composeClient() {
                if (this.skipClient) return;
                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../client'), {
                    ...options,
                    configOptions,
                    debug: this.isDebugEnabled
                });
            },

            composeCommon() {
                const options = this.options;
                const configOptions = this.configOptions;

                this.composeWith(require.resolve('../common'), {
                    ...options,
                    'client-hook': !this.skipClient,
                    configOptions,
                    debug: this.isDebugEnabled
                });
            }
        };

        return Object.assign(configuringPhaseFromJHipster, mhipsterConfigureAppPhaseSteps);
    }

    get default() {
        const jhipsterDefault = super._default();

        return {
            ...jhipsterDefault,
            askForTestOpts: prompts.askForTestOpts,
            askForMoreModules: undefined
        };
    }

    get writing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._writing();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }
};
