import BaseGenerator from 'generator-jhipster/generators/base';

export default class LanguagesGenerator extends BaseGenerator {
  constructor(args, opts, features) {
    super(args, opts, features);
  }

  async configuring() {
    await this.dependsOnJHipster('languages');
  }

  async writing() {
    const { language } = this.jhipsterConfig;
    if (language === 'kotlin') {
      this.log('Configuring Kotlin language support');
    }
  }
}
