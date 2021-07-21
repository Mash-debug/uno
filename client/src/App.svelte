<script>
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	let socket = null;

	onMount(() => {
		socket = io("http://localhost:3000");
	})

</script>

<main>
	<p>Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn how to build Svelte apps.</p>
</main>

<style>
	
</style>