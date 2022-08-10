const kebabcaseKeys = require('kebabcase-keys');

exports.command = 'rerun-workflow';
exports.description = 'Reruns a workflow given the jobId or workflow Id';

const { repoOptions } = require('../../src/cml');

exports.handler = async (opts) => {
  const { cml, telemetryEvent: event } = opts;
  await cml.pipelineRerun(opts);
  await cml.telemetrySend({ event });
};

exports.builder = (yargs) =>
  yargs.env('CML_CI').options(
    kebabcaseKeys({
      ...repoOptions,
      id: {
        type: 'string',
        description: 'Specifies the run Id to be rerun.'
      }
    })
  );
