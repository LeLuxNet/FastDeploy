# FastDeploy

## Deploy a GitHub repository

### Access

The first step is to make sure the account whose private token is set as the `token` in the `config.json` has access to the repository.

For personal repositories just add him as a contributor. Make sure you accepted the invite.

For organisations add him as a member.

### Webhook

Now open the repository settings. Then go to `Settings` > `Webhooks` > `Add webhook`.

Insert the FastDeploy API Endpoint + `/webhook` in the `Payload URL` field. This is in our case `https://api.lelux.net/fastdeploy/webhook`.

Select `application/json` in the `Content Type` dropdown menu.

Insert the `secre` from the `config.json` into the `Secret` field. This value may be given to you by the server administrator.

Select `Send me everything.`.

Make sure the checkbox near `Active` is checked.

Click `Add webhook`.
