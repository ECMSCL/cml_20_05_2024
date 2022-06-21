const { exec } = require('../../src/utils');

describe('CML e2e', () => {
  test('cml-ci --help', async () => {
    const output = await exec(
      `echo none | node ./bin/cml.js rerun-workflow --help`
    );

    expect(output).toMatchInlineSnapshot(`
      "cml.js rerun-workflow

      Reruns a workflow given the jobId or workflow Id

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
                   environment                                                [string]
        --id       Specifies the run Id to be rerun.                          [string]"
    `);
  });
});
