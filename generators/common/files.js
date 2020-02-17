const commonFiles = {
    global: [
        {
            templates: [
                'README.md',
                {
                    file: 'gitignore',
                    renameTo: () => '.gitignore'
                }
            ]
        }
    ]
};

function writeFiles() {
    return {
        overrideFiles() {
            this.writeFilesToDisk(commonFiles, this, false);
        }
    };
}

module.exports = {
    writeFiles
};
