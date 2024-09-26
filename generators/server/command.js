import { asCommand } from 'generator-jhipster';
import { command as serverCommand } from 'generator-jhipster/generators/server';
import { default as micronautCommand } from '../micronaut/command.js';

const { applicationType, ...remainingConfigs } = serverCommand.configs;

export default asCommand({
  options: Object.fromEntries(Object.entries(serverCommand.options).filter(([key]) => !(key in micronautCommand.configs))),
  configs: {
    // Gateway is not supported
    applicationType: {
      ...applicationType,
      choices: applicationType.choices.filter(({ value }) => value !== 'gateway'),
    },
    ...remainingConfigs,
  },
  override: true,
  import: ['jhipster-micronaut:micronaut'],
  compose: ['jhipster-micronaut:micronaut'],
});
