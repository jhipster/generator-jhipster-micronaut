/**
 * Copyright 2019-2024 the original author or authors from the JHipster project.
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
import { javaMainPackageTemplatesBlock, javaTestPackageTemplatesBlock } from 'generator-jhipster/generators/java/support';

const TEST_DIR = 'src/test/';

/**
 * The default is to use a file path string. It implies use of the template method.
 * For any other config an object { file:.., method:.., template:.. } can be used
 */
export const entityFiles = {
  domain: [
    javaMainPackageTemplatesBlock({
      condition: data => !data.reactive && data.databaseTypeSql && data.prodDatabaseTypePostgresql && data.anyFieldHasTextContentType,
      relativePath: '_entityPackage_/',
      templates: ['domain/_persistClass_.java.jhi.micronaut'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.databaseTypeSql && !generator.reactive,
      relativePath: '_entityPackage_/',
      templates: ['domain/_persistClass_.java.jhi.jakarta_persistence'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.databaseTypeSql && !generator.reactive && generator.enableHibernateCache,
      relativePath: '_entityPackage_/',
      templates: ['domain/_persistClass_.java.jhi.hibernate_cache'],
    }),
  ],
  rest: [
    javaMainPackageTemplatesBlock({
      relativePath: '_entityPackage_/',
      templates: ['repository/_entityClass_Repository.java', 'web/rest/_entityClass_Resource.java'],
    }),
    javaTestPackageTemplatesBlock({
      // TODO: add test for reactive
      condition: generator => !generator.reactive,
      relativePath: '_entityPackage_/',
      templates: ['web/rest/_entityClass_ResourceIT.java'],
    }),
  ],
  service: [
    javaMainPackageTemplatesBlock({
      condition: generator => generator.jpaMetamodelFiltering,
      relativePath: '_entityPackage_/',
      templates: ['service/dto/_entityClass_Criteria.java', 'service/_entityClass_QueryService.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.service === 'serviceImpl',
      relativePath: '_entityPackage_/',
      templates: ['service/_entityClass_Service.java', 'service/impl/_entityClass_ServiceImpl.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.service === 'serviceClass',
      relativePath: '_entityPackage_/',
      renameTo: (_ctx, file) => file.replace('Impl.java', '.java').replace('/impl/', '/'),
      templates: ['service/impl/_entityClass_ServiceImpl.java'],
    }),
  ],
  repository: [
    javaMainPackageTemplatesBlock({
      condition: generator => generator.searchEngine === 'elasticsearch',
      relativePath: '_entityPackage_/',
      templates: ['repository/search/_entityClass_SearchRepository.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => generator.searchEngine === 'elasticsearch',
      relativePath: '_entityPackage_/',
      templates: ['repository/search/_entityClass_SearchRepositoryMockConfiguration.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.reactive && ['mongodb', 'cassandra', 'couchbase'].includes(generator.databaseType),
      relativePath: '_entityPackage_/',
      templates: ['repository/reactive/_entityClass_ReactiveRepository.java'],
    }),
  ],
  mapstruct: [
    javaMainPackageTemplatesBlock({
      condition: generator => generator.dto === 'mapstruct',
      relativePath: '_entityPackage_/',
      templates: ['service/dto/_dtoClass_.java', 'service/mapper/_entityClass_Mapper.java'],
    }),
    javaMainPackageTemplatesBlock({
      condition: generator => generator.dto === 'mapstruct',
      relativePath: '_entityPackage_/',
      templates: ['service/mapper/EntityMapper.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => generator.dto === 'mapstruct',
      relativePath: '_entityPackage_/',
      templates: ['service/dto/_dtoClass_Test.java'],
    }),
    javaTestPackageTemplatesBlock({
      condition: generator => generator.dto === 'mapstruct',
      relativePath: '_entityPackage_/',
      templates: ['service/mapper/_entityClass_MapperTest.java'],
    }),
  ],
  gatling: [
    {
      condition: generator => generator.gatlingTests,
      path: TEST_DIR,
      relativePath: '_entityPackage_/',
      templates: ['gatling/user-files/simulations/_entityClass_GatlingTest.scala'],
    },
  ],
};
