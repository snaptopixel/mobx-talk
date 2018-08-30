import {init as initReact} from './react'
import {init as initAngular} from './angular'
import {init as initVue} from './vue'

import { AppState } from './state'

const state = new AppState();

initReact(document.getElementById('react') as HTMLElement, state);
initAngular(document.getElementById('angular') as HTMLElement, state);
initVue(document.getElementById('vue') as HTMLElement, state);