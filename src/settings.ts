import { PluginSettingTab, SettingDefinitionItem } from 'obsidian';
import type CollapseSidebarOnOpenPlugin from './main';

export interface CollapseSidebarSettings {
	/** Only collapse when the window is narrower than this, in pixels. */
	maxWidth: number;
}

export const DEFAULT_SETTINGS: CollapseSidebarSettings = {
	maxWidth: 1400,
};

export class CollapseSidebarSettingTab extends PluginSettingTab {
	constructor(private readonly settingsPlugin: CollapseSidebarOnOpenPlugin) {
		super(settingsPlugin.app, settingsPlugin);
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		return [
			{
				name: 'Collapse below this window width',
				desc: 'Only collapse the sidebar when the window is narrower than this many pixels. Set it to 0 to collapse at any width.',
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
		];
	}
}
