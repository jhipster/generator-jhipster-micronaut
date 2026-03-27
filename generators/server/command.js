import { asCommand } from 'generator-jhipster';
import { command as serverCommand } from 'generator-jhipster/generators/server';

export default asCommand({
  configs: {
    // Gateway is not supported
    /*
    applicationType: {
      ...applicationType,
      choices: applicationType.choices.filter(({ value }) => value !== 'gateway'),
    },
    */
    ...serverCommand.configs,
  },
  override: true,
  import: ['jhipster-micronaut:micronaut'],
  compose: ['jhipster-micronaut:micronaut'],
});
