import { Plugin, TFile, WorkspaceSidedock } from 'obsidian';
import {
	CollapseSidebarSettings,
	CollapseSidebarSettingTab,
	DEFAULT_SETTINGS,
} from './settings';

/** A sidedock plus the DOM element it lives in. Not in the public typings. */
type SidedockWithEl = WorkspaceSidedock & { containerEl?: HTMLElement };

/**
 * How long after the last interaction inside a dialog a file open still counts
 * as coming from that dialog. The dialog is gone from the DOM by the time the
 * file opens, so this is how the two are tied together.
 */
const DIALOG_WINDOW_MS = 1000;

export default class CollapseSidebarOnOpenPlugin extends Plugin {
	settings: CollapseSidebarSettings = DEFAULT_SETTINGS;

	/** When the user last pressed a key or pointer inside a dialog, or 0. */
	private dialogInteractionAt = 0;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new CollapseSidebarSettingTab(this));

		// Capture phase, so the click is seen even if the File Explorer stops
		// propagation. The collapse is deferred so Obsidian finishes opening the
		// file before the row we clicked disappears from the layout.
		this.registerDomEvent(
			document,
			'click',
			(evt) => {
				this.handleClick(evt);
			},
			true,
		);

		// The quick switcher, command palette, and other dialogs all live in a
		// .modal-container. Remember any interaction there so a file that opens
		// right after can be attributed to it.
		this.registerDomEvent(
			document,
			'pointerdown',
			(evt) => {
				this.noteDialogInteraction(evt);
			},
			true,
		);
		this.registerDomEvent(
			document,
			'keydown',
			(evt) => {
				this.noteDialogInteraction(evt);
			},
			true,
		);
		this.registerEvent(
			this.app.workspace.on('file-open', (file) => {
				this.handleFileOpen(file);
			}),
		);
	}

	async loadSettings() {
		const saved = (await this.loadData()) as Partial<CollapseSidebarSettings> | null;
		this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private handleClick(evt: MouseEvent) {
		if (evt.button !== 0) return;

		// A modifier means multi-select or open-in-new-tab, not "take me here".
		if (evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey) return;

		if (!this.isNarrowEnough()) return;

		const target = evt.target;
		if (!(target instanceof HTMLElement)) return;

		// Only file rows. Folder rows (.nav-folder-title) just expand/collapse.
		const fileTitle = target.closest('.nav-file-title');
		if (!fileTitle) return;

		// Leave inline rename alone: the class sits on the row itself.
		if (fileTitle.hasClass('is-being-renamed')) return;
		if (target.isContentEditable) return;

		const dock = this.sidedockContaining(fileTitle);
		if (!dock || dock.collapsed) return;
		if (!this.isEnabledFor(dock)) return;

		this.collapseSoon(dock);
	}

	private noteDialogInteraction(evt: Event) {
		if (!this.settings.collapseFromDialogs) return;
		const target = evt.target;
		if (!(target instanceof HTMLElement)) return;
		if (!target.closest('.modal-container')) return;
		this.dialogInteractionAt = Date.now();
	}

	/** A file opened right after a dialog interaction came from that dialog. */
	private handleFileOpen(file: TFile | null) {
		if (!file) return;
		if (!this.settings.collapseFromDialogs) return;
		if (this.dialogInteractionAt === 0) return;

		const fromDialog = Date.now() - this.dialogInteractionAt < DIALOG_WINDOW_MS;
		this.dialogInteractionAt = 0;
		if (!fromDialog) return;

		if (!this.isNarrowEnough()) return;

		const { leftSplit, rightSplit } = this.app.workspace;
		for (const dock of [leftSplit, rightSplit]) {
			if (!dock || dock.collapsed) continue;
			if (!this.isEnabledFor(dock)) continue;
			this.collapseSoon(dock);
		}
	}

	/** Collapse once the current open finishes touching the layout. */
	private collapseSoon(dock: WorkspaceSidedock) {
		window.setTimeout(() => {
			if (!dock.collapsed) dock.collapse();
		}, 0);
	}

	/**
	 * A width of 0 disables the check, so the sidebar collapses at any size.
	 * Measured against the window the click happened in, which may be a popout.
	 */
	private isNarrowEnough(): boolean {
		const { maxWidth } = this.settings;
		if (!Number.isFinite(maxWidth) || maxWidth <= 0) return true;
		return activeWindow.innerWidth < maxWidth;
	}

	/** Whether the user turned the plugin on for this side. */
	private isEnabledFor(dock: WorkspaceSidedock): boolean {
		const { leftSplit, rightSplit } = this.app.workspace;
		if (dock === leftSplit) return this.settings.collapseLeft;
		if (dock === rightSplit) return this.settings.collapseRight;
		return false;
	}

	/** Which sidebar the clicked row belongs to, if any. */
	private sidedockContaining(el: Element): WorkspaceSidedock | null {
		const { leftSplit, rightSplit } = this.app.workspace;
		for (const dock of [leftSplit, rightSplit] as SidedockWithEl[]) {
			if (dock?.containerEl?.contains(el)) return dock;
		}
		return null;
	}
}
