import Link from 'next/link'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <nav className="flex flex-row items-center sm:text-left justify-between bg-[#0B7EE3] py-4 px-6">
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-xl lg:flex-grow">
                        <Link href="/admin/patients" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:font-medium mr-8">
                            Pacientes
                        </Link>
                        <Link href="/admin/professionals" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:font-medium mr-8">
                            Profesionales
                        </Link>
                        
                        <Link href="/admin/professions" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:font-medium mr-8">
                            Profesiones
                        </Link>
                        {/* <Link href="/admin/calendar" className="block mt-4 lg:inline-block lg:mt-0 text-white hover:font-medium mr-8">
                            Calendario
                        </Link> */}
                    </div>
                </div>
            </nav>
            { children }
        </div>
    )
}
