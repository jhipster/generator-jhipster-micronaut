import { readFileSync } from 'fs';

// eslint-disable-next-line import/prefer-default-export
export function getPackageJson() {
  return JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
}
