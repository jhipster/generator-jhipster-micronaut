/**
 * Copyright 2013-2019 the original author or authors from the JHipster project.
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
const mkdirp = require('mkdirp');
const cleanup = require('generator-jhipster/generators/cleanup');
const constants = require('generator-jhipster/generators/generator-constants');
const baseServerFiles = require('generator-jhipster/generators/server/files').serverFiles;

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;
const SERVER_TEST_RES_DIR = constants.SERVER_TEST_RES_DIR;

/* TODO: Do a PR in the parent JHipster project to export and re-use here as well in order to have a single source of truth!!!
const TEST_DIR = constants.TEST_DIR;
const shouldSkipUserManagement = generator =>
    generator.skipUserManagement && (generator.applicationType !== 'monolith' || generator.authenticationType !== 'oauth2');
*/

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
    ...baseServerFiles,
    serverResource: [
        {
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'banner.txt',
                    method: 'copy',
                    noEjs: true,
                    renameTo: () => 'banner.txt',
                    useBluePrint: true
                }
            ]
        },
        {
            condition: generator => generator.devDatabaseType === 'h2Disk' || generator.devDatabaseType === 'h2Memory',
            path: SERVER_MAIN_RES_DIR,
            templates: [{ file: 'h2.server.properties', renameTo: () => '.h2.server.properties' }]
        },
        {
            condition: generator => !!generator.enableSwaggerCodegen,
            path: SERVER_MAIN_RES_DIR,
            templates: ['swagger/api.yml']
        },
        {
            path: SERVER_MAIN_RES_DIR,
            templates: [
                // Thymeleaf templates
                { file: 'templates/error.html', method: 'copy' },
                'logback-spring.xml',
                'config/application.yml',
                'config/application-dev.yml',
                'config/application-tls.yml',
                'config/application-prod.yml',
                'i18n/messages.properties'
            ]
        },
        {
            condition: generator => generator.databaseType === 'sql',
            path: SERVER_MAIN_RES_DIR,
            templates: [
                {
                    file: 'config/liquibase/changelog/initial_schema.xml',
                    renameTo: () => 'config/liquibase/changelog/00000000000000_initial_schema.xml',
                    options: { interpolate: INTERPOLATE_REGEX }
                },
                'config/liquibase/master.xml'
            ]
        },
        {
            condition: generator =>
                generator.databaseType === 'mongodb' &&
                (!generator.skipUserManagement || (generator.skipUserManagement && generator.authenticationType === 'oauth2')),
            path: SERVER_MAIN_SRC_DIR,
            templates: [
                {
                    file: 'package/config/dbmigrations/InitialSetupMigration.kt',
                    renameTo: generator => `${generator.javaDir}config/dbmigrations/InitialSetupMigration.kt`,
                    useBluePrint: true
                }
            ]
        },
        {
            condition: generator => generator.databaseType === 'couchbase',
            path: SERVER_MAIN_RES_DIR,
            templates: ['config/couchmove/changelog/V0__create_indexes.n1ql']
        },
        {
            condition: generator =>
                generator.databaseType === 'couchbase' && (!generator.skipUserManagement || generator.authenticationType === 'oauth2'),
            path: SERVER_MAIN_RES_DIR,
            templates: [
                'config/couchmove/changelog/V0.1__initial_setup/ROLE_ADMIN.json',
                'config/couchmove/changelog/V0.1__initial_setup/ROLE_USER.json',
                'config/couchmove/changelog/V0.1__initial_setup/user__admin.json',
                'config/couchmove/changelog/V0.1__initial_setup/user__anonymoususer.json',
                'config/couchmove/changelog/V0.1__initial_setup/user__system.json',
                'config/couchmove/changelog/V0.1__initial_setup/user__user.json'
            ]
        },
        {
            condition: generator => generator.databaseType === 'cassandra',
            path: SERVER_MAIN_RES_DIR,
            templates: [
                'config/cql/create-keyspace-prod.cql',
                'config/cql/create-keyspace.cql',
                'config/cql/drop-keyspace.cql',
                { file: 'config/cql/changelog/README.md', method: 'copy' }
            ]
        },
        {
            condition: generator =>
                generator.databaseType === 'cassandra' &&
                generator.applicationType !== 'microservice' &&
                (!generator.skipUserManagement || generator.authenticationType === 'oauth2'),
            path: SERVER_MAIN_RES_DIR,
            templates: [
                { file: 'config/cql/changelog/create-tables.cql', renameTo: () => 'config/cql/changelog/00000000000000_create-tables.cql' },
                {
                    file: 'config/cql/changelog/insert_default_users.cql',
                    renameTo: () => 'config/cql/changelog/00000000000001_insert_default_users.cql'
                }
            ]
        }
    ]
    // TODO Add files in here
};

/* eslint-disable no-template-curly-in-string */
function writeFiles() {
    return {
        setUp() {
            this.javaDir = `${this.packageFolder}/`;
            this.testDir = `${this.packageFolder}/`;

            // Create server resource files
            mkdirp(SERVER_MAIN_RES_DIR);
            mkdirp(`${SERVER_TEST_SRC_DIR}/${this.testDir}`);
            this.generateKeyStore();
        },

        cleanupOldServerFiles() {
            cleanup.cleanupOldServerFiles(
                this,
                `${SERVER_MAIN_SRC_DIR}/${this.javaDir}`,
                `${SERVER_TEST_SRC_DIR}/${this.testDir}`,
                SERVER_MAIN_RES_DIR,
                SERVER_TEST_RES_DIR
            );
        },

        writeFiles() {
            writeFilesToDisk(serverFiles, this, false, this.fetchFromInstalledJHipster('server/templates'));
        },

        modifyFiles() {
            if (this.buildTool === 'gradle') {
                // Add Gradle dependencies here
            }

            if (this.buildTool === 'maven') {
                // Add Maven dependencies here
            }
        }
    };
}

/**
 * write the given files using provided config.
 *
 * @param {object} files - files to write
 * @param {object} generator - the generator instance to use
 * @param {boolean} returnFiles - weather to return the generated file list or to write them
 * @param {string} prefix - prefix to add in the path
 */
function writeFilesToDisk(files, generator, returnFiles, prefix) {
    const _this = generator || this;
    const filesOut = [];
    const startTime = new Date();
    // using the fastest method for iterations
    for (let i = 0, blocks = Object.keys(files); i < blocks.length; i++) {
        for (let j = 0, blockTemplates = files[blocks[i]]; j < blockTemplates.length; j++) {
            const blockTemplate = blockTemplates[j];
            if (!blockTemplate.condition || blockTemplate.condition(_this)) {
                const path = blockTemplate.path || '';
                blockTemplate.templates.forEach(templateObj => {
                    let templatePath = path;
                    let method = 'template';
                    let useTemplate = false;
                    let options = {};
                    let templatePathTo;
                    if (typeof templateObj === 'string') {
                        templatePath += templateObj;
                    } else {
                        if (typeof templateObj.file === 'string') {
                            templatePath += templateObj.file;
                        } else if (typeof templateObj.file === 'function') {
                            templatePath += templateObj.file(_this);
                        }
                        method = templateObj.method ? templateObj.method : method;
                        useTemplate = templateObj.template ? templateObj.template : useTemplate;
                        options = templateObj.options ? templateObj.options : options;
                    }
                    if (templateObj && templateObj.renameTo) {
                        templatePathTo = path + templateObj.renameTo(_this);
                    } else {
                        // remove the .ejs suffix
                        templatePathTo = templatePath.replace('.ejs', '');
                    }
                    filesOut.push(templatePathTo);
                    if (!returnFiles) {
                        let templatePathFrom = prefix ? `${prefix}/${templatePath}` : templatePath;

                        if (templateObj.useBluePrint) {
                            templatePathFrom = templatePath;
                        }
                        if (
                            !templateObj.noEjs &&
                            !templatePathFrom.endsWith('.png') &&
                            !templatePathFrom.endsWith('.jpg') &&
                            !templatePathFrom.endsWith('.gif') &&
                            !templatePathFrom.endsWith('.svg') &&
                            !templatePathFrom.endsWith('.ico')
                        ) {
                            templatePathFrom = `${templatePathFrom}.ejs`;
                        }
                        // if (method === 'template')
                        _this[method](templatePathFrom, templatePathTo, _this, options, useTemplate);
                    }
                });
            }
        }
    }
    _this.debug(`Time taken to write files: ${new Date() - startTime}ms`);
    return filesOut;
}

module.exports = {
    writeFiles,
    writeFilesToDisk,
    serverFiles
};
