const { exec, getInputArray } = require('./utils');

describe('Exec', () => {
  test('exec is await and outputs hello', async () => {
    const output = await exec('echo hello');
    expect(output).toMatch('hello');
  });

  test('Command rejects if failure', async () => {
    let error;
    try {
      await exec('this_command_fails');
    } catch (err) {
      error = err;
    }

    expect(error).not.toBeNull();
  });
});

describe('getInputArray', () => {
  test('None, comma and not existing env variable', async () => {
    process.env.DVC_TEST = 'None';
    expect(getInputArray('DVC_TEST')).toBe('None');

    process.env.DVC_TEST = 'one,two,three';
    expect(getInputArray('DVC_TEST')).toStrictEqual(['one', 'two', 'three']);

    expect(getInputArray('DVC_NOT_EXIST')).toStrictEqual([]);
    expect(getInputArray('DVC_NOT_EXIST', ['one'])).toStrictEqual(['one']);
  });
});
