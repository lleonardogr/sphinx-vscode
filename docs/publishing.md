# Publishing to the VS Code Marketplace

Releases are published by the **Release** workflow when a `vX.Y.Z` tag is pushed. It always creates a GitHub Release with the `.vsix`. It also publishes to the VS Code Marketplace (signing in with Microsoft Entra ID) and to Open VSX, when their secrets are set.

## One-time setup

### 1. Create the publisher

1. Sign in at <https://marketplace.visualstudio.com/manage> with a Microsoft account.
2. Click **Create publisher** and choose an **ID** (Sphinx uses `lleonardogr`). The ID is permanent and becomes part of the extension ID (`<publisher>.sphinx`).
3. The `publisher` field in `package.json` must be exactly this ID.

### 2. Publish with Microsoft Entra ID (no token to store or renew)

The Release workflow signs in to the Marketplace as an Azure **managed identity**, through GitHub's OpenID Connect: GitHub proves to Azure that the job runs in this repository, and no secret token is stored. (Global Azure DevOps personal access tokens stop working on December 1, 2026.)

**a. Create the managed identity (Azure portal).** It needs an Azure subscription; a free one works, and a managed identity costs nothing.

1. Search for **Managed Identities** (not "Create a resource") → **+ Create**. Choose the subscription, a resource group (create one, such as `sphinx-publishing`), a region, and a name such as `sphinx-marketplace`. **Review + create** → **Create**.
2. App registrations don't work here: the Marketplace refuses them when publishing. Use a user-assigned managed identity.

**b. Trust this repository.** On the identity: **Settings → Federated credentials → + Add credential**.

- Scenario: **GitHub Actions deploying Azure resources**
- Organization: `lleonardogr`, Repository: `sphinx-vscode`
- Entity: **Environment**, name: `marketplace-publish` (the workflows use this environment)
- Name: anything, such as `release`

**c. Save its IDs in GitHub.** From the identity's **Properties** (or Overview), copy the **Client ID** and the **Tenant ID**, and save them as repository secrets:

```bash
gh secret set AZURE_CLIENT_ID    # paste the Client ID
gh secret set AZURE_TENANT_ID    # paste the Tenant ID
```

**d. Find the ID the Marketplace knows it by.** Run **Actions → Marketplace identity → Run workflow**. Its second step prints an ID (a GUID). The identity's Client ID, Object ID and resource ID are *not* recognized by the Marketplace: only this one is. The last step fails until the next step is done.

**e. Add it to the publisher.** At <https://marketplace.visualstudio.com/manage>, open the `lleonardogr` publisher → **Members** → **+ Add**, paste the ID from step d, and choose the **Contributor** role.

**f. Check.** Run **Marketplace identity** again: the last step, `vsce verify-pat … --azure-credential`, now passes. The next release publishes with Entra ID. Once one release has gone through, delete the old `VSCE_PAT` secret (`gh secret delete VSCE_PAT`) and its token in Azure DevOps.

### 3. The older way: a personal access token

Until `AZURE_CLIENT_ID` is set, the workflow falls back to a `VSCE_PAT` secret: a token from <https://dev.azure.com> (**User settings → Personal access tokens**, organization *All accessible organizations*, scope **Marketplace → Manage**). Global tokens like this one are retired on December 1, 2026, so use Entra ID instead.

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
- If the publish step fails (for example, the identity lost its publisher membership, or the Open VSX token expired), the GitHub Release is still created. Fix the cause, then re-run the failed workflow: it keeps the existing release and publishes again. You can also publish that `.vsix` by hand: `npx vsce publish --packagePath sphynx-X.Y.Z.vsix`.
- Students who installed a `.vsix` with a different publisher ID have a different extension ID, so VS Code treats the Marketplace version as a new extension (their progress doesn't carry over). Uninstall the old one to avoid having both.
