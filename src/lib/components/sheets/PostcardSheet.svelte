<script lang="ts">
	/** Turns one place into a shareable picture. No account, no upload — just a PNG. */
	import * as m from '$lib/paraglide/messages.js';
	import { currentLocale } from '$lib/i18n';
	import type { Location } from '$lib/data/types';
	import { canvasToBlob, renderPostcard } from '$lib/postcard';
	import { trackEvent } from '$lib/telemetry';
	import Icon from '../ui/Icon.svelte';
	import BottomSheet from './BottomSheet.svelte';

	interface Props {
		open: boolean;
		onclose: () => void;
		location: Location | null;
	}

	let { open, onclose, location }: Props = $props();

	let note = $state('');
	let preview = $state('');
	let busy = $state(false);

	$effect(() => {
		if (!open || !location) return;
		const current = location;
		const text = note;
		const timer = setTimeout(async () => {
			try {
				const canvas = await renderPostcard(current, currentLocale(), text);
				preview = canvas.toDataURL('image/png');
			} catch {
				preview = '';
			}
		}, 220);
		return () => clearTimeout(timer);
	});

	function filename(): string {
		return `bodensee-${location?.id ?? 'postkarte'}.png`;
	}

	async function download() {
		if (!location) return;
		busy = true;
		try {
			const canvas = await renderPostcard(location, currentLocale(), note);
			const blob = await canvasToBlob(canvas);
			if (!blob) return;
			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = filename();
			link.click();
			setTimeout(() => URL.revokeObjectURL(url), 1000);
			trackEvent('postcard_saved', { place: location.id });
		} finally {
			busy = false;
		}
	}

	async function share() {
		if (!location) return;
		busy = true;
		try {
			const canvas = await renderPostcard(location, currentLocale(), note);
			const blob = await canvasToBlob(canvas);
			if (!blob) return;
			const file = new File([blob], filename(), { type: 'image/png' });
			if (navigator.canShare?.({ files: [file] })) {
				await navigator.share({ files: [file], title: m.app_name(), text: note });
				trackEvent('postcard_shared', { place: location.id });
			} else {
				await download();
			}
		} finally {
			busy = false;
		}
	}
</script>

<BottomSheet {open} {onclose} title={m.postcard_title()}>
	<div class="space-y-4">
		<p class="text-sm leading-relaxed text-base-content/70">{m.postcard_hint()}</p>

		{#if preview}
			<img
				src={preview}
				alt={m.postcard_title()}
				class="w-full rounded-[1.15rem] border border-white/10 shadow-lg"
			/>
		{/if}

		<label class="block space-y-1.5">
			<span class="text-sm font-semibold">{m.postcard_note_label()}</span>
			<textarea
				class="textarea min-h-20 w-full resize-none"
				rows="2"
				maxlength="90"
				bind:value={note}
				placeholder={m.postcard_note_placeholder()}></textarea>
		</label>

		<div class="grid gap-2 sm:grid-cols-2">
			<button class="btn gap-2 btn-primary" onclick={share} disabled={busy || !preview}>
				<Icon name="arrow-right" size={19} />
				{m.postcard_share()}
			</button>
			<button class="btn gap-2 btn-soft" onclick={download} disabled={busy || !preview}>
				<Icon name="download" size={19} />
				{m.postcard_save()}
			</button>
		</div>
	</div>
</BottomSheet>
