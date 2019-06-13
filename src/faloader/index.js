import Vue from 'vue'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import { faUserCircle, faEdit, faSearch, faLifeRing, faSort, faArrowUp, faArrowDown, faChevronLeft, faChevronRight, faSortAlphaDown, faSortAlphaUp, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

library.add(
  faUserCircle,
  faEdit,
  faSearch,
  faLifeRing,
  faSort,
  faArrowUp,
  faArrowDown,
  faChevronLeft,
  faChevronRight,
  faSortAlphaDown,
  faSortAlphaUp,
  faSignOutAlt
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

dom.watch() // This will kick of the initial replacement of i to svg tags and configure a MutationObserver
