#!/usr/bin/env node

import { runJHipster, done, logger } from 'generator-jhipster/cli';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, basename } from 'path';
import { getLogo } from './logo.mjs';

// Get package name to use as namespace.
// Allows blueprints to be aliased.
const packagePath = dirname(dirname(fileURLToPath(import.meta.url)));
const packageFolderName = basename(packagePath);

(async () => {
  const { version, bin } = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  const executableName = Object.keys(bin)[0];

  runJHipster({
    executableName,
    executableVersion: version,
    defaultCommand: 'app',
    blueprints: {
      [packageFolderName]: version,
    },
    printLogo: () => {},
    printBlueprintLogo: () => {
      console.log(getLogo());
    },
    lookups: [{ packagePaths: [packagePath], lookups: ['generators'] }],
  }).catch(done);
})();

process.on('unhandledRejection', up => {
  logger.error('Unhandled promise rejection at:');
  logger.fatal(up);
});
