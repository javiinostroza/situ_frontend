import Link from 'next/link'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <nav className="logged-nav">
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-xl lg:flex-grow">
                        <Link href="/" className="nav-item">
                            Inicio
                        </Link>
                        <Link href="/admin/patients" className="nav-item">
                            Pacientes
                        </Link>
                        <Link href="/admin/professionals" className="nav-item">
                            Profesionales
                        </Link>
                        
                        <Link href="/admin/professions" className="nav-item">
                            Profesiones
                        </Link>
                    </div>
                </div>
            </nav>
            { children }
        </div>
    )
}
