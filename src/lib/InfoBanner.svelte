<script lang="ts">
  import { _ } from "../services/i18n";
  import { onMount } from "svelte";
  
  // Variable für die Sichtbarkeit des Banners
  let isVisible = false;
  
  // Beim Laden der Komponente die aktuelle Domain überprüfen
  onMount(() => {
    // Hole die aktuelle Domain 
    const currentHost = window.location.hostname;
    
    // Prüfe, ob die Domain nicht die originale ist
    isVisible = currentHost !== 'pride.hfz.wtf';
  });
  
  // Funktion zum Schließen des Banners - ohne localStorage-Speicherung
  function closeBanner() {
    isVisible = false;
  }
</script>

{#if isVisible}
<div class="info-banner">
  <div class="banner-content">
    <span>
      {$_('original-app-notice', { fallback: 'This is a mirror of the original app. Visit the official site at' })} 
      <a href="https://pride.hfz.wtf" target="_blank" rel="noopener noreferrer">pride.hfz.wtf</a>
    </span>
    <button class="close-button" on:click={closeBanner}>×</button>
  </div>
</div>
{/if}

<style>
  .info-banner {
    background-color: var(--primary-color);
    color: white;
    padding: 0.7rem 0;
    text-align: center;
    width: 100%;
    position: relative;
    z-index: 10;
    font-weight: 500;
  }
  
  .banner-content {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  a {
    color: white;
    font-weight: bold;
    text-decoration: underline;
    margin-left: 0.5rem;
  }
  
  a:hover {
    text-decoration: none;
  }
  
  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    margin-left: 1rem;
    padding: 0 0.5rem;
  }
  
  .close-button:hover {
    opacity: 0.8;
  }
</style>