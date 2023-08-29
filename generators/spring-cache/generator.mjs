import SpringCacheGenerator from 'generator-jhipster/generators/spring-cache';
import {
  moveToJavaEntityPackageSrcDir,
  moveToJavaEntityPackageTestDir,
  moveToJavaPackageSrcDir,
  moveToJavaPackageTestDir,
  replaceEntityFilePathVariables,
} from 'generator-jhipster/generators/server/support';

/* Constants use throughout */
import {
  JAVA_MAIN_SOURCES_DIR as SERVER_MAIN_SRC_DIR,
  JAVA_MAIN_RESOURCES_DIR as SERVER_MAIN_RES_DIR,
  JAVA_TEST_SOURCES_DIR as SERVER_TEST_SRC_DIR,
  JAVA_SERVER_TEST_RESOURCES_DIR as SERVER_TEST_RES_DIR,
  JAVA_DOCKER_DIR as DOCKER_DIR
} from 'generator-jhipster';

export default class extends SpringCacheGenerator {c
  constructor(args, opts, features) {
    super(args, opts, { ...features, checkBlueprint: true });
  }

  get [SpringCacheGenerator.PREPARING]() {
    return this.asPreparingTaskGroup({
      ...super.preparing,
      async preparingTemplateTask() {},
    });
  }

  get [SpringCacheGenerator.WRITING]() {
    return this.asWritingTaskGroup({
      ...super.writing,
      async writingTemplateTask({ application }) {
        await this.writeFiles({
          sections: {
            files: [
              {
                path: `${SERVER_MAIN_SRC_DIR}package/`,
                renameTo: moveToJavaPackageSrcDir,
                templates: ['config/CacheConfiguration.java'],
              },
            ],
          },
          context: application,
        });
      },
    });
  }

  get [SpringCacheGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      ...super.postWriting,
      async postWritingTemplateTask() {},
    });
  }
}
