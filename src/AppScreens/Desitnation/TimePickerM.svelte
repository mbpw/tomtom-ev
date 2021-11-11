<script>
    import TimePickerModal from './TimePickerModal.svelte'
    import { fade } from 'svelte/transition'
    import {startDateStore} from "../../stores/userInput";
    import  "../../styles.scss"

    export let showModal

    /* Callbacks */
    let cancelCallback = (event) => {
        let date = event.detail
        // ...
    }
    let changeCallback = (event) => {
        let date = event.detail
        // ...
    }
    let okCallback = (event) => {
        let date = event.detail
        console.log(date);
        $startDateStore = date;
        // ...
    }

    /* Closes this modal */
    function close () {
        showModal = false
    }

    /* The TimePicker options */
    let options = {
        /* Global colors */
        bgColor: '#10C093',
        /* Components styles */
        buttonClassName: 'modal-button',
        /* Options */
        hasButtons: true,
        zIndex: 200,
        is24h: true
    }
</script>

<div transition:fade={ {duration: 300} }>
    <TimePickerModal {options}
                     on:cancel={cancelCallback}
                     on:change={changeCallback}
                     on:ok={okCallback}
                     on:close={close}
    />
</div>