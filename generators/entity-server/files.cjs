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
const _ = require('lodash');
const chalk = require('chalk');
const faker = require('faker');
const fs = require('fs');
const utils = require('generator-jhipster/generators/utils');
const constants = require('generator-jhipster/generators/generator-constants');

const NeedleServerChacheMn = require('./needle-server-cache-mn');

/* Use customized randexp */
const randexp = utils.RandexpWithFaker;

/* Constants use throughout */
const INTERPOLATE_REGEX = constants.INTERPOLATE_REGEX;
const SERVER_MAIN_SRC_DIR = constants.SERVER_MAIN_SRC_DIR;
const SERVER_MAIN_RES_DIR = constants.SERVER_MAIN_RES_DIR;
const TEST_DIR = constants.TEST_DIR;
const SERVER_TEST_SRC_DIR = constants.SERVER_TEST_SRC_DIR;

/*
 * Current faker version is 4.1.0 and was release in 2017
 * It is outdated
 * https://github.com/Marak/faker.js/blob/10bfb9f467b0ac2b8912ffc15690b50ef3244f09/lib/date.js#L73-L96
 * Needed for reproducible builds
 */
const getRecentDate = function (days, refDate) {
  let date = new Date();
  if (refDate !== undefined) {
    date = new Date(Date.parse(refDate));
  }

  const range = {
    min: 1000,
    max: (days || 1) * 24 * 3600 * 1000,
  };

  let future = date.getTime();
  future -= faker.random.number(range); // some time from now to N days ago, in milliseconds
  date.setTime(future);

  return date;
};

const getRecentForLiquibase = function (days, changelogDate) {
  let formatedDate;
  if (changelogDate !== undefined) {
    formatedDate = `${changelogDate.substring(0, 4)}-${changelogDate.substring(4, 6)}-${changelogDate.substring(
      6,
      8
    )}T${changelogDate.substring(8, 10)}:${changelogDate.substring(10, 12)}:${changelogDate.substring(12, 14)}+00:00`;
  }
  return getRecentDate(1, formatedDate);
};

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
  dbChangelog: [
    {
      condition: generator => generator.databaseType === 'sql' && !generator.skipDbChangelog,
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'config/liquibase/changelog/added_entity.xml',
          options: { interpolate: INTERPOLATE_REGEX },
          useBluePrint: true,
          renameTo: generator => `config/liquibase/changelog/${generator.changelogDate}_added_entity_${generator.entityClass}.xml`,
        },
      ],
    },
    {
      condition: generator =>
        generator.databaseType === 'sql' &&
        !generator.skipDbChangelog &&
        (generator.fieldsContainOwnerManyToMany || generator.fieldsContainOwnerOneToOne || generator.fieldsContainManyToOne),
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'config/liquibase/changelog/added_entity_constraints.xml',
          options: { interpolate: INTERPOLATE_REGEX },
          useBluePrint: true,
          renameTo: generator =>
            `config/liquibase/changelog/${generator.changelogDate}_added_entity_constraints_${generator.entityClass}.xml`,
        },
      ],
    },
    {
      condition: generator => generator.databaseType === 'cassandra' && !generator.skipDbChangelog,
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'config/cql/changelog/added_entity.cql',
          useBluePrint: true,
          renameTo: generator => `config/cql/changelog/${generator.changelogDate}_added_entity_${generator.entityClass}.cql`,
        },
      ],
    },
  ],
  fakeData: [
    {
      condition: generator => generator.databaseType === 'sql' && !generator.skipFakeData && !generator.skipDbChangelog,
      path: SERVER_MAIN_RES_DIR,
      templates: [
        {
          file: 'config/liquibase/fake-data/table.csv',
          useBluePrint: true,
          options: {
            interpolate: INTERPOLATE_REGEX,
            context: {
              getRecentForLiquibase,
              faker,
              randexp,
            },
          },
          renameTo: generator => `config/liquibase/fake-data/${generator.entityTableName}.csv`,
        },
      ],
    },
    {
      condition: generator =>
        generator.databaseType === 'sql' &&
        !generator.skipFakeData &&
        !generator.skipDbChangelog &&
        (generator.fieldsContainImageBlob === true || generator.fieldsContainBlob === true),
      path: SERVER_MAIN_RES_DIR,
      templates: [{ file: 'config/liquibase/fake-data/blob/hipster.png', method: 'copy', useBluePrint: true, noEjs: true }],
    },
    {
      condition: generator =>
        generator.databaseType === 'sql' &&
        !generator.skipFakeData &&
        !generator.skipDbChangelog &&
        generator.fieldsContainTextBlob === true,
      path: SERVER_MAIN_RES_DIR,
      templates: [{ file: 'config/liquibase/fake-data/blob/hipster.txt', useBluePrint: true, method: 'copy' }],
    },
  ],
  server: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/Entity.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/domain/${generator.asEntity(generator.entityClass)}.java`,
        },
        {
          file: 'package/repository/EntityRepository.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/repository/${generator.entityClass}Repository.java`,
        },
        {
          file: 'package/web/rest/EntityResource.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/web/rest/${generator.entityClass}Resource.java`,
        },
      ],
    },
    {
      condition: generator => generator.jpaMetamodelFiltering,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/EntityCriteria.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/dto/${generator.entityClass}Criteria.java`,
        },
        {
          file: 'package/service/EntityQueryService.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/${generator.entityClass}QueryService.java`,
        },
      ],
    },
    {
      condition: generator => generator.searchEngine === 'elasticsearch',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/repository/search/EntitySearchRepository.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/repository/search/${generator.entityClass}SearchRepository.java`,
        },
      ],
    },
    {
      condition: generator => generator.reactive && ['mongodb', 'cassandra', 'couchbase'].includes(generator.databaseType),
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/repository/reactive/EntityReactiveRepository.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/repository/reactive/${generator.entityClass}ReactiveRepository.java`,
        },
      ],
    },
    {
      condition: generator => generator.service === 'serviceImpl',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/EntityService.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/${generator.entityClass}Service.java`,
        },
        {
          file: 'package/service/impl/EntityServiceImpl.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/impl/${generator.entityClass}ServiceImpl.java`,
        },
      ],
    },
    {
      condition: generator => generator.service === 'serviceClass',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/impl/EntityServiceImpl.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/${generator.entityClass}Service.java`,
        },
      ],
    },
    {
      condition: generator => generator.dto === 'mapstruct',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/EntityDTO.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/dto/${generator.asDto(generator.entityClass)}.java`,
        },
        {
          file: 'package/service/mapper/BaseEntityMapper.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/mapper/EntityMapper.java`,
        },
        {
          file: 'package/service/mapper/EntityMapper.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/mapper/${generator.entityClass}Mapper.java`,
        },
      ],
    },
  ],
  test: [
    {
      // TODO: add test for reactive
      condition: generator => !generator.reactive,
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/web/rest/EntityResourceIT.java',
          options: {
            context: {
              randexp,
              _,
              chalkRed: chalk.red,
              fs,
              SERVER_TEST_SRC_DIR,
            },
          },
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/web/rest/${generator.entityClass}ResourceIT.java`,
        },
      ],
    },
    {
      condition: generator => generator.searchEngine === 'elasticsearch',
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/repository/search/EntitySearchRepositoryMockConfiguration.java',
          useBluePrint: true,
          renameTo: generator =>
            `${generator.packageFolder}/repository/search/${generator.entityClass}SearchRepositoryMockConfiguration.java`,
        },
      ],
    },
    {
      condition: generator => generator.gatlingTests,
      path: TEST_DIR,
      templates: [
        {
          file: 'gatling/user-files/simulations/EntityGatlingTest.scala',
          options: { interpolate: INTERPOLATE_REGEX },
          useBluePrint: true,
          renameTo: generator => `gatling/user-files/simulations/${generator.entityClass}GatlingTest.scala`,
        },
      ],
    },
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/domain/EntityTest.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/domain/${generator.entityClass}Test.java`,
        },
      ],
    },
    {
      condition: generator => generator.dto === 'mapstruct',
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/EntityDTOTest.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/dto/${generator.asDto(generator.entityClass)}Test.java`,
        },
      ],
    },
    {
      condition: generator =>
        generator.dto === 'mapstruct' &&
        (generator.databaseType === 'sql' || generator.databaseType === 'mongodb' || generator.databaseType === 'couchbase'),
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/service/mapper/EntityMapperTest.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/service/mapper/${generator.entityClass}MapperTest.java`,
        },
      ],
    },
  ],
};

module.exports = {
  writeFiles,
  writeFilesToDisk,
  serverFiles,
};

function writeFiles() {
  return {
    setUp() {
      this.javaDir = `${this.packageFolder}/`;
      this.testDir = `${this.packageFolder}/`;
    },
    saveRemoteEntityPath() {
      if (_.isUndefined(this.microservicePath)) {
        return;
      }
      this.copy(
        `${this.microservicePath}/${this.jhipsterConfigDirectory}/${this.entityNameCapitalized}.json`,
        this.destinationPath(`${this.jhipsterConfigDirectory}/${this.entityNameCapitalized}.json`)
      );
    },

    setupReproducibility() {
      if (this.skipServer) return;

      // In order to have consistent results with Faker, restart seed with current entity name hash.
      faker.seed(utils.stringHashCode(this.name.toLowerCase()));
    },

    writeServerFiles() {
      if (this.skipServer) return;

      // write server side files
      writeFilesToDisk(serverFiles, this, false, this.fetchFromInstalledJHipster('entity-server/templates'));

      if (this.databaseType === 'sql') {
        if (!this.skipDbChangelog) {
          if (this.fieldsContainOwnerManyToMany || this.fieldsContainOwnerOneToOne || this.fieldsContainManyToOne) {
            this.addConstraintsChangelogToLiquibase(`${this.changelogDate}_added_entity_constraints_${this.entityClass}`);
          }
          this.addChangelogToLiquibase(`${this.changelogDate}_added_entity_${this.entityClass}`);
        }

        const serverCacheMn = new NeedleServerChacheMn(this);

        if (['ehcache', 'caffeine', 'infinispan', 'redis'].includes(this.cacheProvider) && this.enableHibernateCache) {
          serverCacheMn.addEntityToCache(
            this.asEntity(this.entityClass),
            this.relationships,
            this.packageName,
            this.packageFolder,
            this.cacheProvider
          );
        }
      }
    },

    writeEnumFiles() {
      this.fields.forEach(field => {
        if (field.fieldIsEnum === true) {
          const fieldType = field.fieldType;
          const enumInfo = {
            ...utils.getEnumInfo(field, this.clientRootFolder),
            frontendAppName: this.frontendAppName,
            packageName: this.packageName,
          };
          if (!this.skipServer) {
            this.template(
              `${this.fetchFromInstalledJHipster(
                'entity-server/templates'
              )}/${SERVER_MAIN_SRC_DIR}package/domain/enumeration/Enum.java.ejs`,
              `${SERVER_MAIN_SRC_DIR}${this.packageFolder}/domain/enumeration/${fieldType}.java`,
              this,
              {},
              enumInfo
            );
          }
        }
      });
    },
  };
}

/**
 * write the given files using provided config.
 *
 * @param {object} files - files to write
 * @param {object} generator - the generator instance to use
 * @param {boolean} returnFiles - weather to return the generated file list or to write them
 * @param {string} prefix - prefix to add in the path
 */
function writeFilesToDisk(files, generator, returnFiles, prefix) {
  const _this = generator || this;
  const filesOut = [];
  const startTime = new Date();
  // using the fastest method for iterations
  for (let i = 0, blocks = Object.keys(files); i < blocks.length; i++) {
    for (let j = 0, blockTemplates = files[blocks[i]]; j < blockTemplates.length; j++) {
      const blockTemplate = blockTemplates[j];
      if (!blockTemplate.condition || blockTemplate.condition(_this)) {
        const path = blockTemplate.path || '';
        blockTemplate.templates.forEach(templateObj => {
          let templatePath = path;
          let method = 'template';
          let useTemplate = false;
          let options = {};
          let templatePathTo;
          if (typeof templateObj === 'string') {
            templatePath += templateObj;
          } else {
            if (typeof templateObj.file === 'string') {
              templatePath += templateObj.file;
            } else if (typeof templateObj.file === 'function') {
              templatePath += templateObj.file(_this);
            }
            method = templateObj.method ? templateObj.method : method;
            useTemplate = templateObj.template ? templateObj.template : useTemplate;
            options = templateObj.options ? templateObj.options : options;
          }
          if (templateObj && templateObj.renameTo) {
            templatePathTo = path + templateObj.renameTo(_this);
          } else {
            // remove the .ejs suffix
            templatePathTo = templatePath.replace('.ejs', '');
          }
          filesOut.push(templatePathTo);
          if (!returnFiles) {
            let templatePathFrom = prefix ? `${prefix}/${templatePath}` : templatePath;

            if (templateObj.useBluePrint) {
              templatePathFrom = templatePath;
            }
            if (
              !templateObj.noEjs &&
              !templatePathFrom.endsWith('.png') &&
              !templatePathFrom.endsWith('.jpg') &&
              !templatePathFrom.endsWith('.gif') &&
              !templatePathFrom.endsWith('.svg') &&
              !templatePathFrom.endsWith('.ico')
            ) {
              templatePathFrom = `${templatePathFrom}.ejs`;
            }
            // if (method === 'template')
            _this[method](templatePathFrom, templatePathTo, _this, options, useTemplate);
          }
        });
      }
    }
  }
  _this.debug(`Time taken to write files: ${new Date() - startTime}ms`);
  return filesOut;
}
