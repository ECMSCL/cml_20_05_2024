jest.setTimeout(200000);

const fs = require('fs');
const { exec } = require('../src/utils');

describe('CML e2e', () => {
  test('cml-publish -h', async () => {
    const output = await exec(`echo none | node ./bin/cml-publish.js -h`);

    expect(output).toMatchInlineSnapshot();
  });

  test('cml-publish assets/logo.png --md', async () => {
    const output = await exec(
      `echo none | node ./bin/cml-publish.js assets/logo.png --md`
    );

    expect(output.startsWith('![](')).toBe(true);
  });

  test('cml-publish assets/logo.png', async () => {
    const output = await exec(
      `echo none | node ./bin/cml-publish.js assets/logo.png`
    );

    expect(output.startsWith('https://')).toBe(true);
  });

  test('cml-publish assets/logo.pdf --md', async () => {
    const title = 'this is awesome';
    const output = await exec(
      `echo none | node ./bin/cml-publish.js assets/logo.pdf --md --title '${title}'`
    );

    expect(output.startsWith(`[${title}](`)).toBe(true);
  });

  test('cml-publish assets/logo.pdf', async () => {
    const output = await exec(
      `echo none | node ./bin/cml-publish.js assets/logo.pdf`
    );

    expect(output.startsWith('https://')).toBe(true);
  });

  test('cml-publish assets/test.svg --md', async () => {
    const title = 'this is awesome';
    const output = await exec(
      `echo none | node ./bin/cml-publish.js assets/test.svg --md --title '${title}'`
    );

    expect(output.startsWith('![](') && output.endsWith(`${title}")`)).toBe(
      true
    );
  });

  test('cml-publish assets/test.svg', async () => {
    const output = await exec(
      `echo none | node ./bin/cml-publish.js assets/test.svg`
    );

    expect(output.startsWith('https://')).toBe(true);
  });

  test('cml-publish assets/logo.pdf to file', async () => {
    const file = `cml-publish-test.md`;

    await exec(
      `echo none | node ./bin/cml-publish.js assets/logo.pdf --file ${file}`
    );

    expect(fs.existsSync(file)).toBe(true);
    await fs.promises.unlink(file);
  });

  test('cml-publish assets/vega-lite.json', async () => {
    const output = await exec(
      `echo none | node ./bin/cml-publish.js --mime-type=application/json assets/vega-lite.json`
    );

    expect(output.startsWith('https://')).toBe(true);
    expect(output.endsWith('json')).toBe(true);
  });

  test('cml-publish assets/test.svg in Gitlab storage', async () => {
    const { TEST_GITLAB_REPO: repo, TEST_GITLAB_TOKEN: token } = process.env;

    const output = await exec(
      `echo none | node ./bin/cml-publish.js --repo=${repo} --token=${token} --gitlab-uploads assets/test.svg`
    );

    expect(output.startsWith('https://')).toBe(true);
  });

  test('cml-publish /nonexistent produces file error', async () => {
    await expect(
      exec('echo none | node ./bin/cml-publish.js /nonexistent')
    ).rejects.toThrowError('ENOENT: no such file or directory, stat');
  });

  test('echo invalid | cml-publish produces buffer mime type error', async () => {
    await expect(
      exec(`echo invalid | node ./bin/cml-publish.js`)
    ).rejects.toThrowError('Failed guessing mime type of buffer');
  });
});
