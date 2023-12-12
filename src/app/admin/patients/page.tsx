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
            <div className="justify-center items-center mx-auto my-20 max-w-sm">
                <p className="text-center text-xl">Pacientes</p>
            </div>
            <div className="table-container">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-m text-gray-700 uppercase bg-gray-50">
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
                                        className="text-white bg-[#E3150B] p-1 px-2 my-6 rounded-2xl"
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
                    className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center"
                    onClick={ () => setModal(!modal) }
                >
                    Agregar Paciente
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
                                {'Agregar Paciente'}
                            </div>
                            <form className="space-y-4 md:space-y-6" onSubmit={(e) => savePatient(e)}>
                                <div>
                                    <label className="block my-2 text-m font-medium">RUT Paciente</label>
                                    <input 
                                        type="text" 
                                        onChange={(e) => setRut(e.target.value)}
                                        className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-20" 
                                        placeholder="12345678-9" 
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