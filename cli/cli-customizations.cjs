// This file will not be overwritten by generate-blueprint
module.exports = {
  printBlueprintLogo: undefined,
  printLogo: async () => {
    const { getLogo } = await import('./logo.js');
    console.log(getLogo());
  },
};
