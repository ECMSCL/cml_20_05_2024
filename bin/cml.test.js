const { exec } = require('../src/utils');

describe('command-line interface tests', () => {
  test('cml --help', async () => {
    const output = await exec(`node ./bin/cml.js --help`);

    expect(output).toMatchInlineSnapshot(`
      "cml.js <command>

      Commands:
        cml.js ci                                 Fixes specific CI setups
        cml.js pr <glob path...>                  Create a pull request with the
                                                  specified files
        cml.js rerun-workflow                     Reruns a workflow given the jobId or
                                                  workflow Id
        cml.js runner                             Launch and register a self-hosted
                                                  runner
        cml.js send-comment <markdown file>       Comment on a commit
        cml.js send-github-check <markdown file>  Create a check report
        cml.js tensorboard-dev                    Get a tensorboard link

      Options:
        --help     Show help                                                 [boolean]
        --version  Show version number                                       [boolean]
        --log      Maximum log level
                [string] [choices: \\"error\\", \\"warn\\", \\"info\\", \\"debug\\"] [default: \\"info\\"]
        --driver   Platform where the repository is hosted. If not specified, it will
                   be inferred from the environment
                                   [string] [choices: \\"github\\", \\"gitlab\\", \\"bitbucket\\"]
        --repo     Repository to be used for registering the runner. If not specified,
                   it will be inferred from the environment                   [string]
        --token    Personal access token to register a self-hosted runner on the
                   repository. If not specified, it will be inferred from the
                   environment                                                [string]"
    `);
  });
});
