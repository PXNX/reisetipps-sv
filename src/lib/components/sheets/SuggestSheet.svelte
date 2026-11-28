<script lang="ts">
	/** A simple form that turns a suggestion into a message the reader can send anywhere. */
	import * as m from '$lib/paraglide/messages.js';
	import { currentLocale } from '$lib/i18n';
	import { buildTipMessage, type TipFields } from '$lib/tipDraft';
	import { trackEvent } from '$lib/telemetry';
	import Icon from '../ui/Icon.svelte';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
	}

	let { open, onclose }: Props = $props();

	let fields = $state<TipFields>({ place: '', town: '', note: '', url: '' });
	let draft = $state('');
	let copied = $state(false);

	function prepare() {
		if (!fields.place.trim()) return;
		draft = buildTipMessage(fields, currentLocale());
		copied = false;
		trackEvent('tip_drafted', {});
	}

	function reset() {
		fields = { place: '', town: '', note: '', url: '' };
		draft = '';
		copied = false;
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(draft);
			copied = true;
			trackEvent('tip_copied', {});
			setTimeout(() => (copied = false), 3000);
		} catch {
			copied = false;
		}
	}

	async function share() {
		if (navigator.share) {
			try {
				await navigator.share({ title: m.app_name(), text: draft });
				trackEvent('tip_shared', {});
				return;
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') return;
			}
		}
		await copy();
	}
</script>

<BottomSheet {open} {onclose} title={m.suggest_title()}>
	<div class="space-y-5">
		<p class="text-sm leading-relaxed text-base-content/70">{m.suggest_hint()}</p>

		{#if draft}
			<div class="space-y-3">
				<label class="block space-y-1.5">
					<span class="text-sm font-semibold">{m.suggest_ready()}</span>
					<textarea
						class="textarea min-h-40 w-full resize-y font-mono text-sm"
						readonly
						value={draft}></textarea>
				</label>
				<div class="grid gap-2 sm:grid-cols-2">
					<button class="btn gap-2 btn-primary" onclick={share}>
						<Icon name="arrow-right" size={19} />
						{m.suggest_share()}
					</button>
					<button class="btn gap-2 btn-soft" onclick={copy} aria-live="polite">
						<Icon name={copied ? 'check' : 'text'} size={19} />
						{copied ? m.suggest_copied() : m.suggest_copy()}
					</button>
				</div>
				<button class="btn w-full btn-ghost" onclick={reset}>{m.suggest_again()}</button>
			</div>
		{:else}
			<div class="space-y-4">
				<label class="block space-y-1.5">
					<span class="text-sm font-semibold">{m.suggest_place_label()}</span>
					<input
						class="input w-full"
						bind:value={fields.place}
						placeholder={m.suggest_place_placeholder()}
						maxlength="80"
					/>
				</label>
				<label class="block space-y-1.5">
					<span class="text-sm font-semibold">{m.suggest_town_label()}</span>
					<input
						class="input w-full"
						bind:value={fields.town}
						placeholder={m.suggest_town_placeholder()}
						maxlength="80"
					/>
				</label>
				<label class="block space-y-1.5">
					<span class="text-sm font-semibold">{m.suggest_note_label()}</span>
					<textarea
						class="textarea min-h-24 w-full resize-y"
						bind:value={fields.note}
						placeholder={m.suggest_note_placeholder()}
						maxlength="400"
						rows="3"></textarea>
				</label>
				<label class="block space-y-1.5">
					<span class="text-sm font-semibold">{m.suggest_url_label()}</span>
					<input
						class="input w-full"
						bind:value={fields.url}
						placeholder={m.suggest_url_placeholder()}
						maxlength="200"
						inputmode="url"
					/>
				</label>
				<button
					type="button"
					class="btn w-full gap-2 btn-primary"
					onclick={prepare}
					disabled={!fields.place.trim()}
				>
					<Icon name="sparkle" size={19} />
					{m.suggest_prepare()}
				</button>
			</div>
		{/if}
	</div>
</BottomSheet>
