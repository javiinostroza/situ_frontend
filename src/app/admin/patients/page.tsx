'use client'
import { useState, useEffect, FormEvent } from "react"
import { GetAllPatients, CreatePatient, DeleteAPatient } from "@/app/api/apiClient"

type patientProps = {
    id: number,
    rut: string,
}

export default function Patients() {
    const [patients, setPatients] = useState<patientProps[]>([])
    const [modal, setModal] = useState(false);
    const [rut, setRut] = useState('');

    useEffect (() => {
        async function loadPatients() {
            const allPatients = await GetAllPatients();
            setPatients(allPatients)
        }
        loadPatients()
    }, [])

    async function handleDelete(id: number) {
        const response = await DeleteAPatient(id)
        setPatients(response);
        
    }

    async function savePatient(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const response = await CreatePatient(rut)
        if (response) {
            setModal(false);
            const newList = [...patients, response];
            setPatients(newList);

        }
    }

    return (
        <>
            <div className="title-container">
                <p className="title">Pacientes</p>
            </div>
            <div className="table-container">
                <table className="full-table">
                    <thead className="head-table">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Id Paciente
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Rut
                            </th>
                            <th scope="col" className="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient: patientProps, index: number) => (
                            <tr className="bg-white border-b hover:bg-gray-50" key={index}>
                                <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {patient.id}
                                </td>
                                <td className="px-6 py-4">
                                    {patient.rut}
                                </td>
                                <td>
                                    <button 
                                        className="delete-btn"
                                        onClick={() => handleDelete(patient.id)}
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
                    onClick={() => setModal(!modal)}
                >
                    Agregar Paciente
                </button>
            </div>
            {modal ? (
                <>
                <div className="modal-container">
                    <div className="modal-box">
                        <div className="flex-modal">
                            <div className="mb-20 modal-title">{ 'Agregar Paciente' }</div>
                            <form className="modal-content" onSubmit={(e) => savePatient(e)}>
                                <div>
                                    <label className="form-label">RUT Paciente</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setRut(e.target.value)}
                                        className="form-input mb-20" 
                                        placeholder="12345678-9" 
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