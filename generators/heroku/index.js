/* eslint-disable consistent-return */
const chalk = require('chalk');
const fs = require('fs');
const ChildProcess = require('child_process');
const HerokuGenerator = require('generator-jhipster/generators/heroku');
const constants = require('generator-jhipster/generators/generator-constants');

const execCmd = util.promisify(ChildProcess.exec);

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
        return {
            validateFromCli() {
                this.checkInvocationFromCLI();
            },

            async checkInstallation() {
                try {
                    await execCmd('heroku --version');
                } catch (err) {
                    this.log.error("You don't have the Heroku CLI installed. Download it from https://cli.heroku.com/");
                }
            },


            initializing() {
                this.log(chalk.bold('Heroku configuration is starting'));
                const configuration = this.getAllJhipsterConfig(this, true);
                this.env.options.appPath = configuration.get('appPath') || constants.CLIENT_MAIN_SRC_DIR;
                this.baseName = configuration.get('baseName');
                this.packageName = configuration.get('packageName');
                this.packageFolder = configuration.get('packageFolder');
                this.cacheProvider = configuration.get('cacheProvider') || configuration.get('hibernateCache') || 'no';
                this.enableHibernateCache = configuration.get('enableHibernateCache') && !['no', 'memcached'].includes(this.cacheProvider);
                this.databaseType = configuration.get('databaseType');
                this.prodDatabaseType = configuration.get('prodDatabaseType');
                this.searchEngine = configuration.get('searchEngine');
                this.angularAppName = this.getAngularAppName();
                this.buildTool = configuration.get('buildTool');
                this.applicationType = configuration.get('applicationType');
                this.reactive = configuration.get('reactive') || false;
                this.serviceDiscoveryType = configuration.get('serviceDiscoveryType');
                this.authenticationType = configuration.get('authenticationType');
                this.herokuAppName = configuration.get('herokuAppName');
                this.dynoSize = 'Free';
                this.herokuDeployType = configuration.get('herokuDeployType');
                this.herokuJavaVersion = configuration.get('herokuJavaVersion');
                this.useOkta = configuration.get('useOkta');
                this.oktaAdminLogin = configuration.get('oktaAdminLogin');
                this.oktaAdminPassword = configuration.get('oktaAdminPassword');
            },
        }
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

                this.template('application-heroku.yml.ejs', `${constants.SERVER_MAIN_RES_DIR}/application-heroku.yml`);
                this.template('Procfile.ejs', 'Procfile');
                this.template('system.properties.ejs', 'system.properties');
                this.template('SSLEnforcingHostResolver.java.ejs', `${SERVER_MAIN_SRC_DIR}${this.packageFolder}/config/SSLEnforcingHostResolver.java`)
                if (this.buildTool === 'gradle') {
                    this.template('heroku.gradle.ejs', 'gradle/heroku.gradle');
                }
                if (this.useOkta) {
                    this.template('provision-okta-addon.sh.ejs', 'provision-okta-addon.sh');
                    fs.appendFile('.gitignore', 'provision-okta-addon.sh', 'utf8', (err, data) => {
                        this.log(`${chalk.yellow.bold('WARNING!')}Failed to add 'provision-okta-addon.sh' to .gitignore.'`);
                    });
                }

                done();
            },
            addHerokuDependencies() {
                // Nothing to do here right now
            },
        };
        return Object.assign(phaseFromJHipster, jhipsterMicronautDefaultPhaseSteps);
    }

    get end() {
        return super._end();
    }
};
