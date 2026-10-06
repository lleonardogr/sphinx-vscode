# Publishing to the VS Code Marketplace

Releases are published by the **Release** workflow when a `vX.Y.Z` tag is pushed. It always creates a GitHub Release with the `.vsix`. It also publishes to the VS Code Marketplace and Open VSX when their tokens are saved as repository secrets.

## One-time setup

### 1. Create the publisher

1. Sign in at <https://marketplace.visualstudio.com/manage> with a Microsoft account.
2. Click **Create publisher** and choose an **ID** (Sphinx uses `lleonardogr`). The ID is permanent and becomes part of the extension ID (`<publisher>.sphinx`).
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

### 4. Open VSX (Cursor, VSCodium, Windsurf, Gitpod)

[Open VSX](https://open-vsx.org) is the extension registry used by Cursor and other VS Code–based editors.

1. Sign in at <https://open-vsx.org> with GitHub.
2. In your profile (**Settings**), log in with an **Eclipse Foundation** account (create one if needed; use the same email as your GitHub account) and sign the **Publisher Agreement**.
3. In **Settings → Access Tokens**, generate a token and copy it.
4. Create the namespace once (it must match the `publisher` in `package.json`):

   ```bash
   npx ovsx create-namespace lleonardogr -p <token>
   ```

5. Save the token as the repository secret `OVSX_PAT` (`gh secret set OVSX_PAT`).

New namespaces show as *unverified* on Open VSX. To get the verified badge, open an issue at <https://github.com/EclipseFdn/open-vsx.org/issues> asking to claim the `lleonardogr` namespace.

## Releasing

Same flow as always: a `chore(release): vX.Y.Z` PR (bump `package.json`, date the CHANGELOG), merge it, then push the tag:

```bash
git checkout main && git pull
git tag vX.Y.Z && git push origin vX.Y.Z
```

The Release workflow validates the content, builds the `.vsix`, creates the GitHub Release and publishes it. The Marketplace usually shows a new version a few minutes later.

## Notes

- A version can be published only once. Both publish steps use `--skip-duplicate`, so re-running a release skips a registry that already has that version and publishes to the others.
- If the publish step fails (for example, the token expired), the GitHub Release is still created. Fix the cause (renew the token and update the secret), then re-run the failed workflow: it keeps the existing release and publishes again. You can also publish that `.vsix` by hand: `npx vsce publish --packagePath sphynx-X.Y.Z.vsix`.
- Students who installed a `.vsix` with a different publisher ID have a different extension ID, so VS Code treats the Marketplace version as a new extension (their progress doesn't carry over). Uninstall the old one to avoid having both.
