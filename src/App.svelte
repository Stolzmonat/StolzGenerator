<script lang="ts">
  import { setupI18n, dir, isLocaleLoaded, locale, _ } from "./services/i18n";

  import { slide } from "svelte/transition";

  import Dropzone from "./lib/Dropzone.svelte";
  import FileStats from "./lib/FileStats.svelte";
  import { flagColours } from "./lib/constants/flagColours";
  import CustomSelect from "./lib/CustomSelect.svelte";
  import Slider from "./lib/Slider.svelte";
  import Switch from "./lib/Switch.svelte";

  import gradientIcon from "./assets/gradient.svg";
  import resizeInwardsIcon from "./assets/resizeInwards.svg";
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

  let selectedFiles: File[] = [];
  let selectedFlag: string = "German Pride";
  let secondaryFlag: string = "German Classic Pride";
  let cutoutSize: number = 80;
  let isGradient: boolean = false;
  let resizeInwards: boolean = true;
  let rotating: boolean = false;
  let animationLength: number = 10;
  let previewCircular: boolean = true;
  let isRotatingCounterClockwise: boolean = false;
  let overlayOpacity: number = 100;
  let cutoutType: CutoutType = CutoutType.CIRCLE;
  let overlayRotation: number = 0;

  let canvas: HTMLCanvasElement;

  $: animated = rotating;

  $: renderOptions = {
    cutoutSize: cutoutSize,
    resizeInwards: resizeInwards,
    selectedColors: flagColours[selectedFlag],
    secondaryFlag: flagColours[secondaryFlag],
    isGradient: isGradient,
    isRotating: rotating,
    animationLength: animationLength,
    isRotatingCounterClockwise: isRotatingCounterClockwise,
    overlayOpacity: overlayOpacity,
    cutoutType: cutoutType,
    rotationOffset: overlayRotation,
  };

  let isRendering: boolean = false;

  $: if (!$isLocaleLoaded) {
    setupI18n({ withLocale: navigator.language.substring(0, 2) });
  }
</script>

<!-- <svelte:head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Raleway:wght@700&family=Roboto&display=swap"
    rel="stylesheet"
  />
</svelte:head> -->

<main>
  {#if $isLocaleLoaded}
    <header>
      <h1>{@html $_("header")}</h1>
    </header>

    <LocaleSelector
      value={$locale}
      on:locale-changed={(e) => setupI18n({ withLocale: e.detail })}
    />

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
      <CustomSelect
        options={Object.keys(flagColours)
          .sort()
          .map((e) => ({
            label: capitalise(e),
            value: e,
            icon: generateFlag(flagColours[e]),
          }))}
        bind:selected={selectedFlag}
      />

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
          <Switch bind:checked={isGradient}
            >{@html $_("gradient")}
            <img alt="" src={gradientIcon} class="icon" /></Switch
          >
          <Switch bind:checked={resizeInwards}
            >{@html $_("size-inward")}<img
              alt=""
              src={resizeInwardsIcon}
              class="icon"
            /></Switch
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

  .multiple-choices {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 3rem;
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
