const github = require('@actions/github');

const { strip_last_chars } = require('./utils');

const GITHUB_HOST = 'https://github.com/';
const CHECK_TITLE = 'CML Report';

const owner_repo = (opts) => {
  let owner, repo;
  const { uri } = opts;

  if (uri) {
    const { pathname } = new URL(uri);
    [owner, repo] = pathname.substr(1).split('/');
  }

  const { GITHUB_REPOSITORY } = process.env;
  if (GITHUB_REPOSITORY) {
    [owner, repo] = GITHUB_REPOSITORY.split('/');
  }

  return { owner, repo };
};

const octokit = (token) => {
  if (!token) throw new Error('token not found');

  return github.getOctokit(token);
};

class GithubClient {
  constructor(opts = {}) {
    const { repo = this.env_repo(), token = this.env_token() } = opts;

    if (!repo) throw new Error('repo not found');

    this.repo = repo.endsWith('/') ? strip_last_chars(repo, 1) : repo;
    this.token = token;
  }

  env_repo() {
    const { GITHUB_REPOSITORY } = process.env;
    if (GITHUB_REPOSITORY) return `${GITHUB_HOST}${GITHUB_REPOSITORY}`;
  }

  env_token() {
    const { repo_token, GITHUB_TOKEN } = process.env;
    return repo_token || GITHUB_TOKEN;
  }

  env_is_pr() {
    try {
      return typeof github.context.payload.pull_request !== 'undefined';
    } catch (err) {
      return false;
    }
  }

  env_head_sha() {
    if (this.env_is_pr()) return github.context.payload.pull_request.head.sha;

    const { GITHUB_SHA } = process.env;
    return GITHUB_SHA;
  }

  owner_repo(opts = {}) {
    const { uri = this.repo } = opts;
    return owner_repo({ uri });
  }

  async comment_create(opts = {}) {
    const { report: body, commit_sha = this.env_head_sha() } = opts;

    const { url: commit_url } = await octokit(
      this.token
    ).repos.createCommitComment({
      ...owner_repo({ uri: this.repo }),
      body,
      commit_sha
    });

    return commit_url;
  }

  async check_create(opts = {}) {
    const {
      report,
      commit_sha: head_sha = this.env_head_sha(),
      title = CHECK_TITLE,
      name = CHECK_TITLE,
      started_at = new Date(),
      completed_at = new Date(),
      conclusion = 'success',
      status = 'completed'
    } = opts;

    return await octokit(this.token).checks.create({
      ...owner_repo({ uri: this.repo }),
      head_sha,
      started_at,
      completed_at,
      conclusion,
      status,
      name,
      output: { title, summary: report }
    });
  }

  async publish() {
    throw new Error('Github does not support publish!');
  }

  async runner_token() {
    const { owner, repo } = owner_repo({ uri: this.repo });
    const { actions } = octokit(this.token);

    if (typeof repo !== 'undefined') {
      const {
        data: { token }
      } = await actions.createRegistrationTokenForRepo({
        owner,
        repo
      });

      return token;
    }

    const {
      data: { token }
    } = await actions.createRegistrationTokenForOrg({
      org: owner
    });

    return token;
  }
}

module.exports = GithubClient;
