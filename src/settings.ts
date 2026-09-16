import { PluginSettingTab, SettingDefinitionItem } from 'obsidian';
import type CollapseSidebarOnOpenPlugin from './main';

export interface CollapseSidebarSettings {
	/** Collapse the left sidebar after opening a file from it. */
	collapseLeft: boolean;
	/** Collapse the right sidebar after opening a file from it. */
	collapseRight: boolean;
	/** Only collapse when the window is narrower than this, in pixels. */
	maxWidth: number;
	/** Also collapse after a file is opened from the quick switcher or another dialog. */
	collapseFromDialogs: boolean;
}

export const DEFAULT_SETTINGS: CollapseSidebarSettings = {
	collapseLeft: true,
	collapseRight: true,
	maxWidth: 1400,
	collapseFromDialogs: true,
};

export class CollapseSidebarSettingTab extends PluginSettingTab {
	constructor(private readonly settingsPlugin: CollapseSidebarOnOpenPlugin) {
		super(settingsPlugin.app, settingsPlugin);
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				type: 'group',
				heading: 'Sidebars',
				items: [
					{
						name: 'Left sidebar',
						desc: 'Collapse the left sidebar after a file is opened. When off, the left sidebar is left alone.',
						control: {
							type: 'toggle',
							key: 'collapseLeft',
							defaultValue: DEFAULT_SETTINGS.collapseLeft,
						},
					},
					{
						name: 'Right sidebar',
						desc: 'Collapse the right sidebar after a file is opened. When off, the right sidebar is left alone.',
						control: {
							type: 'toggle',
							key: 'collapseRight',
							defaultValue: DEFAULT_SETTINGS.collapseRight,
						},
					},
				],
			},
			{
				name: 'Collapse below this window width',
				desc: 'Only collapse a sidebar when the window is narrower than this many pixels. Set it to 0 to collapse at any width.',
				control: {
					type: 'number',
					key: 'maxWidth',
					defaultValue: DEFAULT_SETTINGS.maxWidth,
					min: 0,
					step: 50,
					placeholder: String(DEFAULT_SETTINGS.maxWidth),
					validate: (value) =>
						Number.isFinite(value) && value >= 0
							? undefined
							: 'Enter a width of 0 or more.',
				},
			},
			{
				name: 'Quick switcher and other dialogs',
				desc: 'Also collapse the enabled sidebars when a file is picked in the quick switcher, the command palette, or another dialog. Clicking in the File Explorer always collapses.',
				control: {
					type: 'toggle',
					key: 'collapseFromDialogs',
					defaultValue: DEFAULT_SETTINGS.collapseFromDialogs,
				},
			},
		];
	}
}
