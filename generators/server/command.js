import { command as serverCommand } from 'generator-jhipster/generators/server';

const { applicationType, ...remainingConfigs } = serverCommand.configs;

/**
 * @type {import('generator-jhipster').JHipsterCommandDefinition}
 */
const command = {
  ...serverCommand,
  configs: {
    // Gateway is not supported
    applicationType: {
      ...applicationType,
      choices: applicationType.choices.filter(({ value }) => value !== 'gateway'),
    },
    ...remainingConfigs,
  },
  override: true,
  compose: ['jhipster-micronaut:micronaut'],
};

export default command;
