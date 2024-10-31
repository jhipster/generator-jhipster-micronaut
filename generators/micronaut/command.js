import chalk from 'chalk';
import { asCommand } from 'generator-jhipster';
import { command as springBootCommand } from 'generator-jhipster/generators/spring-boot';

const { syncUserWithIdp, defaultPackaging } = springBootCommand.configs;

const prodDatabaseTypeChoices = [
  { value: 'postgresql', name: 'PostgreSQL' },
  { value: 'mysql', name: 'MySQL' },
  { value: 'mariadb', name: 'MariaDB' },
  { value: 'oracle', name: 'Oracle (Please follow our documentation to use the Oracle proprietary driver)' },
  { value: 'mssql', name: 'Microsoft SQL Server' },
];

const authenticationTypeChoices = [
  { value: 'jwt', name: 'JWT authentication (stateless, with a token)' },
  { value: 'oauth2', name: 'OAuth 2.0 / OIDC Authentication (stateful, works with Keycloak)' },
  { value: 'session', name: 'HTTP Session Authentication (stateful)' },
];

export const serverTestFrameworkChoices = [
  { name: 'Gatling', value: 'gatling' },
  { name: 'Cucumber', value: 'cucumber' },
];

export default asCommand({
  options: {},
  configs: {
    serverPort: {
      description: 'Server port',
      cli: {
        type: Number,
      },
      prompt: gen => ({
        when: () => ['gateway', 'microservice'].includes(gen.jhipsterConfigWithDefaults.applicationType),
        validate: input => (/^([0-9]*)$/.test(input) ? true : 'This is not a valid port number.'),
        message:
          'As you are running in a microservice architecture, on which port would like your server to run? It should be unique to avoid port conflicts.',
        default: gen.jhipsterConfigWithDefaults.serverPort,
      }),
      scope: 'storage',
    },
    serviceDiscoveryType: {
      description: 'Service discovery',
      cli: {
        type: String,
      },
      prompt: gen => ({
        when: () => ['gateway', 'microservice'].includes(gen.jhipsterConfigWithDefaults.applicationType),
        type: 'list',
        message: 'Which service discovery server do you want to use?',
        default: 'consul',
      }),
      choices: [
        { name: 'Consul (recommended)', value: 'consul' },
        { name: 'JHipster Registry (legacy, uses Eureka, provides Spring Cloud Config support)', value: 'eureka' },
        { name: 'No service discovery', value: 'no' },
      ],
      scope: 'storage',
    },
    authenticationType: {
      description: 'Authentication type',
      cli: {
        type: String,
      },
      prompt: gen => ({
        type: 'list',
        name: 'authenticationType',
        message: `Which ${chalk.yellow('*type*')} of authentication would you like to use?`,
        choices: () =>
          gen.jhipsterConfigWithDefaults.applicationType === 'monolith' ? authenticationTypeChoices : authenticationTypeChoices.slice(0, 1),
        default: 'jwt',
      }),
      choices: authenticationTypeChoices,
      scope: 'storage',
    },
    syncUserWithIdp,
    prodDatabaseType: {
      description: 'Production database',
      cli: {
        type: String,
      },
      prompt: gen => ({
        when: () => gen.jhipsterConfigWithDefaults.databaseType === 'sql',
        type: 'list',
        message: `Which ${chalk.yellow('*production*')} database would you like to use?`,
      }),
      choices: prodDatabaseTypeChoices,
      default: 'postgresql',
      scope: 'storage',
    },
    devDatabaseType: {
      description: 'Development database',
      cli: {
        type: String,
      },
      prompt: {
        type: 'list',
        message: `Which ${chalk.yellow('*development*')} database would you like to use?`,
        choices: answers => [
          ...prodDatabaseTypeChoices.filter(it => it.value === answers.prodDatabaseType),
          { value: 'h2Disk', name: 'H2 with disk-based persistence' },
          { value: 'h2Memory', name: 'H2 with in-memory persistence' },
        ],
        default: 'h2Disk',
      },
      scope: 'storage',
    },
    cacheProvider: {
      description: 'Cache provider',
      cli: {
        type: String,
      },
      prompt: gen => ({
        type: 'list',
        message: 'Which cache do you want to use?',
        default: () => gen.jhipsterConfigWithDefaults.cacheProvider,
      }),
      choices: [
        { value: 'ehcache', name: 'Ehcache (local cache, for a single node)' },
        { value: 'caffeine', name: 'Caffeine (local cache, for a single node)' },
        { value: 'hazelcast', name: 'Hazelcast (distributed cache, for multiple nodes, supports rate-limiting for gateway applications)' },
        { value: 'infinispan', name: 'Infinispan (hybrid cache, for multiple nodes)' },
        {
          value: 'memcached',
          name: 'Memcached (distributed cache) - Warning, when using an SQL database, this will disable the Hibernate 2nd level cache!',
        },
        { value: 'redis', name: 'Redis (distributed cache)' },
        { value: 'no', name: 'No cache - Warning, when using an SQL database, this will disable the Hibernate 2nd level cache!' },
      ],
      scope: 'storage',
    },
    enableHibernateCache: {
      description: 'Hibernate 2nd level cache',
      cli: {
        type: Boolean,
      },
      prompt: gen => ({
        when: answers =>
          ['ehcache', 'caffeine', 'hazelcast', 'redis'].includes(answers.cacheProvider ?? gen.jhipsterConfigWithDefaults.cacheProvider),
        type: 'confirm',
        message: 'Do you want to use Hibernate 2nd level cache?',
        default: gen.jhipsterConfigWithDefaults.enableHibernateCache,
      }),
      scope: 'storage',
    },
    serverTestFrameworks: {
      description: 'Server test frameworks',
      cli: {
        type: Array,
      },
      prompt: {
        type: 'checkbox',
        message: 'Besides Junit, which testing frameworks would you like to use?',
      },
      choices: serverTestFrameworkChoices,
      scope: 'storage',
    },
    messageBroker: {
      description: 'Message broker',
      cli: {
        type: String,
      },
      prompt: {
        type: 'list',
        message: 'Which message broker would you like to use?',
      },
      choices: [
        { value: 'no', name: 'No message broker' },
        { value: 'kafka', name: 'Apache Kafka as asynchronous messages broker' },
      ],
      scope: 'storage',
    },
    searchEngine: {
      description: 'Search engine',
      cli: {
        type: String,
      },
      prompt: {
        type: 'list',
        message: 'Which search engine would you like to use?',
      },
      choices: [
        { value: 'no', name: 'No search engine' },
        { value: 'elasticsearch', name: 'Elasticsearch' },
      ],
      scope: 'storage',
    },
    enableSwaggerCodegen: {
      description: 'API first development using OpenAPI-generator',
      cli: {
        type: Boolean,
      },
      prompt: {
        type: 'confirm',
        message: 'API first development using OpenAPI-generator',
      },
      default: false,
      scope: 'storage',
    },
    defaultPackaging,
  },
});
