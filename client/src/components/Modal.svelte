<script lang="ts">
    let pseudo: string;
    let room: string;
    let visible = true;

    import { fade } from 'svelte/transition'

    function handleClick() {
        visible = false;
    }
</script>

<style>
    #modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        text-align: center;
        padding: 16px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90vw;
        max-width: 900px;
        font-size: 1.4rem;
        color: rgb(255, 255, 255);
    }

    #header {
        justify-content: center;
        margin-bottom: 16px;
        padding-left: 16px;
    }

    #content {
        display: flex;
        flex-direction: column;
        width: 90%;
        height: 35%;
        margin: auto;
        justify-content: center;
    }

    #pseudo, #room {
        font-size: 0.8em;
        padding-left: 8px;
        height: 30px;
        outline: none;
        border: none;
        font-family: inherit;
    }

    small {
        margin-top: 16px;
    }

</style>

{#if visible}
<div id="modal" transition:fade={{delay: 1000}}>
    <div id="header">Connexion</div>
    <div id="content">
        <input type="text" bind:value={pseudo} id="pseudo" placeholder="Pseudo" style="margin-bottom: 8px;">
        <input type="text" bind:value={room} id="room" placeholder="Room">
    </div>
    <small>Lorsque vous créez une room le nom est automatiquement généré.</small>

    <button on:click={handleClick}>Envoyer</button> <!-- Créer un composant pour le bouton -->
</div>
{/if}


