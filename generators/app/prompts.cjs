/**
 * Copyright 2019-2021 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see https://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const chalk = require('chalk');

module.exports = {
  askForApplicationType,
  askForTestOpts,
};

function askForApplicationType(meta) {
  if (!meta && this.existingProject) return;

  const DEFAULT_APPTYPE = 'monolith';

  const applicationTypeChoices = [
    {
      value: DEFAULT_APPTYPE,
      name: 'Monolithic application (recommended for simple projects)',
    },
    {
      value: 'microservice',
      name: 'Microservice application',
    },
  ];

  const PROMPT = {
    type: 'list',
    name: 'applicationType',
    message: `Which ${chalk.yellow('*type*')} of application would you like to create?`,
    choices: applicationTypeChoices,
    default: DEFAULT_APPTYPE,
  };

  if (meta) return PROMPT; // eslint-disable-line consistent-return

  const done = this.async();

  this.prompt(PROMPT).then(prompt => {
    this.applicationType = this.configOptions.applicationType = prompt.applicationType;
    done();
  });
}

function askForTestOpts(meta) {
  if (!meta && this.existingProject) return;

  const choices = [];
  const defaultChoice = [];

  if (meta || !this.skipClient) {
    // all client side test frameworks should be added here
    choices.push({ name: 'Protractor', value: 'protractor' });
  } else {
    return;
  }

  const PROMPT = {
    type: 'checkbox',
    name: 'testFrameworks',
    message: 'Besides JUnit and Jest, which testing frameworks would you like to use?',
    choices,
    default: defaultChoice,
  };

  if (meta) return PROMPT; // eslint-disable-line consistent-return

  const done = this.async();

  this.prompt(PROMPT).then(prompt => {
    this.testFrameworks = prompt.testFrameworks;
    done();
  });
}
