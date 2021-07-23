<script lang="ts">
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import Modal from './components/Modal.svelte';

	// let socket = null;
	// onMount(() => {
	// 	socket = io("http://localhost:3000");
	// })

</script>

<style>
	#root {
		position: relative;
		height: 100vh;
	}
</style>

<div id="root">
	<Modal />	
</div>

