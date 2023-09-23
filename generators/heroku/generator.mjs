import HerokuGenerator from 'generator-jhipster/generators/heroku';

export default class extends HerokuGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      sbsBlueprint: true,
      checkBlueprint: true,
      // Dropped it once migration is done.
      jhipster7Migration: true,
    });
  }

  get [HerokuGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {},
    });
  }
}
