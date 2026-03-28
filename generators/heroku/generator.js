import HerokuGenerator from 'generator-jhipster/generators/heroku';

export default class extends HerokuGenerator {
  constructor(args, opts, features) {
    super(args, opts, {
      ...features,
      sbsBlueprint: true,
      checkBlueprint: true,
    });
  }

  get [HerokuGenerator.INITIALIZING]() {
    return this.asInitializingTaskGroup({
      async initializingTemplateTask() {},
    });
  }
}
