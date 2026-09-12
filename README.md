# Collapse Sidebar on Open

Obsidian plugin. Click a file in the File Explorer and the sidebar collapses once the file opens.

Works for any file type the vault can open, including `.html` files handled by the HTML Reader plugin, and applies to whichever sidebar the File Explorer is docked in.

## Settings

**Left sidebar** and **Right sidebar** choose which sidebars the plugin collapses. Both are on by default. Turn one off and that sidebar stays open until you close it yourself.

**Collapse below this window width** sets a pixel width, defaulting to 1400. A sidebar collapses only when the window is narrower than that. Set it to 0 to collapse at every width.

## Install with BRAT

This plugin is not in the community catalog, so install it with [BRAT](https://github.com/TfTHacker/obsidian42-brat), which installs plugins straight from GitHub releases and keeps them updated.

1. Install and enable BRAT from Obsidian's community plugins.
2. Run **BRAT: Add a beta plugin for testing** from the command palette.
3. Paste `bellicose100xp/obsidian-collapse-sidebar-on-open`.
4. Leave the version field empty to track the latest release, then select **Add plugin**.

The plugin is enabled automatically. BRAT checks for new releases each time Obsidian starts; **BRAT: Check for updates to all beta plugins and UPDATE** does it on demand.

As a shortcut for steps 2 through 4, open this link in a browser and confirm the dialog that appears in Obsidian:

```
obsidian://brat?plugin=bellicose100xp/obsidian-collapse-sidebar-on-open
```

### Pinning a version

Appending a tag to that link freezes the install to one release, so BRAT stops pulling newer ones:

```
obsidian://brat?plugin=bellicose100xp/obsidian-collapse-sidebar-on-open&version=1.1.0
```

The same field is available in the Add-plugin dialog. Switch between a pinned version and the latest with the edit button in Settings → BRAT.

## Manual install

Download `main.js` and `manifest.json` from a [release](https://github.com/bellicose100xp/obsidian-collapse-sidebar-on-open/releases) into `<vault>/.obsidian/plugins/collapse-sidebar-on-open/`, then reload Obsidian and enable the plugin under Settings → Community plugins.

## Build from source

```
npm install
npm run build
```

That writes `main.js` beside `manifest.json`. `npm run dev` rebuilds on save instead.

## Release

```
npm version patch
git push origin master --follow-tags
```

`npm version` bumps `package.json`, syncs `manifest.json` and `versions.json`, commits, and tags. Pushing the tag triggers a workflow that builds the plugin and publishes a GitHub release with `main.js` and `manifest.json` attached, which is what BRAT reads.
