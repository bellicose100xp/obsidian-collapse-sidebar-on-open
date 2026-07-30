# Collapse Sidebar on Open

Obsidian plugin. Click a file in the File Explorer and the sidebar collapses once the file opens.

Works for any file type the vault can open, including `.html` files handled by the HTML Reader plugin.

## What it leaves alone

- Folder rows. They still just expand and collapse.
- Ctrl/Cmd/Shift/Alt clicks, which mean "new tab" or "multi-select", so the sidebar stays put.
- Inline rename.
- Middle and right clicks.

Applies to whichever sidebar the File Explorer is docked in, left or right.

## Build

```
npm install
npm run build
```

Outputs `main.js` next to `manifest.json`. `npm run dev` watches instead.

## Install into a vault

```
cp main.js manifest.json ~/obsidian-vaults/obsidian/.obsidian/plugins/collapse-sidebar-on-open/
```

Then reload the vault and enable the plugin. With the Obsidian CLI: `obsidian reload` then `obsidian plugin:enable id=collapse-sidebar-on-open`.
