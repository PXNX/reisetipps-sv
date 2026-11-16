/** Shared state so Settings can open the install sheet at any time. */
class InstallHintState {
	open = $state(false);

	show() {
		this.open = true;
	}

	hide() {
		this.open = false;
	}
}

export const installHint = new InstallHintState();
