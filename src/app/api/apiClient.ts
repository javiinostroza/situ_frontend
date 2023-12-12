'use server'
import axios from 'axios';

const BACKEND_URL = 'http://localhost:3001/'

type Profession = {
    id?: number,
    name: string,
    professionals?: Professional[],
}

type Professional = {
    id?: number,
    email: string,
    name: string,
    profession: Profession | number,
    schedules?: Schedule[],
}

type Schedule = {
    id: number,
    date: Date,
    startHour: number,
    endHour: number,
    available: boolean,
    professional: Professional,
    reserve: Reserve,
}

type Reserve = {
    id: number,
    patient: Patient,
    schedule: Schedule,
}

type Patient = {
    id?: number,
    rut: string,
    reserves?: Reserve[],
}

// Profession

export async function CreateProfession(name: string) {
    const response = await axios.post(BACKEND_URL + 'profession', {'name': name});
    return response.data;
}

export async function GetAllProfessions() {
    const response = await axios.get(BACKEND_URL + 'profession');
    return response.data;
}

export async function GetAProfession(professionId: number) {
    const response = await axios.get(BACKEND_URL + 'profession/' + professionId.toString());
    return response.data;
}

export async function DeleteAProfession(professionId: number) {
    const response = await axios.delete(BACKEND_URL + 'profession/' + professionId.toString());
    return response.data;
}

// Professional

export async function CreateProfessional(data: Professional) {
    const response = await axios.post(BACKEND_URL + 'professional', data);
    return response.data;
}

export async function GetAllProfessionals() {
    const response = await axios.get(BACKEND_URL + 'professional');
    return response.data;
}

export async function GetAProfessional(professionalId: number) {
    const response = await axios.get(BACKEND_URL + 'professional/' + professionalId.toString());
    return response.data;
}

export async function DeleteAProfessional(professionalId: number) {
    const response = await axios.delete(BACKEND_URL + 'professional/' + professionalId.toString());
    return response.data;
}

// Patient

export async function CreatePatient(rut: string) {
    const response = await axios.post(BACKEND_URL + 'patient', { 'rut': rut });
    return response.data;
}

export async function GetAllPatients() {
    const response = await axios.get(BACKEND_URL + 'patient');
    return response.data;
}

export async function GetAPatient(patientId: number) {
    const response = await axios.get(BACKEND_URL + 'patient/' + patientId.toString());
    return response.data;
}

export async function DeleteAPatient(patientId: number) {
    const response = await axios.delete(BACKEND_URL + 'patient/' + patientId.toString());
    return response.data;
}