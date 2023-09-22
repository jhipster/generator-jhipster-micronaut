const commonFiles = {
  global: [
    {
      templates: [
        'README.md',
      ],
    },
  ],
};

export function writeFiles() {
  return {
    overrideFiles() {
      this.writeFilesToDisk(commonFiles, this, false);
    },
  };
}
