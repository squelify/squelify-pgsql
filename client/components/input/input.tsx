import * as Lucide from 'lucide-react'
import * as React from 'react'
import { type InputStyles, inputStyles } from './input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, InputStyles {
  containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, containerClassName, hasError, enableStepper = true, type, ...props }: InputProps,
    forwardedRef
  ) => {
    const [typeState, setTypeState] = React.useState(type)
    const isPassword = type === 'password'
    const isSearch = type === 'search'
    const styles = inputStyles({ isSearch, isPassword, hasError, enableStepper })

    return (
      <div className={styles.container({ className: containerClassName })}>
        <input
          ref={forwardedRef}
          type={isPassword ? typeState : type}
          className={styles.input({ className })}
          {...props}
        />
        {isSearch && (
          <div className={styles.leftIconContainer()}>
            <Lucide.Search className={styles.leftIcon()} aria-hidden="true" />
          </div>
        )}
        {isPassword && (
          <div className={styles.passwordContainer()}>
            <button
              type="button"
              aria-label="Change password visibility"
              className={styles.passwordButton()}
              onClick={() => setTypeState(typeState === 'password' ? 'text' : 'password')}
            >
              <span className="sr-only">
                {typeState === 'password' ? 'Show password' : 'Hide password'}
              </span>
              {typeState === 'password' ? (
                <Lucide.Eye aria-hidden="true" className={styles.passwordIcon()} />
              ) : (
                <Lucide.EyeOff aria-hidden="true" className={styles.passwordIcon()} />
              )}
            </button>
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input, type InputProps }
