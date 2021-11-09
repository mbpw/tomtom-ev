<script>
    /* See: https://svelte.dev/examples#modal */
    import TimePicker from 'svelte-time-picker'
    import { createEventDispatcher, onDestroy } from 'svelte'

    const dispatch = createEventDispatcher()
    const close = () => dispatch('close')

    /* Initializations */
    export let options = {}
    export let date = new Date()
    /* Local variables */
    let modal
    let zIndexStyle = 'z-index:' + options.zIndex + ';'

    /* Handles the keys events */
    const handle_keydown = e => {
        /* Checks escape */
        if (e.key === 'Escape') {
            close()
            return
        }
        /* Prevents the tab feature */
        if (e.key === 'Tab') {
            /* Traps the focus */
            const nodes = modal.querySelectorAll('*')
            const tabbable = Array.from(nodes).filter(n => n.tabIndex >= 0)
            let index = tabbable.indexOf(document.activeElement)
            if (index === -1 && e.shiftKey) index = 0
            index += tabbable.length + (e.shiftKey ? -1 : 1)
            index %= tabbable.length
            tabbable[index].focus()
            e.preventDefault()
        }
    }

    /* Focus to the previous element when the modal is destroyed */
    const previously_focused = typeof document !== 'undefined' && document.activeElement
    if (previously_focused) {
        onDestroy(() => {
            previously_focused.focus()
        })
    }
</script>

<svelte:window on:keydown={handle_keydown}/>

<div class="modal-background" style={zIndexStyle}
     on:mousedown|stopPropagation|preventDefault={() => false}
     on:mouseenter|stopPropagation|preventDefault={() => false}
     on:mouseleave|stopPropagation|preventDefault={() => false}
     on:mousemove|stopPropagation|preventDefault={() => false}
     on:mouseup|stopPropagation|preventDefault={() => false}
     on:click={close}>
</div>
<div class="modal" role="dialog" aria-modal="true" style={zIndexStyle}
     on:mousedown|stopPropagation|preventDefault={() => false}
     on:mouseenter|stopPropagation|preventDefault={() => false}
     on:mouseleave|stopPropagation|preventDefault={() => false}
     on:mousemove|stopPropagation|preventDefault={() => false}
     on:mouseup|stopPropagation|preventDefault={() => false}
     bind:this={modal}>
    <TimePicker {options} {date}
                on:cancel={(event) => {
      close()
      dispatch('cancel', event.detail)
    }}
                on:change
                on:ok={(event) => {
      close()
      dispatch('ok', event.detail)
    }} />
</div>

<style>
    .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
    }

    .modal {
        box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);
        left: 50%;
        overflow: auto;
        position: absolute;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>
