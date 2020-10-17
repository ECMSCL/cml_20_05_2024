#!/usr/bin/env node

const print = console.log;
console.log = console.error;

const fs = require('fs').promises;
const pipe_args = require('../src/pipe-args');
const yargs = require('yargs');

const CML = require('../src/cml');

const run = async (opts) => {
  const { data, file, 'gitlab-uploads': gitlab_uploads } = opts;

  const path = opts._[0];
  let buffer;
  if (data) buffer = Buffer.from(data, 'binary');

  const cml = new CML(opts);
  const output = await cml.publish({ buffer, path, gitlab_uploads, ...opts });

  if (!file) print(output);
  else await fs.writeFile(file, output);
};

pipe_args.load('binary');
const data = pipe_args.piped_arg();
const argv = yargs
  .usage(`Usage: $0 <path to file>`)
  .describe('md', 'Output in markdown format [title || name](url).')
  .boolean('md')
  .describe('md', 'Output in markdown format [title || name](url).')
  .default('title')
  .describe('title', 'Markdown title [title](url) or ![](url title).')
  .alias('title', 't')
  .boolean('gitlab-uploads')
  .describe(
    'gitlab-uploads',
    'Uses GitLab uploads instead of CML storage. Use GitLab uploads to get around CML size limitations for hosting artifacts persistently. Only available for GitLab CI.'
  )
  .default('file')
  .describe(
    'file',
    'Append the output to the given file. Create it if does not exist.'
  )
  .alias('file', 'f')
  .default('repo')
  .describe(
    'repo',
    'Specifies the repo to be used. If not specified is extracted from the CI ENV.'
  )
  .default('token')
  .describe(
    'token',
    'Personal access token to be used. If not specified in extracted from ENV repo_token or GITLAB_TOKEN.'
  )
  .help('h')
  .demand(data ? 0 : 1).argv;

run({ ...argv, data }).catch((e) => {
  console.error(e);
  process.exit(1);
});
