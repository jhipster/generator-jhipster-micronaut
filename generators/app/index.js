/* eslint-disable consistent-return */
const chalk = require('chalk');
const AppGenerator = require('generator-jhipster/generators/app');
const jhipsterPackagejs = require('generator-jhipster/package.json');

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
        super(args, Object.assign({ fromBlueprint: true }, opts)); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
        }

        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        const initPhaseFromJHipster = this._initializing();
        this.log(chalk.white('Initializing...'));

        const jhipsterInitAppPhaseSteps = {
            displayLogo() {
                this.log('\n');
                this.log(`${chalk.blue(' ███╗   ███╗')}${chalk.green(' ██╗   ██╗ ████████╗ ███████╗   ██████╗ ████████╗ ████████╗ ███████╗')}`);
                this.log(`${chalk.blue(' ████╗ ████║')}${chalk.green(' ██║   ██║ ╚══██╔══╝ ██╔═══██╗ ██╔════╝ ╚══██╔══╝ ██╔═════╝ ██╔═══██╗')}`);
                this.log(`${chalk.blue(' ██╔████╔██║')}${chalk.green(' ████████║    ██║    ███████╔╝ ╚█████╗     ██║    ██████╗   ███████╔╝')}`);
                this.log(`${chalk.blue(' ██║╚██╔╝██║')}${chalk.green(' ██╔═══██║    ██║    ██╔════╝   ╚═══██╗    ██║    ██╔═══╝   ██╔══██║')}`);
                this.log(`${chalk.blue(' ██║ ╚═╝ ██║')}${chalk.green(' ██║   ██║ ████████╗ ██║       ██████╔╝    ██║    ████████╗ ██║  ╚██╗')}`);
                this.log(`${chalk.blue(' ╚═╝     ╚═╝')}${chalk.green(' ╚═╝   ╚═╝ ╚═══════╝ ╚═╝       ╚═════╝     ╚═╝    ╚═══════╝ ╚═╝   ╚═╝')}\n`);
                this.log(chalk.white.bold('                            https://www.jhipster.tech\n'));
                this.log(chalk.white('Welcome to MHipster  🤓  :: Running Micronaut version 1.3.0'));
                this.log(chalk.white('This blueprint generates your backend as a Micronaut Java project.'));
                this.log(chalk.green(' _______________________________________________________________________________________________________________\n'));
                this.log(chalk.white(`  For any questions or improvements refer to the stream lead at ${chalk.yellow('https://github.com/willbuck')}`));
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
        this.log(chalk.white('Prompting...'));
        // If the prompts need to be overriden then use the code commented out above instead
        return super._prompting();
    }

    get configuring() {
        const configuringPhaseFromJHipster = super._configuring();
        this.log(chalk.white('Configuring...'));

        const jhipsterConfigureAppPhaseSteps = {
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

        return Object.assign(configuringPhaseFromJHipster, jhipsterConfigureAppPhaseSteps);
    }

    get default() {
        const defaultPhaseFromJHipster = super._default();
        const jhipsterConfigureAppPhaseSteps = {

        };

        this.log(chalk.white('Default...'));

        return Object.assign(defaultPhaseFromJHipster, jhipsterConfigureAppPhaseSteps);
    }

    get writing() {
        const writingPhaseFromJHipster = super._writing();

        const jhipsterWritingAppPhaseSteps = {

        };

        this.log(chalk.white('Writing...'));

        return Object.assign(writingPhaseFromJHipster, jhipsterWritingAppPhaseSteps);
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        this.log(chalk.white('Ending...'));
        return super._end();
    }
};
