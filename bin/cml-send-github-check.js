#!/usr/bin/env node

console.log = console.error;

const fs = require('fs').promises;
const yargs = require('yargs');

const {
  head_sha: HEAD_SHA,
  handle_error,
  create_check_report,
  CHECK_TITLE
} = process.env.GITHUB_ACTIONS
  ? require('../src/github')
  : require('../src/gitlab');

const run = async (opts) => {
  const { 'head-sha': head_sha = HEAD_SHA, conclusion, title } = opts;
  const path = opts._[0];
  const report = await fs.readFile(path, 'utf-8');

  await create_check_report({ head_sha, report, conclusion, title });
};

const argv = yargs
  .usage(`Usage: $0 <path> --head-sha <string>`)
  .default('head-sha')
  .default('conclusion', 'success')
  .choices('conclusion', [
    'success',
    'failure',
    'neutral',
    'cancelled',
    'skipped',
    'timed_out'
  ])
  .default('title', CHECK_TITLE)
  .describe('head-sha', 'Commit sha')
  .help('h')
  .demand(1).argv;
run(argv).catch((e) => handle_error(e));
