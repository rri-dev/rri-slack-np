# rri-slack-np

Toolset for interacting with Slack.

# Quick Start

1) Install - `npm i rri-slack-np`
2) Add ENV Vars:
```shell
SLACK_BOT_TOKEN=foobar
SLACK_CHANNEL=foobar
```

# Usage

```javascript
import { SlackService } from 'rri-slack-np';
const svc = new SlackService();
svc.sendMessage(`new message at ${new Date().toISOString()}`);
```

# TODO: Migrate / consolidate slack code in other apps to this repo/package.

# Release Notes

<details>
   <summary>
      Release notes - current
   </summary>
   <a href="/release_notes/2025_06_04.md">2025-06-04</a> - Implement Slack Service as NPM Package<br />
</details>

---

# Notes about Developing the Package

## 1) Develop the Package

### Write Code, Install Node Modules

> npm i

### Build a Dist

> npm run build

The package will need a `dist/index.js` file that includes whatever it exports. If you run `npm run build` it will compile the ts files into js files and output them into `dist`. When you create the NPM package, those files are included by default. You can specify additional files to be included by adding a `files` string array to `package.json`:
```json
"files": [
    "dist",
    "src/templates",
    "postinstall.js"
],
```

## 2) Test Installing in Another Project

### Create a Tarball

> npm pack

### Install Tarball in Another Project

> npm install /path/to/package.tgz

## 3) Publish to NPM

```shell
npm version patch
npm publish
```

If you just want to update the existing version published to NPM, use `npm version patch` first, otherwise you will be required to bump the version.

## 4) Publish to Github

### Security
For public packages, ensure that the branches are protected from unwanted pushes.

### Link Github Repo and NPM Package

* in `package.json` add a `repository` field:
```json
"repository": {
    "type": "git",
    "url": "https://github.com/rri-dev/rri-slack-np.git"
  },
```