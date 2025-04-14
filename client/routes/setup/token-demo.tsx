interface DemoTokensProps {
  setToken: (token: string | null) => void
}

export default function DemoTokens({ setToken }: DemoTokensProps) {
  return (
    <div className="mt-4 text-center text-muted-foreground text-xs">
      <p>Demo valid setup token:</p>
      <code
        className="mt-1 block cursor-pointer rounded bg-muted p-1 hover:text-primary-foreground"
        onClick={() => setToken('123e4567-e89b-12d3-a456-426614174099')}
      >
        ?token=123e4567-e89b-12d3-a456-426614174099
      </code>
      <p className="mt-2">Demo invalid token:</p>
      <code
        className="mt-1 block cursor-pointer rounded bg-muted p-1 hover:text-primary-foreground"
        onClick={() => setToken('123e4567-e89b-12d3-a456-426614174003')}
      >
        ?token=123e4567-e89b-12d3-a456-426614174003
      </code>
      <p className="mt-2">Demo empty token:</p>
      <code
        className="mt-1 block cursor-pointer rounded bg-muted p-1 hover:text-primary-foreground"
        onClick={() => setToken(null)}
      >
        ?token=
      </code>
    </div>
  )
}
