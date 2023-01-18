import { createApp} from 'vue'
import App from '../vue/App.vue'

createApp({
    components: {App}
}).mount('#app')

// document.querySelector('.toggle').addEventListener('click', () => {
//     let panel = document.querySelector('.panel')
//
//     if(panel.classList.contains('hide')) {
//         panel.classList.remove('hide')
//     } else {
//         panel.classList.add('hide')
//     }
// })