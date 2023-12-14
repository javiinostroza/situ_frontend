'use client'
import Link from "next/link"

export default function Home() {
  return (
    <div 
      className="w-full max-w-sm p-4 m-auto mt-48 bg-white border border-gray-800 rounded-lg shadow sm:p-6 md:p-8"
    >
      <div className="mb-10 text-xl font-medium text-gray-900">SITU</div>
      <div className="mb-10">
        <button 
          className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center"
        >
          <Link href={'/patient'}>Ingresar como Paciente</Link>
        </button>
      </div>
      <div className="mb-10">
        <button 
          className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center"
        >
          <Link href={'/professional'}>Ingresar como Profesional</Link>
        </button>
      </div>
      <div className="mb-10">
        <button 
          className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center"
        >
          <Link href={'/admin/patients'}>Ingresar como Administrador</Link>
        </button>
      </div>
  </div>
  )
}
