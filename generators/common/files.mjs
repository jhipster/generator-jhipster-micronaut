const commonFiles = {
  global: [
    {
      templates: [
        'README.md',
        {
          file: 'gitignore',
          renameTo: () => '.gitignore',
        },
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
