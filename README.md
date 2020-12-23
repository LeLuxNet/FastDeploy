# FastDeploy

## Deploy a GitHub repository

### Access

The first step is to make sure the account whose private token is set as the `token` in `config.json` has access to the repository.

For personal repositories just add his as a contributor. Make sure you accepted the invite.

For organisations add him as a member.

### Webhook

Now open the repo settings. Then go to `Settings` > `Webhooks` > `Add webhook`.

Insert the FastDeploy API Endpoint + `/webhook` in the `Payload URL` field. This is in our case `https://api.lelux.net/fastdeploy/webhook`.

Now select `application/json` in the `Content Type` dropdown menu.

The secret you have to insert in the `Secret` field has to match the `secret` field in the `config.json` file. This value may be given to you by the server administrator.

After selecting `Send me everything.` and making sure the checkbox near `Active` is checked you can finally add the webhook.
