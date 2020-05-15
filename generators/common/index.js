/* eslint-disable consistent-return */
const _ = require('lodash');
const chalk = require('chalk');
const CommonGenerator = require('generator-jhipster/generators/common');
const writeFiles = require('./files').writeFiles;

module.exports = class extends CommonGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
        }

        this.configOptions = jhContext.configOptions || {};
        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupServerOptions(this, jhContext);
        jhContext.setupClientOptions(this, jhContext);
    }

    get configuring() {
        const phaseFromJHipster = super._configuring();
        const jhipsterMicronautConfigPhaseSteps = {
            configureGlobal() {
                // Application name modified, using each technology's conventions
                this.dasherizedBaseName = _.kebabCase(this.baseName);
            }
        };
        return Object.assign(phaseFromJHipster, jhipsterMicronautConfigPhaseSteps);
    }

    get initializing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        const phaseFromJHipster = super._writing();
        const jhipsterMicronautWritingPhaseSteps = writeFiles();
        return Object.assign(phaseFromJHipster, jhipsterMicronautWritingPhaseSteps);
    }
};
