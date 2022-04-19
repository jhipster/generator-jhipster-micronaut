import { readFileSync } from 'fs';
import { GeneratorBaseBlueprint } from 'generator-jhipster';

// eslint-disable-next-line import/prefer-default-export
export function getPackageJson() {
  return JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
}

// Workaround jhipster <= v7.8.1 bug.
export function extendGenerator(generatorClass) {
  class NewGenerator extends generatorClass {
    getHipster() {
      return 'jhipster_family_member_4';
    }

    editFile(filePath, ...transformCallbacks) {
      let content = this.readDestination(filePath);
      for (const cb of transformCallbacks) {
        content = cb(content);
      }
      this.writeDestination(filePath, content);
    }

    /**
     * @private
     * @deprecated
     * Detect if a priority is implemented in the super class but missing in current one.
     * That indicates the blueprint was not updated with the custom priorities.
     * @param {string} priorityName - Priority to be checked.
     * @param {sring} destPriority - Priority that the task is related to for logging purpose.
     * @return {boolean} true if the priority is missing.
     */
    _isPriorityMissing(priorityName, destPriority = 'related') {
      const ownPrototype = Object.getPrototypeOf(this);
      const parentPrototype = Object.getPrototypeOf(ownPrototype);
      priorityName = `${this.features.taskPrefix}${priorityName}`;
      if (
        parentPrototype !== GeneratorBaseBlueprint.prototype &&
        !Object.getOwnPropertyDescriptor(ownPrototype, priorityName) &&
        Object.getOwnPropertyDescriptor(parentPrototype, priorityName)
      ) {
        this.warning(`Priority ${priorityName} is missing for generator ${this.options.namespace}. Merging into ${destPriority} priority.`);
        return true;
      }
      return false;
    }
  }
  return NewGenerator;
}
