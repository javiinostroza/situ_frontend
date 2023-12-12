'use client'
import { useState, useEffect, FormEvent } from "react"
import { GetAllProfessions, CreateProfession, DeleteAProfession } from "@/app/api/apiClient"

type professionProps = {
    id: number,
    name: string,
}

export default function Professions() {
    const [professions, setProfessions] = useState<professionProps[]>([])
    const [modal, setModal] = useState(false);
    const [name, setName] = useState('');

    useEffect (() => {
        async function loadProfessions() {
            const allProfessions = await GetAllProfessions();
            setProfessions(allProfessions)
        }
        loadProfessions()
    }, [])

    async function handleDelete(id: number) {
        const response = await DeleteAProfession(id)
        setProfessions(response);
        
    }

    async function saveProfession(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const response = await CreateProfession(name)
        if (response) {
            setModal(false);
            const newList = [...professions, response];
            setProfessions(newList);
        }
    }

    return (
        <>
            <div className="justify-center items-center mx-auto my-20 max-w-sm">
                <p className="text-center text-xl">Profesiones</p>
            </div>
            <div className="table-container">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-m text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Id Profesión
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Nombre Profesión
                            </th>
                            <th scope="col" className="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {professions.map((profession: professionProps, index: number) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {profession.id}
                                </td>
                                <td className="px-6 py-4">
                                    {profession.name}
                                </td>
                                <td>
                                    <button 
                                        className="text-white bg-[#E3150B] p-1 px-2 my-6 rounded-2xl"
                                        onClick={() => handleDelete(profession.id)}
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
                    Agregar Profesión
                </button>
            </div>
            {modal ? (
                <>
                <div
                    className="justify-center items-center flex fixed inset-0 mx-auto z-50 outline-none max-w-6xl rounded-lg"
                >
                    <div className="relative my-6 mx-auto w-full max-w-sm p-4 m-auto bg-white border  rounded-lg shadow sm:p-6 md:p-8">
                        <div className="flex flex-col items-center justify-between p-5 border-slate-200 rounded-t">
                            <div className="mb-20 text-xl font-medium text-gray-900">
                                {'Agregar Profesión'}
                            </div>
                            <form className="space-y-4 md:space-y-6" onSubmit={(e) => saveProfession(e)}>
                                <div>
                                    <label className="block my-2 text-m font-medium">Nombre Profesión</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setName(e.target.value)}
                                        className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-20" 
                                        placeholder="Enfermero(a)" 
                                        required 
                                    />
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