import { PropsWithChildren } from "react"

type SectionProps = PropsWithChildren<{
    name?: string
}>

export function Section({ children, name }: SectionProps) {
    return (
        <section
            className="rounded-b-sm bg-slate-50"
        >
            <header className="px-3 py-2 bg-slate-400 rounded-t-sm">
                {name && <h3 className='font-semibold text-lg'>{name}</h3>}
            </header>
            <main>
                {children}
            </main>
        </section>
    )
}