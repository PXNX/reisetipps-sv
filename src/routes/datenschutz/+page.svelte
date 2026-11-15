<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
</script>

<div class="mx-auto max-w-xl space-y-6 px-4 pt-6 pb-10">
	<h1 class="text-2xl font-semibold">{m.privacy_title()}</h1>
	<p class="text-base-content/80">{m.privacy_intro()}</p>

	<section class="space-y-1">
		<h2 class="text-sm font-semibold text-secondary uppercase">{m.privacy_data_heading()}</h2>
		<p class="text-sm text-base-content/80">{m.privacy_data_body()}</p>
	</section>

	<section class="space-y-1">
		<h2 class="text-sm font-semibold text-secondary uppercase">
			{m.privacy_geolocation_heading()}
		</h2>
		<p class="text-sm text-base-content/80">{m.privacy_geolocation_body()}</p>
	</section>

	<section class="space-y-1">
		<h2 class="text-sm font-semibold text-secondary uppercase">{m.privacy_storage_heading()}</h2>
		<p class="text-sm text-base-content/80">{m.privacy_storage_body()}</p>
	</section>

	<section class="space-y-1">
		<h2 class="text-sm font-semibold text-secondary uppercase">{m.privacy_external_heading()}</h2>
		<p class="text-sm text-base-content/80">{m.privacy_external_body()}</p>
	</section>

	<section class="space-y-1">
		<h2 class="text-sm font-semibold text-secondary uppercase">
			{m.privacy_no_tracking_heading()}
		</h2>
		<p class="text-sm text-base-content/80">{m.privacy_no_tracking_body()}</p>
	</section>

	<section class="space-y-1">
		<h2 class="text-sm font-semibold text-secondary uppercase">{m.privacy_contact_heading()}</h2>
		<p class="text-sm text-base-content/80">{m.privacy_contact_body()}</p>
	</section>
</div>
