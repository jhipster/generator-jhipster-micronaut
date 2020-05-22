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

const chalk = require('chalk');

const { getBase64Secret, getRandomHex } = require('generator-jhipster/generators/utils');
const { logger } = require('generator-jhipster/cli/utils');

module.exports = {
    askForModuleName,
    askForServerSideOpts,
    askFori18n,
};

function askForModuleName() {
    if (this.baseName) return;

    this.askModuleName(this);
}

function askForServerSideOpts(meta) {
    if (!meta && this.existingProject) return;

    const applicationType = this.applicationType;

    const dbOptions = [
        {
            value: 'mysql',
            name: 'MySQL',
        },
        {
            value: 'postgresql',
            name: 'PostgreSQL',
        },
    ];

    if (applicationType !== 'monolith') {
        logger.error('Application should be only monolith for this blueprint');
        return;
    }

    const reactive = this.reactive;
    let defaultPort = applicationType === 'gateway' ? '8080' : '8081';
    if (applicationType === 'uaa') {
        defaultPort = '9999';
    }
    const prompts = [
        {
            when: response => applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa',
            type: 'input',
            name: 'serverPort',
            validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
            message:
                'As you are running in a microservice architecture, on which port would like your server to run? It should be unique to avoid port conflicts.',
            default: defaultPort,
        },
        {
            type: 'input',
            name: 'packageName',
            validate: input =>
                /^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/.test(input)
                    ? true
                    : 'The package name you have provided is not a valid Java package name.',
            message: 'What is your default Java package name?',
            default: 'com.mycompany.myapp',
            store: true,
        },
        // TODO enable it when we allow other apps than monoliths
        // {
        //     when: response => applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa',
        //     type: 'list',
        //     name: 'serviceDiscoveryType',
        //     message: 'Which service discovery server do you want to use?',
        //     choices: [
        //         {
        //             value: 'eureka',
        //             name: 'JHipster Registry (uses Eureka, provides Spring Cloud Config support and monitoring dashboards)'
        //         },
        //         {
        //             value: 'consul',
        //             name: 'Consul'
        //         },
        //         {
        //             value: false,
        //             name: 'No service discovery'
        //         }
        //     ],
        //     default: 'eureka'
        // },
        // {
        //     when: applicationType === 'monolith',
        //     type: 'list',
        //     name: 'serviceDiscoveryType',
        //     message: 'Do you want to use the JHipster Registry to configure, monitor and scale your application?',
        //     choices: [
        //         {
        //             value: false,
        //             name: 'No'
        //         },
        //         {
        //             value: 'eureka',
        //             name: 'Yes'
        //         }
        //     ],
        //     default: false
        // },
        {
            when: response =>
                (applicationType === 'monolith' && response.serviceDiscoveryType !== 'eureka') ||
                ['gateway', 'microservice'].includes(applicationType),
            type: 'list',
            name: 'authenticationType',
            message: `Which ${chalk.yellow('*type*')} of authentication would you like to use?`,
            choices: response => {
                const opts = [
                    {
                        value: 'jwt',
                        name: 'JWT authentication (stateless, with a token)',
                    },
                ];
                if (!reactive) {
                    opts.push({
                        value: 'oauth2',
                        name: 'OAuth 2.0 / OIDC Authentication (stateful, works with Keycloak and Okta)',
                    });
                    if (['gateway', 'microservice'].includes(applicationType)) {
                        opts.push({
                            value: 'uaa',
                            name: 'Authentication with JHipster UAA server (the server must be generated separately)',
                        });
                    }
                }
                return opts;
            },
            default: 0,
        },
        {
            when: response =>
                (applicationType === 'gateway' || applicationType === 'microservice') && response.authenticationType === 'uaa',
            type: 'input',
            name: 'uaaBaseName',
            message: 'What is the folder path of your UAA application?',
            default: '../uaa',
            validate: input => {
                const uaaAppData = this.getUaaAppName(input);

                if (uaaAppData && uaaAppData.baseName && uaaAppData.applicationType === 'uaa') {
                    return true;
                }
                return `Could not find a valid JHipster UAA server in path "${input}"`;
            },
        },
        {
            type: 'list',
            name: 'databaseType',
            message: `Which ${chalk.yellow('*type*')} of database would you like to use?`,
            choices: response => {
                const opts = [];
                if (!reactive) {
                    opts.push({
                        value: 'sql',
                        name: 'SQL (H2, MySQL, PostgreSQL)',
                    });
                }
                // TODO enable when we support these things
                // opts.push({
                //     value: 'mongodb',
                //     name: 'MongoDB'
                // });
                // if (response.authenticationType !== 'oauth2') {
                //     opts.push({
                //         value: 'cassandra',
                //         name: 'Cassandra'
                //     });
                // }
                // opts.push({
                //     value: 'couchbase',
                //     name: 'Couchbase'
                // });
                // if (!reactive) {
                //     opts.push({
                //         value: 'no',
                //         name: 'No database'
                //     });
                // }
                return opts;
            },
            default: 0,
        },
        {
            when: response => response.databaseType === 'sql',
            type: 'list',
            name: 'prodDatabaseType',
            message: `Which ${chalk.yellow('*production*')} database would you like to use?`,
            choices: dbOptions,
            default: 0,
        },
        {
            when: response => response.databaseType === 'sql',
            type: 'list',
            name: 'devDatabaseType',
            message: `Which ${chalk.yellow('*development*')} database would you like to use?`,
            choices: response =>
                [
                    {
                        value: 'h2Disk',
                        name: 'H2 with disk-based persistence',
                    },
                    {
                        value: 'h2Memory',
                        name: 'H2 with in-memory persistence',
                    },
                ].concat(dbOptions.find(it => it.value === response.prodDatabaseType)),
            default: 0,
        },
        {
            when: () => !reactive,
            type: 'list',
            name: 'cacheProvider',
            message: "Do you want to use Micronaut's cache abstraction?",
            choices: [
                {
                    value: 'ehcache',
                    name: 'Yes, with the Ehcache implementation (local cache, for a single node)',
                },
                {
                    value: 'no',
                    name: 'No - Warning, when using an SQL database, this will disable the Hibernate 2nd level cache!',
                },
            ],
            default: applicationType === 'microservice' || applicationType === 'uaa' ? 1 : 0,
        },
        {
            when: response =>
                ((response.cacheProvider !== 'no' && response.cacheProvider !== 'memcached') || applicationType === 'gateway') &&
                response.databaseType === 'sql',
            type: 'confirm',
            name: 'enableHibernateCache',
            message: 'Do you want to use Hibernate 2nd level cache?',
            default: true,
        },
        {
            type: 'list',
            name: 'buildTool',
            message: 'Would you like to use Maven or Gradle for building the backend?',
            choices: [
                {
                    value: 'maven',
                    name: 'Maven',
                },
                {
                    value: 'gradle',
                    name: 'Gradle',
                },
            ],
            default: 'maven',
        },
    ];

    if (meta) return prompts; // eslint-disable-line consistent-return

    const done = this.async();

    this.prompt(prompts).then(props => {
        this.serviceDiscoveryType = props.serviceDiscoveryType;
        this.authenticationType = props.authenticationType;

        // JWT authentication is mandatory with Eureka, so the JHipster Registry
        // can control the applications
        if (this.serviceDiscoveryType === 'eureka' && this.authenticationType !== 'uaa' && this.authenticationType !== 'oauth2') {
            this.authenticationType = 'jwt';
        }

        if (this.authenticationType === 'session') {
            this.rememberMeKey = getRandomHex();
        }

        if (this.authenticationType === 'jwt' || this.applicationType === 'microservice' || this.authenticationType === 'oauth2') {
            this.jwtSecretKey = getBase64Secret(null, 64);
        }

        // user-management will be handled by UAA app, oauth expects users to be managed in IpP
        if ((this.applicationType === 'gateway' && this.authenticationType === 'uaa') || this.authenticationType === 'oauth2') {
            this.skipUserManagement = true;
        }

        if (this.applicationType === 'uaa') {
            this.authenticationType = 'uaa';
        }

        this.packageName = props.packageName;
        this.serverPort = props.serverPort;
        if (this.serverPort === undefined) {
            this.serverPort = '8080';
        }
        this.cacheProvider = !reactive ? props.cacheProvider : 'no';
        this.enableHibernateCache = props.enableHibernateCache;
        this.databaseType = props.databaseType;
        this.devDatabaseType = props.devDatabaseType;
        this.prodDatabaseType = props.prodDatabaseType;
        this.searchEngine = props.searchEngine;
        this.buildTool = props.buildTool;
        this.uaaBaseName = this.getUaaAppName(props.uaaBaseName).baseName;

        if (this.databaseType === 'no') {
            this.devDatabaseType = 'no';
            this.prodDatabaseType = 'no';
            this.enableHibernateCache = false;
            if (this.authenticationType !== 'uaa') {
                this.skipUserManagement = true;
            }
        } else if (this.databaseType === 'mongodb') {
            this.devDatabaseType = 'mongodb';
            this.prodDatabaseType = 'mongodb';
            this.enableHibernateCache = false;
        } else if (this.databaseType === 'couchbase') {
            this.devDatabaseType = 'couchbase';
            this.prodDatabaseType = 'couchbase';
            this.enableHibernateCache = false;
        } else if (this.databaseType === 'cassandra') {
            this.devDatabaseType = 'cassandra';
            this.prodDatabaseType = 'cassandra';
            this.enableHibernateCache = false;
        }
        done();
    });
}

function askFori18n() {
    if (this.existingProject || this.configOptions.skipI18nQuestion) return;

    this.aski18n(this);
}
