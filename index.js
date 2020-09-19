const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const fs = require("fs");
const child_process = require("child_process");

const config = require("./config.json");
const { rejects } = require("assert");
const { resolve } = require("path");
const e = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  const repo = req.body.repository.full_name;
  const conf = config[repo];
  if (!conf) {
    return res.status(403).send("Repository unknown");
  }

  if (invalidSecret(conf.secret, req.get("X-Hub-Signature"), req.body)) {
    return res.status(403).send("Secret is wrong");
  }

  const event = req.get("X-GitHub-Event");

  const options = {
    headers: {
      Accept: "application/vnd.github.ant-man-preview+json",
      Authorization: "token " + conf.token,
    },
  };

  console.log(`${repo} ${event}`);

  if (event === "deployment") {
    const branch = branchByRef(req.body.deployment.ref);
    deploy(
      conf.branches[branch].path,
      repo,
      branch,
      req.body.deployment.statuses_url,
      options
    );
  } else if (event === "push") {
    const branch = branchByRef(req.body.ref);
    if (!conf.branches[branch]) {
      return res.status(200).send("Irrelevant branch");
    }

    if (!conf.branches[branch].on.includes("push")) {
      return res.status(200).send("Not listening for push on branch " + branch);
    }

    axios.post(
      req.body.repository.deployments_url,
      {
        ref: req.body.ref,
      },
      options
    );
  } else {
    return res.status(200).send("Irrelevant event");
  }

  return res.status(200).send("OK");
});

app.listen(80, () => {
  console.log("Listening");
});

function invalidSecret(secret, sig, body) {
  const hmac = crypto.createHmac("sha1", secret);
  const digest = Buffer.from(
    "sha1=" + hmac.update(JSON.stringify(body)).digest("hex"),
    "utf8"
  );
  const checksum = Buffer.from(sig, "utf8");

  return (
    checksum.length !== digest.length ||
    !crypto.timingSafeEqual(digest, checksum)
  );
}

async function deploy(path, repo, branch, url, options) {
  if (!fs.existsSync(path)) {
    await exec(
      `git clone https://github.com/${repo} ${path} && git checkout ${branch}`
    );
  }

  const err = await exec(`git pull`, {
    cwd: path,
  });

  console.log(err);
  axios.post(
    url,
    {
      state: err ? "error" : "success",
    },
    options
  );
}

function branchByRef(ref) {
  return ref.split("/")[2]; // Really bad
}

function exec(cmd, options) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, options, (err) => {
      resolve(err);
    });
  });
}
