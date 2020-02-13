const { CLIEngine } = require('eslint')

const cli = new CLIEngine({})

module.exports = {
    '**/*.js': files => 'npm run lint ' + files.filter(file => !cli.isPathIgnored(file)).join(' '),
    "*.{md,yaml,yml}": files => 'prettier --write ' + files
}