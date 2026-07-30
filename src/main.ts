import { Plugin, WorkspaceSidedock } from "obsidian";

/** A sidedock plus the DOM element it lives in. Not in the public typings. */
type SidedockWithEl = WorkspaceSidedock & { containerEl?: HTMLElement };

export default class CollapseSidebarOnOpenPlugin extends Plugin {
	async onload() {
		// Capture phase, so the click is seen even if the File Explorer stops
		// propagation. The collapse is deferred so Obsidian finishes opening the
		// file before the row we clicked disappears from the layout.
		this.registerDomEvent(
			document,
			"click",
			(evt) => this.handleClick(evt),
			true,
		);
	}

	private handleClick(evt: MouseEvent) {
		if (evt.button !== 0) return;

		// A modifier means multi-select or open-in-new-tab, not "take me here".
		if (evt.shiftKey || evt.altKey || evt.ctrlKey || evt.metaKey) return;

		const target = evt.target;
		if (!(target instanceof HTMLElement)) return;

		// Only file rows. Folder rows (.nav-folder-title) just expand/collapse.
		const fileTitle = target.closest(".nav-file-title");
		if (!fileTitle) return;

		// Leave inline rename alone: the class sits on the row itself.
		if (fileTitle.hasClass("is-being-renamed")) return;
		if (target.isContentEditable) return;

		const dock = this.sidedockContaining(fileTitle);
		if (!dock || dock.collapsed) return;

		window.setTimeout(() => {
			if (!dock.collapsed) dock.collapse();
		}, 0);
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
