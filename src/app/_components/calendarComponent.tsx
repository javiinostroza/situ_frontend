'use client'
import { useState, useEffect } from "react";
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

export default function CalendarComponent( props: { userType: number} ) { // 0 professional, 1 patient
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
                            right: 'dayGridMonth, timeGridWeek'
                        }}
                        events={ events }
                        nowIndicator={ true }
                        editable={ true }
                        droppable={ false }
                        selectable={ true }
                        selectMirror={ false }
                        dateClick={ (e) => handleDateClick(e) }
                        eventClick={(data) => showEventModal(data)}
                    />
                </div>
                {scheduleModal ? (
                    <>
                        <div className="modal-container">
                            <div className="modal-box">
                                <div className="flex-modal">
                                    <div className="modal-title mb-10">{ 'Agregar Disponibilidad' }</div>
                                    <form className="modal-content" onSubmit={() => saveSchedule()}>
                                        <div>
                                            <label className="form-label">Identificación</label>
                                            <select 
                                                className="form-input mb-2"
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
                                            <label className="form-label">Inicio Turno</label>
                                            <select 
                                                className="form-input mb-2"
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
                                            <label className="form-label">Fin Turno</label>
                                            <select 
                                                className="form-input mb-20"
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
                                                className="full-btn bg-[#0B7EE3] hover:bg-[#36658E] mr-1"
                                            >
                                                Agendar
                                            </button>
                                            <button 
                                                className="full-btn bg-[#E3150B] hover:bg-[#d46862] ml-1"
                                                onClick={() => setScheduleModal(false)}
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
                ): null}
                {showModal? (
                    <>
                        <div className="modal-container">
                            <div className="modal-box">
                                <div className="flex-modal">
                                    <div className="modal-title mb-2">
                                        {infoShowModal.profession}
                                    </div>
                                    <div className="mb-10 text-2xl font-medium text-gray-900">
                                        {infoShowModal.professional}
                                    </div>
                                    <div className="modal-content">
                                        <div>
                                            <div className="form-label text-center">Inicio Turno</div>
                                            <div className="form-input text-center">{ infoShowModal.startHour }:00</div>
                                        </div>
                                        <div>
                                            <div className="form-label text-center">Fin Turno</div>
                                            <div className="form-input text-center">{ infoShowModal.endHour }:00</div>
                                        </div>
                                        <div className="flex flex-row">
                                            <button 
                                                className="full-btn bg-[#E3150B] hover:bg-[#d46862] ml-1"
                                                onClick={() => setShowModal(false)}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-opacity"></div>
                    </>
                    
                ): null}
            </div>
        </>
    )
};