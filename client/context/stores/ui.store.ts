import { persistentMap } from '@nanostores/persistent'
import { storeDecode, storeEncode } from '#/utils/helper'
import pkg from '~~/package.json' with { type: 'json' }

type Theme = 'dark' | 'light' | 'system'
type SidebarState = 'expanded' | 'collapsed'

type UIStore = {
  global: {
    theme: Theme
    sidebar: SidebarState
  }
  'sql-console': {
    left: {
      position: number
      visible: boolean
    }
    bottom: {
      position: number
      visible: boolean
    }
  }
  'table-editor': {
    left: {
      position: number
      visible: boolean
    }
  }
  'functions-editor': {
    left: {
      position: number
      visible: boolean
    }
  }
  'media-library': {
    viewMode: 'grid' | 'list'
  }
}

/**
 * The default values for the UI store, which includes the initial state of the sidebar.
 */
const defaultUIStoreValues: UIStore = {
  global: {
    theme: 'system',
    sidebar: 'collapsed',
  },
  'sql-console': {
    left: {
      position: 250,
      visible: true,
    },
    bottom: {
      position: 450,
      visible: true,
    },
  },
  'table-editor': {
    left: {
      position: 250,
      visible: true,
    },
  },
  'functions-editor': {
    left: {
      position: 250,
      visible: true,
    },
  },
  'media-library': {
    viewMode: 'grid',
  },
}

/**
 * A persistent map store for the UI state, with the default values for the sidebar state.
 * Using key-value map store. It will keep each key in separated localStorage key.
 * You can switch localStorage to any other storage for all used stores.
 * @ref: https://github.com/nanostores/persistent#persistent-engines
 */
const uiStore = persistentMap<UIStore>(`${pkg.name}_ui:`, defaultUIStoreValues, {
  encode: storeEncode,
  decode: storeDecode,
})

/**
 * Saves the current UI state by merging the provided partial UI store values with the
 * existing values. Deep merges partial UI store values with the existing state.
 * @param values - A partial object of the UI store values to be merged with the existing state.
 */
function saveUiState<K extends keyof UIStore>(key: K, values: Partial<UIStore[K]>) {
  const currentState = uiStore.get()
  uiStore.set({
    ...currentState,
    [key]: {
      ...currentState[key],
      ...values,
    },
  })
}

/**
 * Resets the UI store to its default values, which includes setting the sidebar state to 'expanded'.
 */
function resetUiState() {
  uiStore.set(defaultUIStoreValues)
}

export { uiStore, defaultUIStoreValues, saveUiState, resetUiState }
export type { Theme, UIStore, SidebarState }
