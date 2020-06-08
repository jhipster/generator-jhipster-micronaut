/* eslint-disable consistent-return */
const chalk = require('chalk');
const HerokuGenerator = require('generator-jhipster/generators/heroku');
const constants = require('generator-jhipster/generators/generator-constants');

module.exports = class extends HerokuGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint micronaut')}`);
        }

        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        return super._initializing();
    }

    get prompting() {
        return super._prompting();
    }

    get configuring() {
        return super._configuring();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        const phaseFromJHipster = super._default();
        const jhipsterMicronautDefaultPhaseSteps = {
            copyHerokuFiles() {
                if (this.abort) return;

                const done = this.async();
                this.log(chalk.bold('\nCreating Heroku deployment files'));

                // this.template('bootstrap-heroku.yml.ejs', `${constants.SERVER_MAIN_RES_DIR}/config/bootstrap-heroku.yml`);
                this.template('application-heroku.yml.ejs', `${constants.SERVER_MAIN_RES_DIR}/application-heroku.yml`);
                this.template('Procfile.ejs', 'Procfile');
                this.template('system.properties.ejs', 'system.properties');
                if (this.buildTool === 'gradle') {
                    this.template('heroku.gradle.ejs', 'gradle/heroku.gradle');
                }
                if (this.useOkta) {
                    this.template('provision-okta-addon.sh.ejs', 'provision-okta-addon.sh');
                    fs.appendFile('.gitignore', 'provision-okta-addon.sh', 'utf8', (err, data) => {
                        this.log(`${chalk.yellow.bold('WARNING!')}Failed to add 'provision-okta-addon.sh' to .gitignore.'`);
                    });
                }

                this.conflicter.resolve(err => {
                    done();
                });
            },
            addHerokuDependencies() {
                // Nothing to do here right now
            },
        }
        return Object.assign(phaseFromJHipster, jhipsterMicronautDefaultPhaseSteps);
    }

    get end() {
        return super._end();
    }
};
