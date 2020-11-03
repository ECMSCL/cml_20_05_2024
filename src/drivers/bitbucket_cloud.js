const fetch = require('node-fetch');
const FormData = require('form-data');
const { URL, URLSearchParams } = require('url');

const { fetch_upload_data } = require('../utils');

class BitBucketCloud {
  constructor(opts = {}) {
    const { repo, token } = opts;

    if (!token) throw new Error('token not found');
    if (!repo) throw new Error('repo not found');

    this.token = token;
    this.repo = repo;

    const { protocol, host, pathname } = new URL(this.repo);
    this.repo_origin = `${protocol}//${host}`;
    this.api = 'https://api.bitbucket.org/2.0';
    this.project_path = encodeURIComponent(pathname.substring(1));
  }

  async comment_create(opts = {}) {
    const { project_path } = this;
    const { commit_sha, report} = opts;

    // Print some variables
    console.log(project_path);
    console.log(commit_sha);

    const endpoint = `/repositories/${username}/${project_path}/commit/${commit_sha}/comments/`;
    const body = new URLSearchParams();
    body.append('note', report);

    const output = await this.request({ endpoint, method: 'POST', body });

    return output;
  }

  async check_create() {
    throw new Error('BitBucket Cloud does not support check!');
  }

  async upload(opts = {}) {
    throw new Error('BitBucket Cloud does not support upload!');
  }

  async runner_token() {
    throw new Error('BitBucket Cloud does not support runner_token!');
  }

  async register_runner(opts = {}) {
    throw new Error('BitBucket does not support register_runner!');
  }

  async unregister_runner(opts = {}) {
    throw new Error('BitBucket does not support unregister_runner!');
  }

  async runner_by_name(opts = {}) {
    throw new Error('BitBucket does not support runner_by_name!');
  }

  async request(opts = {}) {
    const { token, api } = this;
    const { endpoint, method = 'GET', body } = opts;

    if (!endpoint) throw new Error('BitBucket API endpoint not found');

    const headers = { 'PRIVATE-TOKEN': token, Accept: 'application/json' };
    const url = `${api}${endpoint}`;
    const response = await fetch(url, { method, headers, body });

    if (response.status > 300) throw new Error(response.statusText);

    return await response.json();
  }
}

module.exports = BitBucketCloud;
