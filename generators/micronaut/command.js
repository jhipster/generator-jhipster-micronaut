import { command as SpringBootCommand } from 'generator-jhipster/generators/spring-boot';

const { syncUserWithIdp, defaultPackaging } = SpringBootCommand.configs;

/**
 * @type {import('generator-jhipster').JHipsterCommandDefinition}
 */
const command = {
  configs: { syncUserWithIdp, defaultPackaging },
};

export default command;
