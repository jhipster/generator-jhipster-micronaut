const Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument('entityName', { type: String, required: true });
  }

  prompting() {
    const entityName = this.options.entityName;
    const language = this.config.get('language') || 'java';
    
    return this.prompt([
      {
        type: 'input',
        name: 'entityName',
        message: 'What is the entity name?',
        default: entityName
      },
      {
        type: 'input',
        name: 'fields',
        message: 'Enter field definitions (name:type, comma separated)',
        default: 'name:String'
      }
    ]).then(props => {
      this.props = props;
      this.language = language;
    });
  }

  writing() {
    const packageName = this.config.get('packageName');
    const packagePath = packageName.replace(/\./g, '/');
    const entityName = this.props.entityName;
    const fields = this.props.fields.split(',').map(f => {
      const [name, type] = f.split(':');
      return { name: name.trim(), type: type.trim() };
    });

    if (this.language === 'kotlin') {
      this.fs.copyTpl(
        this.templatePath('src/main/kotlin/package/Entity.kt.ejs'),
        this.destinationPath(`src/main/kotlin/${packagePath}/${entityName}.kt`),
        { packageName, entityName, fields }
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('src/main/java/package/Entity.java.ejs'),
        this.destinationPath(`src/main/java/${packagePath}/${entityName}.java`),
        { packageName, entityName, fields }
      );
    }
  }
};