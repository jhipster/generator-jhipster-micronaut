/**
 * Copyright 2019-2023 the original author or authors from the JHipster project.
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
module.exports = {
  askForApplicationType,
};

async function askForApplicationType() {
  if (this.existingProject) return;

  const { default: chalk } = await import('chalk');

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

  await this.prompt(PROMPT, this.config);
}
