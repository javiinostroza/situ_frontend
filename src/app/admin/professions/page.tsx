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
            <div className="title-container">
                <p className="title">Profesiones</p>
            </div>
            <div className="table-container">
                <table className="full-table">
                    <thead className="head-table">
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
                                        className="delete-btn"
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
                    className="full-btn bg-[#0B7EE3] hover:bg-[#36658E]"
                    onClick={ () => setModal(!modal) }
                >
                    Agregar Profesión
                </button>
            </div>
            {modal ? (
                <>
                <div className="modal-container">
                    <div className="modal-box">
                        <div className="flex-modal">
                            <div className="mb-20 modal-title">{ 'Agregar Profesión' }</div>
                            <form className="modal-content" onSubmit={(e) => saveProfession(e)}>
                                <div>
                                    <label className="form-label">Nombre Profesión</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-input mb-20" 
                                        placeholder="Enfermero(a)" 
                                        required 
                                    />
                                </div>
                                <div className="flex flex-row">
                                    <button 
                                        type="submit"
                                        className="full-btn bg-[#0B7EE3] hover:bg-[#36658E] mr-1"
                                    >
                                        Agregar
                                    </button>
                                    <button 
                                        className="full-btn bg-[#E3150B] hover:bg-[#d46862] ml-1"
                                        onClick={() => setModal(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="modal-opacity"></div>
            </>
            ) : null}
            
        </>
    )
};