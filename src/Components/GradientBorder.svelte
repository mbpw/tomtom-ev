<div>
    <slot>
        Coś
    </slot>
</div>

<style lang="scss">
    div {
        display: flex;
        align-items: center;
        width: fit-content;
        max-width: 22em;
        margin: auto;

        position: relative;
        padding: 10px;
        box-sizing: border-box;

        $border: 3px;
        color: #000000;
        background: #ffffff;
        background-clip: padding-box; /* !importanté */
        border: solid $border transparent; /* !importanté */
        border-radius: 500px;

        &:before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: -1;
            margin: -$border; /* !importanté */
            border-radius: inherit; /* !importanté */
            background: linear-gradient(95.46deg, $primary, $secondary);
        }
    }
</style>