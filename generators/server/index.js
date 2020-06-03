/**
 * Copyright 2013-2020 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* eslint-disable consistent-return */
const chalk = require('chalk');
const os = require('os');
const ServerGenerator = require('generator-jhipster/generators/server');
const constants = require('generator-jhipster/generators/generator-constants');
const { getBase64Secret } = require('generator-jhipster/generators/utils');
const writeFiles = require('./files').writeFiles;
const prompts = require('./prompts');
const MN_CONSTANTS = require('../constants');

module.exports = class extends ServerGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprint micronaut')}`);
        }

        this.configOptions = jhContext.configOptions || {};

        // Add custom options for the CLI here, For example
        // this.option('skip-ktlint-format', {
        //     desc: 'Indicates to skip formatting using ktlint',
        //     type: Boolean,
        //     defaults: false
        // });

        // This sets up options for this sub generator and is being reused from JHipster
        jhContext.setupServerOptions(this, jhContext);
    }

    get initializing() {
        const initFromSuper = super._initializing();
        return {
            ...initFromSuper,
            setupMnConstants() {
                this.MN_CONSTANTS = MN_CONSTANTS;
            },
        };
    }

    get prompting() {
        // Overriding this phase to limit what's supported as we continue to add supported options
        return {
            askForModuleName: prompts.askForModuleName,
            askForServerSideOpts: prompts.askForServerSideOpts,
            askFori18n: prompts.askFori18n,

            setSharedConfigOptions() {
                this.configOptions.packageName = this.packageName;
                this.configOptions.cacheProvider = this.cacheProvider;
                this.configOptions.enableHibernateCache = this.enableHibernateCache;
                this.configOptions.websocket = this.websocket;
                this.configOptions.databaseType = this.databaseType;
                this.configOptions.devDatabaseType = this.devDatabaseType;
                this.configOptions.prodDatabaseType = this.prodDatabaseType;
                this.configOptions.searchEngine = this.searchEngine;
                this.configOptions.messageBroker = this.messageBroker;
                this.configOptions.serviceDiscoveryType = this.serviceDiscoveryType;
                this.configOptions.buildTool = this.buildTool;
                this.configOptions.enableSwaggerCodegen = this.enableSwaggerCodegen;
                this.configOptions.authenticationType = this.authenticationType;
                const uaaBaseName = this.uaaBaseName;
                if (uaaBaseName) {
                    this.configOptions.uaaBaseName = this.uaaBaseName;
                }
                this.configOptions.serverPort = this.serverPort;

                // Make dist dir available in templates
                this.BUILD_DIR = this.getBuildDirectoryForBuildTool(this.buildTool);
                this.CLIENT_DIST_DIR = this.getResourceBuildDirectoryForBuildTool(this.configOptions.buildTool) + constants.CLIENT_DIST_DIR;
            },
        };
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get default() {
        const defaultFromSuper = super._default();

        return {
            ...defaultFromSuper,
            verifyJwtConfig() {
                if (
                    (!this.jwtSecretKey && !this.configOptions.jwtSecretKey && this.authenticationType === 'jwt') ||
                    this.authenticationType === 'oauth2'
                ) {
                    this.jwtSecretKey = getBase64Secret(null, 64);
                }
            },
        };
    }

    get writing() {
        // Overriding the JHipster file generation with the custom Micronaut server.
        return writeFiles();
    }

    /* get install() {
        Add any necessary installation steps here.
    } */

    get end() {
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
                    chalk.green(
                        `Run your ${chalk.blue.bold('Micronaut')} application:\n ${chalk.yellow.bold(`./${executable}`)}${logMsgComment}`
                    )
                );
            },
        };
    }
};
