<script>
    import TimePickerModal from './TimePickerModal.svelte'
    import { fade } from 'svelte/transition'
    import {startDateStore} from "../../stores/userInput";

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
        bgColor: '#2f855a',
        /* Components styles */
        buttonClassName: 'modal-button',
        buttonBarClassName: 'modal-bar',
        timeClassName: 'modal-time',
        /* Options */
        hasButtons: true,
        zIndex: 200
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