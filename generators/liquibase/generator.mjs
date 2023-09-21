import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      hibernate5() {
        this.editFile('pom.xml', content => content.replace('liquibase-hibernate6', 'liquibase-hibernate5'));
      },
    });
  }
}
