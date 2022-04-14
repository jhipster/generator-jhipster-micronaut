import chalk from 'chalk';
import EntityServerGenerator from 'generator-jhipster/esm/generators/entity-server';
import {
  PRIORITY_PREFIX,
  INITIALIZING_PRIORITY,
  PROMPTING_PRIORITY,
  CONFIGURING_PRIORITY,
  COMPOSING_PRIORITY,
  LOADING_PRIORITY,
  PREPARING_PRIORITY,
  PREPARING_FIELDS_PRIORITY,
  PREPARING_RELATIONSHIPS_PRIORITY,
  DEFAULT_PRIORITY,
  WRITING_PRIORITY,
  POST_WRITING_PRIORITY,
  INSTALL_PRIORITY,
  END_PRIORITY,
} from 'generator-jhipster/esm/priorities';
import { writeFiles } from './files.cjs';
import { extendGenerator } from '#lib/utils.mjs';

import NeedleServerChacheMn from './needle-server-cache-mn.cjs';

export default class extends extendGenerator(EntityServerGenerator) {
  constructor(args, opts, features) {
    super(args, opts, { taskPrefix: PRIORITY_PREFIX, priorityArgs: true, ...features });

    if (this.options.help) return;

    if (!this.options.jhipsterContext) {
      throw new Error(`This is a JHipster blueprint and should be used only like ${chalk.yellow('jhipster --blueprints micronaut')}`);
    }
  }

  get [INITIALIZING_PRIORITY]() {
    return {
      ...super._initializing(),
    };
  }

  get [PROMPTING_PRIORITY]() {
    return {
      ...super._prompting(),
    };
  }

  get [CONFIGURING_PRIORITY]() {
    return {
      ...super._configuring(),
    };
  }

  get [COMPOSING_PRIORITY]() {
    return {
      ...super._composing(),
    };
  }

  get [LOADING_PRIORITY]() {
    return {
      ...super._loading(),
    };
  }

  get [PREPARING_PRIORITY]() {
    return {
      ...super._preparing(),
    };
  }

  get [PREPARING_FIELDS_PRIORITY]() {
    return {
      ...super._preparingFields(),
    };
  }

  get [PREPARING_RELATIONSHIPS_PRIORITY]() {
    return {
      ...super._preparingRelationships(),
    };
  }

  get [DEFAULT_PRIORITY]() {
    return {
      ...super._default(),
    };
  }

  get [WRITING_PRIORITY]() {
    const { writeEnumFiles } = super._writing();
    return {
      ...writeFiles(),
      writeEnumFiles,
    };
  }

  get [POST_WRITING_PRIORITY]() {
    return {
      ...super._postWriting(),

      // Override jhipster customizeFiles
      customizeFiles({ application: { cacheProvider, enableHibernateCache } }) {
        if (!enableHibernateCache || !cacheProvider) return;
        const serverCacheMn = new NeedleServerChacheMn(this);
        if (['ehcache', 'caffeine', 'infinispan', 'redis'].includes(cacheProvider)) {
          serverCacheMn.addEntityToCache(this.persistClass, this.relationships, this.packageName, this.packageFolder, this.cacheProvider);
        }
      },

      customizeMapstruct() {
        if (this.dto !== 'mapstruct') return;

        this.editFile(
          `src/main/java/${this.entityAbsoluteFolder}/service/dto/${this.restClass}.java`,
          content =>
            content.replace(
              'import java.io.Serializable;',
              `import io.micronaut.core.annotation.Introspected;
import java.io.Serializable;`
            ),
          content =>
            content.replace(
              '\npublic class',
              `
@Introspected
public class`
            )
        );

        const hasUserRelationship = this.relationships.find(({ otherEntity }) => otherEntity === this.user);
        let replacement = 'componentModel = "jsr330"';
        if (hasUserRelationship) {
          replacement += ', uses = UserMapper.class';
        }

        this.editFile(`src/main/java/${this.entityAbsoluteFolder}/service/mapper/${this.entityClass}Mapper.java`, content =>
          content.replace('componentModel = "spring"', replacement)
        );
      },
    };
  }

  get [INSTALL_PRIORITY]() {
    return {
      ...super._install(),
    };
  }

  get [END_PRIORITY]() {
    return {
      ...super._end(),
    };
  }
}
