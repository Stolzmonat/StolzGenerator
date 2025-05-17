<script lang="ts">
  import { setupI18n, dir, isLocaleLoaded, locale, _ } from "./services/i18n";
  import { theme } from "./services/theme";

  import { slide } from "svelte/transition";
  import { onMount } from "svelte";

  import Dropzone from "./lib/Dropzone.svelte";
  import FileStats from "./lib/FileStats.svelte";
  import { flagColours } from "./lib/constants/flagColours";
  import { flagThumbnails } from "./lib/constants/flagThumbnails";
  import CustomSelect from "./lib/CustomSelect.svelte";
  import Slider from "./lib/Slider.svelte";
  import Switch from "./lib/Switch.svelte";
  import ThemeSwitcher from "./lib/ThemeSwitcher.svelte";

  import gradientIcon from "./assets/gradient.svg";
  import loadingIcon from "./assets/loading.svg";
  import rotatingIcon from "./assets/rotating.svg";
  import Preview from "./lib/Preview.svelte";
  import { generateFlag } from "./lib/helpers/generateFlag";
  import { capitalise } from "./lib/helpers/stringHelpers";
  import Button from "./lib/Button.svelte";
  import { download } from "./lib/helpers/download";
  import RadioRow from "./lib/RadioRow.svelte";
  import { CutoutType } from "./lib/types/cutoutType";
  import Footer from "./lib/Footer.svelte";
  import Note from "./lib/Note.svelte";
  import { NoteType } from "./lib/types/noteTypes";
  import LocaleSelector from "./lib/LocaleSelector.svelte";
  import { flagsInitialized } from "./lib/helpers/PngHelper";

  let selectedFiles: File[] = [];
  let selectedFlag: string = "German Pride";
  let secondaryFlag: string = "none";
  let cutoutSize: number = 80;
  let isGradient: boolean = false;
  let rotating: boolean = false;
  let animationLength: number = 10;
  let previewCircular: boolean = true;
  let isRotatingCounterClockwise: boolean = false;
  let overlayOpacity: number = 100;
  let cutoutType: CutoutType = CutoutType.CIRCLE;
  let overlayRotation: number = 0;
  let isLoadingFlags: boolean = true;
  
  // Neue Variablen für die Bildmanipulation
  let imageScale: number = 100;  // Skalierung in Prozent
  let imageOffsetX: number = 0;  // X-Position des Bildes
  let imageOffsetY: number = 0;  // Y-Position des Bildes
  let aspectRatioScale: number = 1; // Seitenverhältnis-Anpassung (1 = Original)

  // Optionen für Flaggenauswahl
  let primaryFlagOptions = [];
  let secondaryFlagOptions = [];

  let canvas: HTMLCanvasElement;

  $: animated = rotating;
  
  // Hilfsfunktion, die prüft, ob eine bestimmte Flagge Gradienten unterstützen kann
  $: canFlagSupportGradient = (flagName: string) => {
    const flag = flagColours[flagName];
    return Array.isArray(flag) && flag.length > 1 && flag[0] !== flag;
  };
  
  // Prüft, ob die ausgewählte Flagge oder sekundäre Flagge einen Gradienten unterstützen kann
  $: canSupportGradient = 
    canFlagSupportGradient(selectedFlag) || 
    (secondaryFlag !== "none" && canFlagSupportGradient(secondaryFlag));

  $: renderOptions = {
    cutoutSize: cutoutSize,
    selectedColors: flagColours[selectedFlag],
    secondaryFlag: secondaryFlag === "none" ? [] : flagColours[secondaryFlag],
    isGradient: isGradient,
    isRotating: rotating,
    animationLength: animationLength,
    isRotatingCounterClockwise: isRotatingCounterClockwise,
    overlayOpacity: overlayOpacity,
    cutoutType: cutoutType,
    rotationOffset: overlayRotation,
    imageScale: imageScale,      // Neue Option für Bildskalierung
    imageOffsetX: imageOffsetX,  // Neue Option für X-Position
    imageOffsetY: imageOffsetY,  // Neue Option für Y-Position
    aspectRatioScale: aspectRatioScale  // Neue Option für Seitenverhältnis-Anpassung
  };

  let isRendering: boolean = false;

  $: if (!$isLocaleLoaded) {
    setupI18n({ withLocale: navigator.language.substring(0, 2) });
  }

  // Erstellt die Optionen für die Flaggen-Dropdown-Menüs mit vorgenerierten Thumbnails
  async function prepareFlagOptions() {
    // Warten, bis die vorgeladenen Flaggen initialisiert sind
    await flagsInitialized;

    // Hilfsfunktion, um ein Thumbnail für eine Flagge zu erhalten
    function getThumbnailForFlag(flagName: string): string {
      // Prüfen, ob wir einen vorgenerierten Thumbnail haben
      if (flagThumbnails[flagName]) {
        return flagThumbnails[flagName];
      }
      // Fallback: Generiere das Thumbnail on-the-fly
      return generateFlag(flagColours[flagName]);
    }
    
    // Primäre Flaggenoptionen erstellen
    primaryFlagOptions = Object.keys(flagColours)
      .sort()
      .map(flagName => ({
        label: capitalise(flagName),
        value: flagName,
        icon: getThumbnailForFlag(flagName)
      }));
    
    // Sekundäre Flaggenoptionen erstellen
    secondaryFlagOptions = [
      { label: $_("none"), value: "none", icon: "" }, // "None" hat kein Icon
      ...Object.keys(flagColours)
        .sort()
        .map(flagName => ({
          label: capitalise(flagName),
          value: flagName,
          icon: getThumbnailForFlag(flagName)
        }))
    ];
    
    isLoadingFlags = false;
  }

  onMount(() => {
    // Vorbereiten der Flaggenoptionen
    prepareFlagOptions();
  });
</script>

<!-- <svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Roboto&display=swap"
    rel="stylesheet"
  />
</svelte:head> -->

<main class={$theme}>
  {#if $isLocaleLoaded}
    <header>
      <h1>{@html $_("header")}</h1>
    </header>

    <div class="controls-row">
      <LocaleSelector
        value={$locale ?? 'en'}
        on:locale-changed={(e) => setupI18n({ withLocale: e.detail })}
      />
      <ThemeSwitcher />
    </div>

    <section>
      <h2>{@html $_("data-input")}</h2>
      <div class="flexysmexy" class:expanded={selectedFiles.length > 0}>
        <div>
          <Dropzone bind:selectedFiles filter="image/*" />
        </div>
        <div>
          <FileStats {selectedFiles} />
        </div>
      </div>
    </section>

    <section>
      <h2>{@html $_("flag-selection")}</h2>
      {#if isLoadingFlags}
        <div class="loading-flags">
          <img src={loadingIcon} alt="Loading flags" class="spin-icon" />
          <p>Loading flags...</p>
        </div>
      {:else}
        <CustomSelect
          id="primary-flag-select"
          options={primaryFlagOptions}
          bind:selected={selectedFlag}
        />

        <br/>
        
        <h3>{@html $_("secondary-flag")}</h3>
        <CustomSelect
          id="secondary-flag-select"
          options={secondaryFlagOptions}
          bind:selected={secondaryFlag}
        />
      {/if}

      <section>
        <h2>{@html $_("settings")}</h2>
        <RadioRow
          bind:selected={cutoutType}
          options={[
            { label: $_("round"), value: CutoutType.CIRCLE },
            { label: $_("quad"), value: CutoutType.SQUARE },
            { label: $_("overlay"), value: CutoutType.OVERLAY },
          ]}
        />
        <br /><br />
        <p>{@html $_("cut-size")}</p>
        <Slider bind:value={cutoutSize} />
        <br />
        <p>{@html $_("opacity")}</p>
        <Slider bind:value={overlayOpacity} />
        <br />
        <p>{@html $_("offset-rotation")}</p>
        <Slider bind:value={overlayRotation} min={0} max={360} step={1} />
        <br />
        <h3>{@html $_("type-of-representation")}</h3>
        <div class="multiple-choices">
          <Switch bind:checked={isGradient} disabled={!canSupportGradient}
            >{@html $_("gradient")}
            <img alt="" src={gradientIcon} class="icon" /></Switch
          >
          <Switch bind:checked={rotating}
            >{@html $_("animated")}<img
              alt=""
              src={rotatingIcon}
              class="icon"
            /></Switch
          >
        </div>
      </section>

      {#if animated}
        <section transition:slide|local>
          <h2>{@html $_("anim-setting")}</h2>
          <p>{@html $_("anim-length")}</p>
          <Slider bind:value={animationLength} min={0.1} max={30} step={0.1} />
          <br />
          <Switch bind:checked={isRotatingCounterClockwise}
            >{@html $_("counter-clock")}</Switch
          >
        </section>
      {/if}

      <section>
        <h2>{@html $_("preview")}</h2>
        <Preview
          options={renderOptions}
          selectedFile={selectedFiles[0]}
          {previewCircular}
          bind:canvas
        />
        
        {#if selectedFiles.length > 0}
          <div class="image-controls">
            <p>{@html $_("image-scale")}</p>
            <Slider bind:value={imageScale} min={50} max={200} step={1} />
            
            <p>{@html $_("aspect-ratio")}</p>
            <Slider bind:value={aspectRatioScale} min={0.5} max={2} step={0.05} />
          </div>
        {/if}
        
        <br /><br />
        <Switch bind:checked={previewCircular}
          >{@html $_("circular-preview")}</Switch
        >
      </section>

      <section>
        <h2>{@html $_("export")}</h2>
        {#if !isRendering}
          {#if !selectedFiles.length}
            <Note>{@html $_("note-png")}</Note><br />
          {/if}
          {#if animated}
            <Note type={NoteType.WARNING}>{@html $_("note-gif")}</Note><br />
          {/if}
          <!-- svelte-ignore missing-declaration -->
          <Button
            on:click={() => {
              isRendering = true;
              setTimeout(async () => {
                await download(selectedFiles[0], renderOptions);
                isRendering = false;
              }, 50);
            }}
            >{@html $_("download-as")}
            {#if animated}GIF{:else}PNG{/if}!</Button
          >
        {:else}
          <Note
            >{@html $_("image-is-rendering")}<img
              src={loadingIcon}
              class="icon"
              alt=""
            /></Note
          >
        {/if}
      </section>

      <Footer />
    </section>
  {/if}
</main>

<style>
  :root {
    --page-size: 50vw;
    --bg: white;
    --text-color: #333333;
    --primary-color: hsla(24, 100%, 57%, 0.666);
    --slider-thumb-size: 2rem;
    --slider-thumb-bg: white;
    --slider-thumb-shadow: 0 0.25rem 0.5rem hsla(0, 0%, 0%, 0.25);
    --select-color: hsl(0, 0%, 90%);
    --ridge-color: hsl(0, 0%, 70%);
    --disabled-color: hsl(0, 0%, 40%);
    --small-element-transition-duration: 0.15s;
    --big-element-transition-duration: 0.3s;
    --ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
  }

  /* Dark mode theme */
  main.dark {
    --bg: #1e1e1e;
    --text-color: #f0f0f0;
    --primary-color: hsla(24, 100%, 57%, 0.8);
    --slider-thumb-bg: #444444;
    --select-color: hsl(0, 0%, 25%);
    --ridge-color: hsl(0, 0%, 40%);
    --disabled-color: hsl(0, 0%, 60%);
    background-color: var(--bg);
    color: var(--text-color);
  }
  
  /* Light mode theme - explizit für die Konsistenz */
  main.light {
    --bg: white;
    --text-color: #333333;
    background-color: var(--bg);
    color: var(--text-color);
  }

  :global(html) {
    scrollbar-color: var(--primary-color) transparent;
  }

  :global(h1),
  :global(h2),
  :global(h3),
  :global(h4),
  :global(h5),
  :global(h6) {
    font-family: Raleway, Arial, sans-serif, monospace;
  }

  :global(h1),
  :global(h2),
  :global(h3),
  :global(h4),
  :global(h5),
  :global(h6),
  :global(p) {
    margin: 0 0 0.75rem 0;
  }

  :global(a) {
    color: hsl(32, 93%, 48%);
  }

  main {
    position: relative;
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
  }

  main > header > h1 {
    text-align: center;
    margin: 2rem 0;
  }

  section {
    flex-grow: 0;
    width: Calc(var(--page-size) + 0.01px); /* because flex-wrap */
    padding: 1.2rem;
    box-sizing: border-box;
    margin: 0 auto;
  }

  .controls-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
    gap: 2rem;
    width: Calc(var(--page-size) + 0.01px);
    margin-left: auto;
    margin-right: auto;
  }

  .flexysmexy {
    display: grid;
    overflow-x: hidden;
    grid-template-columns: 100% 0;
    gap: 0;
    transition-duration: var(--big-element-transition-duration);
  }
  .flexysmexy > * {
    position: relative;
    align-items: stretch;
    grid-row: 1;
  }
  .flexysmexy.expanded {
    gap: 1rem;
    grid-template-columns: Calc((100% - 1rem) / 2) Calc((100% - 1rem) / 2);
  }

  img {
    display: inline-flex;
  }
  img.icon {
    vertical-align: middle;
    width: 2rem;
    height: 2rem;
    margin-left: 0.5rem;
  }
  
  .spin-icon {
    animation: spin 1.5s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .loading-flags {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    gap: 1rem;
  }
  
  .loading-flags img {
    width: 2rem;
    height: 2rem;
  }

  .multiple-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 3rem;
  }

  .image-controls {
    margin-top: 2rem;
  }

  @media screen and (max-width: 80rem) {
    :root {
      --page-size: 70vw;
    }
  }
  @media screen and (max-width: 60rem) {
    :root {
      /* --page-size: 97.5vw; */
      --page-size: Calc(100vw - (97.5vw - 97.5%));
    }
  }

  @media screen and (max-width: 35rem) and (orientation: portrait) {
    .flexysmexy {
      overflow-x: initial;
      overflow-y: hidden;
      grid-template-columns: initial;
      grid-template-rows: 100% 0;
    }

    .flexysmexy > * {
      align-items: initial;
      grid-row: initial;
    }

    .flexysmexy.expanded {
      grid-template-columns: initial;
      grid-template-rows: 1fr 1fr;
    }
  }
</style>
