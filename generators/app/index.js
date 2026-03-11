const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting() {
    return this.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Which language would you like to use?',
        choices: ['Java', 'Kotlin'],
        default: 'Java'
      }
    ]).then(props => {
      this.props = props;
    });
  }

  writing() {
    this.config.set('language', this.props.language);
    
    if (this.props.language === 'kotlin') {
      this.fs.copyTpl(
        this.templatePath('src/main/kotlin/package/Application.kt.ejs'),
        this.destinationPath('src/main/kotlin/' + this.config.get('packageName').replace(/\./g, '/') + '/Application.kt'),
        { packageName: this.config.get('packageName') }
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('src/main/java/package/Application.java.ejs'),
        this.destinationPath('src/main/java/' + this.config.get('packageName').replace(/\./g, '/') + '/Application.java'),
        { packageName: this.config.get('packageName') }
      );
    }
  }
};