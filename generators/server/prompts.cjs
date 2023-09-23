/**
 * Copyright 2019-2023 the original author or authors from the JHipster project.
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

module.exports = {
  askForModuleName,
  askForServerSideOpts,
};

async function askForModuleName() {
  if (this.jhipsterConfig.baseName) return undefined;

  return this.askModuleName(this);
}

async function askForServerSideOpts() {
  if (this.existingProject) return;

  const { applicationType, reactive } = this.jhipsterConfig;

  const dbOptions = [
    {
      value: 'mysql',
      name: 'MySQL',
    },
    {
      value: 'postgresql',
      name: 'PostgreSQL',
    },
    {
      value: 'mariadb',
      name: 'MariaDB',
    },
  ];

  const prompts = [
    {
      when: () => applicationType === 'gateway' || applicationType === 'microservice',
      type: 'input',
      name: 'serverPort',
      validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
      message:
        'As you are running in a microservice architecture, on which port would like your server to run? It should be unique to avoid port conflicts.',
      default: applicationType === 'gateway' ? '8080' : '8081',
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
    {
      when: () => applicationType === 'gateway' || applicationType === 'microservice' || applicationType === 'uaa',
      type: 'list',
      name: 'serviceDiscoveryType',
      message: 'Which service discovery server do you want to use?',
      choices: [
        {
          value: 'eureka',
          name: 'JHipster Registry (uses Eureka, provides Spring Cloud Config support and monitoring dashboards)',
        },
        {
          value: 'consul',
          name: 'Consul',
        },
        {
          value: false,
          name: 'No service discovery',
        },
      ],
      default: 'eureka',
    },
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
      when: answers =>
        (applicationType === 'monolith' && answers.serviceDiscoveryType !== 'eureka') ||
        ['gateway', 'microservice'].includes(applicationType),
      type: 'list',
      name: 'authenticationType',
      message: `Which ${chalk.yellow('*type*')} of authentication would you like to use?`,
      choices: () => {
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
          // FIXME: UAA is not yet supported
          // if (['gateway', 'microservice'].includes(applicationType)) {
          //     opts.push({
          //         value: 'uaa',
          //         name: 'Authentication with JHipster UAA server (the server must be generated separately)',
          //     });
          // }
        }
        return opts;
      },
      default: 0,
    },
    {
      type: 'list',
      name: 'databaseType',
      message: `Which ${chalk.yellow('*type*')} of database would you like to use?`,
      choices: () => {
        const opts = [];
        if (!reactive) {
          opts.push({
            value: 'sql',
            name: 'SQL (H2, MySQL, MariaDB, PostgreSQL)',
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
      when: answers => answers.databaseTypeSql,
      type: 'list',
      name: 'prodDatabaseType',
      message: `Which ${chalk.yellow('*production*')} database would you like to use?`,
      choices: dbOptions,
      default: 0,
    },
    {
      when: answers => answers.databaseTypeSql,
      type: 'list',
      name: 'devDatabaseType',
      message: `Which ${chalk.yellow('*development*')} database would you like to use?`,
      choices: answers =>
        [
          {
            value: 'h2Disk',
            name: 'H2 with disk-based persistence',
          },
          {
            value: 'h2Memory',
            name: 'H2 with in-memory persistence',
          },
        ].concat(dbOptions.find(it => it.value === answers.prodDatabaseType)),
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
          value: 'caffeine',
          name: 'Yes, with the Caffeine implementation (local cache, for a single node)',
        },
        {
          value: 'redis',
          name: 'Yes, with the Redis implementation',
        },
        {
          value: 'no',
          name: 'No - Warning, when using an SQL database, this will disable the Hibernate 2nd level cache!',
        },
      ],
      default: applicationType === 'microservice' ? 2 : 0,
    },
    {
      when: answers =>
        ((answers.cacheProvider !== 'no' && answers.cacheProvider !== 'memcached') || applicationType === 'gateway') &&
        answers.databaseTypeSql,
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

  await this.prompt(prompts, this.config);
}
