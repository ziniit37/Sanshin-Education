export function PageHeader({
  kicker,
  title,
  description,
}: {
  kicker?: string
  title: string
  description?: string
}) {
  return (
    <div className="border-b bg-primary text-primary-foreground">
      <div className="container py-14 md:py-20">
        {kicker ? <p className="mb-2 text-sm font-medium text-gold">{kicker}</p> : null}
        <h1 className="max-w-3xl text-3xl font-extrabold md:text-5xl">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-sm text-primary-foreground/75 md:text-base">{description}</p> : null}
      </div>
    </div>
  )
}
