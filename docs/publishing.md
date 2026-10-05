# Publishing to the VS Code Marketplace

Releases are published by the **Release** workflow when a `vX.Y.Z` tag is pushed. It always creates a GitHub Release with the `.vsix`. It also publishes to the VS Code Marketplace and Open VSX when their tokens are saved as repository secrets.

## One-time setup

### 1. Create the publisher

1. Sign in at <https://marketplace.visualstudio.com/manage> with a Microsoft account.
2. Click **Create publisher** and choose an **ID** (for example `class-plugin`). The ID is permanent and becomes part of the extension ID (`<publisher>.sphynx`).
3. The `publisher` field in `package.json` must be exactly this ID.

### 2. Create a Personal Access Token (PAT)

1. Go to <https://dev.azure.com>, sign in with the same account, and create an organization if you don't have one (any name).
2. Open **User settings → Personal access tokens → New Token**:
   - **Organization**: *All accessible organizations*
   - **Expiration**: up to 1 year (put a reminder to renew it)
   - **Scopes**: *Custom defined* → **Marketplace → Manage**
3. Copy the token. It is shown only once.

### 3. Save the token in GitHub

In the repository: **Settings → Secrets and variables → Actions → New repository secret**

- Name: `VSCE_PAT`
- Value: the token

### 4. (Optional) Open VSX

[Open VSX](https://open-vsx.org) is the extension registry used by VSCodium, Cursor, Gitpod and other VS Code–based editors.

1. Sign in at <https://open-vsx.org> with GitHub and sign the publisher agreement in your profile.
2. Create an access token in **Settings → Access Tokens**.
3. Create the namespace once, from a terminal: `npx ovsx create-namespace <publisher> -p <token>`
4. Save the token as the repository secret `OVSX_PAT`.

## Releasing

Same flow as always: a `chore(release): vX.Y.Z` PR (bump `package.json`, date the CHANGELOG), merge it, then push the tag:

```bash
git checkout main && git pull
git tag vX.Y.Z && git push origin vX.Y.Z
```

The Release workflow validates the content, builds the `.vsix`, creates the GitHub Release and publishes it. The Marketplace usually shows a new version a few minutes later.

## Notes

- The Marketplace rejects a version that was already published, so every publish needs a new version number.
- If the token expires, the publish step fails while the GitHub Release is still created. Renew the token, update the secret, and publish that `.vsix` by hand: `npx vsce publish --packagePath sphynx-X.Y.Z.vsix -p <token>`.
- Students who installed a `.vsix` with a different publisher ID have a different extension ID, so VS Code treats the Marketplace version as a new extension (their progress doesn't carry over). Uninstall the old one to avoid having both.
