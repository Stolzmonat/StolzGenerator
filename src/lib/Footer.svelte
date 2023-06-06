<script lang="ts">
    import appIcon from "../assets/icon_alt_2.png";
    import { setupI18n, dir, isLocaleLoaded, locale, _ } from "../services/i18n";
</script>

<footer>
    <img src={appIcon} alt="" />
    <div>
        {@html $_('header')}
        <br />{@html $_('by')} <a href="https://twitter.com/Fry2412">HFZ</a>
        <br />2023 - 2333

    </div>
    <div id="footer-icons">
        <a class="icon" title="This app on GitHub" href="https://github.com/Stolzmonat/StolzGenerator">
            <img alt="GitHub icon" src="https://hihiqy1.nl/index_assets/icons/mark-github.svg" />
        </a>
    </div>
</footer>

<style>
    footer {
        margin: 2rem auto 0 auto;
        /* margin-top: 2rem; */
        border-top: 1px solid hsl(0, 0%, 40%);
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 1rem;
        align-items: center;

        flex-grow: 0;
        width: Calc(var(--page-size) + 0.01px); /* because flex-wrap */
        padding: 1.2rem;
        box-sizing: border-box;
    }
    footer > * {
        grid-row: 1;
    }
    footer > img {
        width: 7rem;
        height: 7rem;
        border-radius: 0.5rem;
    }

    #footer-icons {
        display: flex;
        gap: 0.5rem;
    }

    .icon {
        outline: none;
        border-radius: 50%;
    }
    .icon:hover > img,
    .icon:focus > img {
        transform: scale3d(1.2, 1.2, 1);
        box-shadow: 0 0 0 0.25rem var(--primary-color);
    }
    .icon > img {
        transition-duration: var(--small-element-transition-duration);
        transition-timing-function: var(--ease-out-cubic);
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        display: flex;
    }

    @media (orientation: portrait) {
        #footer-icons {
            flex-direction: column;
        }
    }
</style>
