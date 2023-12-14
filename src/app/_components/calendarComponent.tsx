'use client'
import { useState, useEffect, useCallback } from "react";
import { DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';
import { GetAllProfessionals, GetAllProfessions, CreateSchedule } from "../api/apiClient";
import { EventClickArg } from "@fullcalendar/core/index.js";

type Event = {
    professional: string,
    profession: string,
    available?: boolean,
    professionalId: number,
    professionId: number,
    patientId?: number,
    date: Date | string,
    startHour: number,
    endHour: number,
    title: string,
}

type User = {
    type: number, // 0 professional, 1 patient
    id: number, // id in database
    stringId: string // name+profession for professional, rut for patient
    name?: string
    profession?: string
    rut?: string
}

type Profession = {
    id?: number,
    name: string,
    professionals?: Professional[],
}

type Schedule = {
    id: number,
    date: Date,
    startHour: number,
    endHour: number,
    available: boolean,
    professional: Professional,
}

type Professional = {
    id: number,
    email: string,
    name: string,
    profession: Profession | number,
    schedules?: Schedule[],
}

export default function CalendarComponent( props: { userType: number} ) { // 0 professional, 1 
    const [scheduleModal, setScheduleModal] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [professionalData, setProfessionalData] = useState<{ [key: string]: Event }>({});
    const [userProfession, setUserProfession] = useState('');
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState<number>(0);
    const [userProfessionId, setUserProfesionId] = useState(0);
    const [startSchedule, setStartSchedule] = useState(0);
    const [endSchedule, setEndSchedule] = useState(24);
    const [selectedDate, setSelectedDate] = useState("");
    const [infoShowModal, setInfoShowModal] = useState({
        profession: '',
        professional: '',
        startHour: '',
        endHour: '',
    })

    useEffect(() => {
        async function fillData() {
            const allProfessions = await GetAllProfessions();
            const allProfessionals = await GetAllProfessionals();
            setProfessionals(allProfessionals);
            const dbEvents: Event[] = [];
            let professionalData: { [key: string]: Event } = {};
            for (let index = 0; index < allProfessions.length; index ++) {
                const profession = allProfessions[index];
                for (let i = 0; i < profession.professionals.length; i++) {
                    const professional = profession.professionals[i]
                    professionalData[professional.id] = {
                        professional: professional.name,
                        profession: profession.name,
                        professionalId: professional.id,
                        professionId: profession.id,
                        title: profession.name,
                        date: '',
                        startHour: 0,
                        endHour: 0,
                    }
                }
            }
            setProfessionalData(professionalData);
            for (let i = 0; i < allProfessionals.length; i++ ) {
                const professional = allProfessionals[i]
                for (let j = 0; j < professional.schedules.length; j ++) {
                    const professionalEvent = professional.schedules[j]
                    const professionalObj = JSON.parse(JSON.stringify(professionalData[professional.id]));
                    professionalObj.date = professionalEvent.date
                    professionalObj.startHour = professionalEvent.startHour
                    professionalObj.endHour = professionalEvent.endHour
                    dbEvents.push(professionalObj)
                }
            }
            setEvents(dbEvents);
        }
        fillData();       
    }, [])

    function handleDateClick(e: DateClickArg) {
        if (props.userType === 0) {
            setSelectedDate(e.dateStr);
            setScheduleModal(true);
        }
    }

    function loadProfessional(e: string) {
        setUserName(professionalData[e].professional)
        setUserProfession(professionalData[e].profession)
        setUserId(professionalData[e].professionalId);
        setUserProfesionId(professionalData[e].professionId);
    }

    async function saveSchedule() {
        await CreateSchedule(selectedDate, startSchedule, endSchedule, userId);
        const schedule = { 
            title: userProfession,
            date: selectedDate,
            professional: userName,
            profession: userProfession,
            available: true,
            professionalId: userId,
            professionId: userProfessionId,
            startHour: startSchedule,
            endHour: endSchedule,
        }
        setEvents([... events, schedule]);
        setScheduleModal(false)
    }

    function showEventModal(data: EventClickArg) {
        console.log(data.event._def.extendedProps);
        setInfoShowModal({
            profession: data.event._def.extendedProps.profession,
            professional: data.event._def.extendedProps.professional,
            startHour: data.event._def.extendedProps.startHour.toString(),
            endHour: data.event._def.extendedProps.endHour.toString(),
        })
        setShowModal(true);
    }

    return (
        <>
            <div className="container mx-auto mt-10">
                <div className="wrapper bg-white rounded shadow w-full ">
                        <FullCalendar 
                            plugins={ [dayGridPlugin, interactionPlugin, timeGridPlugin] }
                            headerToolbar={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'resourceTimelineWeek, dayGridMonth, timeGridWeek'
                            }}
                            events={ events }
                            nowIndicator={ true }
                            editable={ true }
                            droppable={ true }
                            selectable={ true }
                            selectMirror={ true }
                            dateClick={ (e) => handleDateClick(e) }
                            eventClick={(data) => showEventModal(data)}
                        />
                </div>
                {scheduleModal ? (
                    <>
                        <div
                            className="justify-center items-center flex fixed inset-0 mx-auto z-50 outline-none max-w-6xl rounded-lg"
                        >
                        <div className="relative my-6 mx-auto w-full max-w-sm p-4 m-auto bg-white border  rounded-lg shadow sm:p-6 md:p-8">
                            <div className="flex flex-col items-center justify-between p-5 border-slate-200 rounded-t">
                                <div className="mb-10 text-xl font-medium text-gray-900">
                                    {'Agregar Disponibilidad'}
                                </div>
                                <form className="space-y-4 md:space-y-6" onSubmit={() => saveSchedule()}>
                                    <div>
                                        <label className="block my-2 text-m font-medium">Identificación</label>
                                        <select 
                                            className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-20"
                                            onChange={(e) => loadProfessional(e.target.value)}
                                            required
                                        >
                                            <option value="">seleccione un valor</option> 
                                            {professionals.map((professional: Professional) => (
                                                <option 
                                                    key={professional.id} 
                                                    value={professional.id}
                                                >
                                                    { professional.name },
                                                    { professionalData[professional.id].profession }
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block my-2 text-m font-medium">Inicio Turno</label>
                                        <select 
                                            className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-2"
                                            onChange={(e) => setStartSchedule(parseInt(e.target.value))}
                                            required
                                        >
                                            <option value="0">00:00 hrs</option>
                                            <option value="1">01:00 hrs</option>
                                            <option value="2">02:00 hrs</option>
                                            <option value="3">03:00 hrs</option>
                                            <option value="4">04:00 hrs</option>
                                            <option value="5">05:00 hrs</option>
                                            <option value="6">06:00 hrs</option>
                                            <option value="7">07:00 hrs</option>
                                            <option value="8">08:00 hrs</option>
                                            <option value="9">09:00 hrs</option>
                                            <option value="10">10:00 hrs</option>
                                            <option value="11">11:00 hrs</option>
                                            <option value="12">12:00 hrs</option>
                                            <option value="13">13:00 hrs</option>
                                            <option value="14">14:00 hrs</option>
                                            <option value="15">15:00 hrs</option>
                                            <option value="16">16:00 hrs</option>
                                            <option value="17">17:00 hrs</option>
                                            <option value="18">18:00 hrs</option>
                                            <option value="19">19:00 hrs</option>
                                            <option value="20">20:00 hrs</option>
                                            <option value="21">21:00 hrs</option>
                                            <option value="22">22:00 hrs</option>
                                            <option value="23">23:00 hrs</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block my-2 text-m font-medium">Fin Turno</label>
                                        <select 
                                            className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-20"
                                            onChange={(e) => setEndSchedule(parseInt(e.target.value))}
                                            required
                                        >
                                            <option value="24">00:00 hrs</option>
                                            <option value="1">01:00 hrs</option>
                                            <option value="2">02:00 hrs</option>
                                            <option value="3">03:00 hrs</option>
                                            <option value="4">04:00 hrs</option>
                                            <option value="5">05:00 hrs</option>
                                            <option value="6">06:00 hrs</option>
                                            <option value="7">07:00 hrs</option>
                                            <option value="8">08:00 hrs</option>
                                            <option value="9">09:00 hrs</option>
                                            <option value="10">10:00 hrs</option>
                                            <option value="11">11:00 hrs</option>
                                            <option value="12">12:00 hrs</option>
                                            <option value="13">13:00 hrs</option>
                                            <option value="14">14:00 hrs</option>
                                            <option value="15">15:00 hrs</option>
                                            <option value="16">16:00 hrs</option>
                                            <option value="17">17:00 hrs</option>
                                            <option value="18">18:00 hrs</option>
                                            <option value="19">19:00 hrs</option>
                                            <option value="20">20:00 hrs</option>
                                            <option value="21">21:00 hrs</option>
                                            <option value="22">22:00 hrs</option>
                                            <option value="23">23:00 hrs</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-row">
                                        <button 
                                            type="submit"
                                            className="w-full bg-[#0B7EE3] hover:bg-[#36658E] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center mr-1"
                                        >
                                            Agendar
                                        </button>
                                        <button 
                                            className="w-full bg-[#E3150B] hover:bg-[#d46862] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center ml-1"
                                            onClick={() => setScheduleModal(false)}
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
                ): null}
                {showModal? (
                    <>
                        <div
                            className="justify-center items-center flex fixed inset-0 mx-auto z-50 outline-none max-w-6xl rounded-lg"
                        >
                        <div className="relative my-6 mx-auto w-full max-w-sm p-4 m-auto bg-white border  rounded-lg shadow sm:p-6 md:p-8">
                            <div className="flex flex-col items-center justify-between p-5 border-slate-200 rounded-t">
                            <div className=" text-xl mb-2 font-medium text-gray-900">
                                    {infoShowModal.profession}
                                </div>
                                <div className="mb-10 text-2xl font-medium text-gray-900">
                                    {infoShowModal.professional}
                                </div>
                                <div className="space-y-4 md:space-y-6">
                                    <div>
                                        <div className="block my-2 text-m font-medium text-center">Inicio Turno</div>
                                        <div 
                                            className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 text-center"
                                        >
                                            {infoShowModal.startHour}:00
                                        </div>
                                    </div>
                                    <div>
                                        <div className="block my-2 text-m font-medium text-center">Fin Turno</div>
                                        <div 
                                            className="border border-gray-300 sm:text-sm rounded-lg block w-full p-2.5 mb-10 text-center"
                                        >
                                            {infoShowModal.endHour}:00
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <button 
                                            className="w-full bg-[#E3150B] hover:bg-[#d46862] text-white font-medium rounded-lg text-l px-5 py-2.5 text-center ml-1"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Cerrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                    </>
                    
                ): null}
            </div>
            
        </>
    )
};