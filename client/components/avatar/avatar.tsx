import { Avatar as AvatarPrimitive } from 'radix-ui'
import * as React from 'react'
import { type AvatarStyles, avatarStyles } from './avatar.css'

const Avatar = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, forwardedRef) => {
  const styles = avatarStyles()
  return (
    <AvatarPrimitive.Root ref={forwardedRef} className={styles.root({ className })} {...props} />
  )
})

const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, forwardedRef) => {
  const styles = avatarStyles()
  return (
    <AvatarPrimitive.Image ref={forwardedRef} className={styles.image({ className })} {...props} />
  )
})

const AvatarFallback = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, forwardedRef) => {
  const styles = avatarStyles()
  return (
    <AvatarPrimitive.Fallback
      ref={forwardedRef}
      className={styles.fallback({ className })}
      {...props}
    />
  )
})

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement>, AvatarStyles {
  max?: number
  showCount?: boolean
  overlap?: boolean
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, showCount = true, overlap = true, ...props }, forwardedRef) => {
    const styles = avatarStyles()
    const childrenArray = React.Children.toArray(children)
    const totalAvatars = childrenArray.length
    const displayAvatars = max ? childrenArray.slice(0, max) : childrenArray
    const remainingCount = max && totalAvatars > max ? totalAvatars - max : 0

    return (
      <div ref={forwardedRef} className={styles.group({ className, overlap })} {...props}>
        {displayAvatars}
        {showCount && remainingCount > 0 && (
          <Avatar className={styles.groupItem()}>
            <AvatarFallback>+{remainingCount}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  }
)

Avatar.displayName = AvatarPrimitive.Root.displayName
AvatarImage.displayName = AvatarPrimitive.Image.displayName
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName
AvatarGroup.displayName = 'AvatarGroup'

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup }
