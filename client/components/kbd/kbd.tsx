import * as React from 'react'
import { type KbdStyles, kbdStyles } from './kbd.css'

type KbdKey =
  | 'command'
  | 'shift'
  | 'ctrl'
  | 'option'
  | 'enter'
  | 'delete'
  | 'escape'
  | 'tab'
  | 'capslock'
  | 'up'
  | 'right'
  | 'down'
  | 'left'
  | 'pageup'
  | 'pagedown'
  | 'home'
  | 'end'
  | 'help'
  | 'space'

const kbdKeysMap: Record<KbdKey, string> = {
  command: '⌘',
  shift: '⇧',
  ctrl: '⌃',
  option: '⌥',
  enter: '↵',
  delete: '⌫',
  escape: '⎋',
  tab: '⇥',
  capslock: '⇪',
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
  pageup: '⇞',
  pagedown: '⇟',
  home: '↖',
  end: '↘',
  help: '?',
  space: '␣',
}

const kbdKeysLabelMap: Record<KbdKey, string> = {
  command: 'Command',
  shift: 'Shift',
  ctrl: 'Control',
  option: 'Option',
  enter: 'Enter',
  delete: 'Delete',
  escape: 'Escape',
  tab: 'Tab',
  capslock: 'Caps Lock',
  up: 'Up',
  right: 'Right',
  down: 'Down',
  left: 'Left',
  pageup: 'Page Up',
  pagedown: 'Page Down',
  home: 'Home',
  end: 'End',
  help: 'Help',
  space: 'Space',
}

interface KbdProps
  extends Omit<React.HTMLAttributes<React.ComponentRef<'kbd'>>, 'size'>,
    KbdStyles {
  keys?: KbdKey | KbdKey[]
}

const Key = ({ keyName }: { keyName: KbdKey }) => {
  const isKey = typeof keyName === 'string' && keyName in kbdKeysMap
  return !isKey ? null : <abbr title={kbdKeysLabelMap[keyName]}>{kbdKeysMap[keyName]}</abbr>
}

const Kbd = React.forwardRef<React.ComponentRef<'kbd'>, KbdProps>(
  ({ children, className, keys, size = 'xs', ...otherProps }, forwardedRef) => {
    const renderKeys = () => {
      if (!keys) return null

      if (Array.isArray(keys)) {
        return keys.map((k) => <Key key={k} keyName={k} />)
      }

      return <Key keyName={keys} />
    }

    if ((!keys || keys.length === 0) && !children) return null

    return (
      <kbd ref={forwardedRef} className={kbdStyles({ size, className })} {...otherProps}>
        {renderKeys()}
        {children ? <span>{children}</span> : null}
      </kbd>
    )
  }
)

Kbd.displayName = 'Kbd'

export { Kbd, type KbdProps }
