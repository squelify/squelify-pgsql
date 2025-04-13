/**
 * A custom Link component that extends the functionality of the React Router Link component.
 * It adds support for opening links in a new tab and applies a consistent set of styles.
 *
 * Example usage:
 *
 * ```tsx
 * <Link href="/path" className="custom-class">Internal Page</Link>
 * <Link href="https://example.com" newTab>External Link</Link>
 * ```
 *
 */

import * as React from 'react'
import { Link as RouterLink } from 'react-router'
import type { LinkProps as RouterLinkProps } from 'react-router'
import { clx } from 'twistail-utils'

export interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string
  newTab?: boolean
}

const Link = React.forwardRef(function Component(
  { href, className, newTab, ...rest }: LinkProps & React.ComponentPropsWithoutRef<'a'>,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  const NEW_TAB_REL = 'noopener noreferrer'
  const NEW_TAB_TARGET = '_blank'
  const DEFAULT_TARGET = '_self'

  return (
    <RouterLink
      to={href}
      className={clx(className)}
      target={newTab ? NEW_TAB_TARGET : DEFAULT_TARGET}
      rel={newTab ? NEW_TAB_REL : undefined}
      ref={ref}
      {...rest}
    />
  )
})

export default Link
