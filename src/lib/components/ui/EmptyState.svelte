<script lang="ts">
	/** A calm, readable dead end: say what happened and offer one obvious next step. */
	import Icon from './Icon.svelte';

	interface Props {
		icon?: string;
		title: string;
		body: string;
		actionLabel?: string;
		onaction?: () => void;
		compact?: boolean;
	}

	let {
		icon = 'compass',
		title,
		body,
		actionLabel = '',
		onaction = () => {},
		compact = false
	}: Props = $props();
</script>

<div class="flex flex-col items-center gap-3 text-center {compact ? 'px-3 py-6' : 'px-4 py-10'}">
	<span
		class="grid {compact
			? 'h-12 w-12'
			: 'h-16 w-16'} place-items-center rounded-full bg-primary/12 text-primary"
	>
		<Icon name={icon} size={compact ? 24 : 30} />
	</span>
	<div class="max-w-sm">
		<p class="font-bold {compact ? 'text-base' : 'text-lg'}">{title}</p>
		<p class="mt-1 text-sm leading-relaxed text-base-content/70">{body}</p>
	</div>
	{#if actionLabel}
		<button type="button" class="btn mt-1 gap-2 btn-primary" onclick={onaction}>
			<Icon name="refresh" size={18} />
			{actionLabel}
		</button>
	{/if}
</div>
