/**
 * Split Pane component for resizable panels
 *
 * This component allows creating resizable panels with persistent state.
 */

import { SplitPane } from './split-pane'
import { useSplitPane } from './use-split-pane'

// Re-export everything
export { SplitPane, useSplitPane }
export type { SplitPaneProps } from './split-pane'
export type { SplitPaneState, UseSplitPaneProps, SeparatorProps } from './split-pane-utils'

export * from './split-pane.css'
