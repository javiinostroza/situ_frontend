'use client'
import { useState, useEffect, FormEvent } from "react"
import { GetAllProfessions, CreateProfessional, DeleteAProfessional } from "@/app/api/apiClient"

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
            <div className="title-container">
                <p className="title">Profesionales</p>
            </div>
            <div className="table-container">
                <table className="full-table">
                    <thead className="head-table">
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
                                        className="delete-btn"
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
                    className="full-btn bg-[#0B7EE3] hover:bg-[#36658E]"
                    onClick={ () => setModal(!modal) }
                >
                    Agregar Profesional
                </button>
            </div>
            {modal ? (
                <>
                <div
                    className="modal-container"
                >
                    <div className="modal-box">
                        <div className="flex-modal">
                            <div className="mb-10 modal-title">{ 'Agregar Profesional' }</div>
                            <form className="modal-content" onSubmit={(e) => saveProfessional(e)}>
                                <div>
                                    <label className="form-label">Nombre</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setName(e.target.value)}
                                        className="form-input" 
                                        placeholder="Juan García" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input 
                                        type="email" 
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input" 
                                        placeholder="juangarcia@email.com" 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Profesión</label>
                                    <select 
                                        className="form-input mb-20"
                                        onChange={(e) => loadProfession(e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccione Profesión</option> 
                                        {professions.map((profession: Profession) => (
                                            <option key={ profession.id } value={ profession.id }>{ profession.name }</option>
                                        ))}
                                    </select>
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