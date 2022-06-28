const { exec } = require('../../src/utils');

describe('CML e2e', () => {
  test('cml-pr --help', async () => {
    const output = await exec(`echo none | node ./bin/cml.js pr --help`);

    expect(output).toMatchInlineSnapshot(`
      "cml.js pr <glob path...>

      Create a pull request with the specified files

      Options:
        --help                 Show help                                     [boolean]
        --version              Show version number                           [boolean]
        --log                  Maximum log level
                [string] [choices: \\"error\\", \\"warn\\", \\"info\\", \\"debug\\"] [default: \\"info\\"]
        --md                   Output in markdown format [](url).            [boolean]
        --skip-ci              Force skip CI for the created commit (if any) [boolean]
        --merge, --auto-merge  Try to merge the pull request upon creation.  [boolean]
        --rebase               Try to rebase-merge the pull request upon creation.
                                                                             [boolean]
        --squash               Try to squash-merge the pull request upon creation.
                                                                             [boolean]
        --branch               Branch name for the pull request.              [string]
        --title                Pull request title.                            [string]
        --body                 Pull request description.                      [string]
        --message              Commit message.                                [string]
        --remote               Sets git remote.           [string] [default: \\"origin\\"]
        --user-email           Sets git user email.
                                             [string] [default: \\"olivaw@iterative.ai\\"]
        --user-name            Sets git user name.   [string] [default: \\"Olivaw[bot]\\"]
        --repo                 Specifies the repo to be used. If not specified is
                               extracted from the CI ENV.                     [string]
        --token                Personal access token to be used. If not specified in
                               extracted from ENV REPO_TOKEN.                 [string]
        --driver               If not specify it infers it from the ENV.
                                   [string] [choices: \\"github\\", \\"gitlab\\", \\"bitbucket\\"]"
    `);
  });
});
