import { cn } from '@/lib/utils'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {}

export const TypographyH1: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h1
      className={cn(
        'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export const TypographyH2: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export const TypographyH3: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3
      className={cn(
        'scroll-m-20 text-2xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export const TypographyH4: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h4
      className={cn(
        'scroll-m-20 text-xl font-semibold tracking-tight',
        className,
      )}
      {...props}
    >
      {children}
    </h4>
  )
}

export const TypographyP: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export const TypographyBlockquote: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    >
      {children}
    </blockquote>
  )
}

export const TypographyInlineCode: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
        className,
      )}
      {...props}
    >
      {children}
    </code>
  )
}

export const TypographyLead: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn('text-xl text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}

export const TypographyLarge: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn('text-lg font-semibold', className)} {...props}>
      {children}
    </div>
  )
}

export const TypographySmall: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <small
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    >
      {children}
    </small>
  )
}

export const TypographyMuted: React.FC<TypographyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </p>
  )
}
