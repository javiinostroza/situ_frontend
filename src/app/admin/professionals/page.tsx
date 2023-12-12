'use client'
import { useState, useEffect, FormEvent } from "react"
import { GetAllProfessionals, GetAllProfessions, CreateProfessional, DeleteAProfessional } from "@/app/api/apiClient"

type Professional = {
    id: number,
    email: string,
    name: string,
    profession: Profession,
}

type Profession = {
    id: number,
    name: string,
    professionals: Professional[],
}

export default function Professionals() {
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [professions, setProfessions] = useState<Profession[]>([])
    const [modal, setModal] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [profession, setProfession] = useState<Profession>({ id: 0, name: 'Unknown', professionals: [] });

    useEffect (() => {
        async function loadProfessions() {
            const allProfessions = await GetAllProfessions();
            setProfessions(allProfessions)
            const allProfessionals:Professional[] = [];
            for (let index = 0; index < allProfessions.length; index++){
                allProfessionals.push(...allProfessions[index].professionals)
            }
            setProfessionals(allProfessionals)
        }
        loadProfessions()
    }, [])

    async function handleDelete(id: number) {
        const response = await DeleteAProfessional(id)
        setProfessionals(response);
    }

    async function saveProfessional(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const response = await CreateProfessional({ 'email': email, 'name': name, 'profession': profession})
        if (response) {
            setModal(false);
            const newList = [...professionals, response];
            setProfessionals(newList);
        }
    }

    function loadProfession(id: string) {
        const professionFound = professions.find(
            (profession_: Profession) => profession_.id == parseInt(id)
        )
        professionFound ? setProfession(professionFound) : null;
    }

    return (
        <>
            <div className="justify-center items-center mx-auto my-20 max-w-sm">
                <p className="text-center text-xl">Profesionales</p>
            </div>
            <div className="table-container">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-m text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Id Profesional
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nombre
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Profesión
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {professionals.map((professional: Professional, index: number) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {professional.id}
                                </td>
                                <td className="px-6 py-4">
                                    {professional.name}
                                </td>
                                <td className="px-6 py-4">
                                    {professional.profession?.name}
                                </td>
                                <td className="px-6 py-4">
                                    {professional.email}
                                </td>
                                <td>
                                    <button 
                                        className="text-white bg-[#E3150B] p-1 px-2 my-6 rounded-2xl"
                                        onClick={() => handleDelete(professional.id)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="justify-center mx-auto w-60">
                <button 
                    className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center"
                    onClick={ () => setModal(!modal) }
                >
                    Agregar Profesional
                </button>
            </div>
            {modal ? (
                <>
                <div
                    className="justify-center items-center flex fixed inset-0 mx-auto z-50 outline-none max-w-6xl rounded-lg"
                >
                    <div className="relative my-6 mx-auto w-full max-w-sm p-4 m-auto bg-white border  rounded-lg shadow sm:p-6 md:p-8">
                        <div className="flex flex-col items-center justify-between p-5 border-slate-200 rounded-t">
                            <div className="mb-10 text-xl font-medium text-gray-900">
                                {'Agregar Profesional'}
                            </div>
                            <form className="space-y-4 md:space-y-6" onSubmit={(e) => saveProfessional(e)}>
                                <div>
                                    <label className="block my-2 text-m font-medium">Nombre</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setName(e.target.value)}
                                        className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5" 
                                        placeholder="Juan Pérez" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block my-2 text-m font-medium">Email</label>
                                    <input 
                                        type="email" 
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5" 
                                        placeholder="juanperez@email.com" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="block my-2 text-m font-medium">Profesión</label>
                                    <select 
                                        className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-20"
                                        onChange={(e) => loadProfession(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione Profesión</option> 
                                        {professions.map((profession: Profession) => (
                                            <option key={profession.id} value={profession.id}>{ profession.name }</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-row">
                                    <button 
                                        type="submit"
                                        className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center mr-1"
                                    >
                                        Agregar
                                    </button>
                                    <button 
                                        className="w-full bg-[#E3150B] hover:bg-[#d46862] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center ml-1"
                                        onClick={() => setModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
            </>
            ) : null}
            
        </>
    )
};