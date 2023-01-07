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
const chalk = require('chalk');
const fs = require('fs');
const utils = require('generator-jhipster/generators/utils');
const {
  INTERPOLATE_REGEX,
  SERVER_MAIN_SRC_DIR,
  TEST_DIR,
  SERVER_TEST_SRC_DIR,
} = require('generator-jhipster/generators/generator-constants');

/* Use customized randexp */
const randexp = utils.RandexpWithFaker;

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
const serverFiles = {
  domain: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/Entity.java.jhi',
          renameTo: generator => `${generator.entityAbsoluteFolder}/domain/${generator.persistClass}.java.jhi`,
        },
        {
          file: 'package/domain/Entity.java.jhi.javax_validation',
          renameTo: generator => `${generator.entityAbsoluteFolder}/domain/${generator.persistClass}.java.jhi.javax_validation`,
        },
      ],
    },
    {
      condition: generator => generator.databaseTypeSql && !generator.reactive,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/Entity.java.jhi.javax_persistence',
          renameTo: generator => `${generator.entityAbsoluteFolder}/domain/${generator.persistClass}.java.jhi.javax_persistence`,
        },
      ],
    },
    {
      condition: generator => generator.databaseTypeSql && !generator.reactive && generator.enableHibernateCache,
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/domain/Entity.java.jhi.hibernate_cache',
          renameTo: generator => `${generator.entityAbsoluteFolder}/domain/${generator.persistClass}.java.jhi.hibernate_cache`,
        },
      ],
    },
    {
      path: SERVER_TEST_SRC_DIR,
      templates: [
        {
          file: 'package/domain/EntityTest.java',
          renameTo: generator => `${generator.entityAbsoluteFolder}/domain/${generator.persistClass}Test.java`,
        },
      ],
    },
  ],
  server: [
    {
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        /*
        {
          file: 'package/domain/Entity.java',
          useBluePrint: true,
          renameTo: generator => `${generator.packageFolder}/domain/${generator.asEntity(generator.entityClass)}.java`,
        },
        */
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
  ],
  mapstruct: [
    {
      condition: generator => generator.dto === 'mapstruct',
      path: SERVER_MAIN_SRC_DIR,
      templates: [
        {
          file: 'package/service/dto/EntityDTO.java',
          renameTo: generator => `${generator.entityAbsoluteFolder}/service/dto/${generator.restClass}.java`,
        },
        {
          file: 'package/service/mapper/BaseEntityMapper.java',
          renameTo: generator => `${generator.entityAbsoluteFolder}/service/mapper/EntityMapper.java`,
        },
        {
          file: 'package/service/mapper/EntityMapper.java',
          renameTo: generator => `${generator.entityAbsoluteFolder}/service/mapper/${generator.entityClass}Mapper.java`,
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
    /*
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
    */
  ],
};

module.exports = {
  writeFiles,
  serverFiles,
};

function writeFiles() {
  return {
    setUp() {
      this.javaDir = `${this.packageFolder}/`;
      this.testDir = `${this.packageFolder}/`;
    },
    saveRemoteEntityPath() {
      if (this.microservicePath === undefined) {
        return;
      }
      this.copy(
        `${this.microservicePath}/${this.jhipsterConfigDirectory}/${this.entityNameCapitalized}.json`,
        this.destinationPath(`${this.jhipsterConfigDirectory}/${this.entityNameCapitalized}.json`)
      );
    },

    async writeMicronautServerFiles({ application: { reactive } }) {
      if (this.skipServer) return;

      const rootTemplatesPath = reactive ? ['reactive', ''] : undefined;
      this.writeFiles({
        sections: serverFiles,
        context: this,
        rootTemplatesPath,
      });
    },
  };
}
