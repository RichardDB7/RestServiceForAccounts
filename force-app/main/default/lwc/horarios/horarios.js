import { LightningElement, api, track } from 'lwc';

const DIAS = [
    { diaNombre: 'Hora', style: 'left: 0vw; width: 6vw'},
    { diaNombre: 'Lunes', style: 'left: 6vw;'},
    { diaNombre: 'Martes', style: 'left: 18vw;'},
    { diaNombre: 'Miércoles', style: 'left: 30vw;'},
    { diaNombre: 'Jueves', style: 'left: 42vw;'},
    { diaNombre: 'Viernes', style: 'left: 54vw;'},
    { diaNombre: 'Sábado', style: 'left: 66vw;'},
];

export default class Horarios extends LightningElement {

    @api horarios = []; 
    @track spinnerVisible = false;
    @track selectedHorarios;
    @track detail;
    @track detailVisible = false;
    periodoDefault;
    dias = DIAS;

    connectedCallback() {
        console.log('Horarios recibidos en el componente hijo:', this.horarios);
        this.spinnerVisible = true;
        this.loadHorarios();
    }

    loadHorarios() {
        if (this.horarios && this.horarios.length > 0) {
            this.periodoDefault = this.horarios[0].periodo;
            this.selectedHorarios = this.horarios[0].datosHorario;
            this.spinnerVisible = false;
        } else {
            console.log('No se encontraron horarios, mostrando datos simulados');
            this.simularHorarios(); 
        }
    }

    simularHorarios() {
        this.horarios = [{
            periodo: 'Simulado - 2024-1',
            horas: [
                { horario: '08:00 - 09:00', style: 'top: 0px;' },
                { horario: '09:00 - 10:00', style: 'top: 50px;' },
                { horario: '10:00 - 11:00', style: 'top: 100px;' }
            ],
            datosHorario: [
                { curso: 'Curso Simulado 1', horaInicio: '08:00', horaFin: '09:00', docente: 'Docente Simulado', ambiente: 'Aula 101', modalidad: 'Presencial', style: 'top: 0px; left: 6vw;' },
                { curso: 'Curso Simulado 2', horaInicio: '09:00', horaFin: '10:00', docente: 'Docente Simulado', ambiente: 'Aula 102', modalidad: 'Presencial', style: 'top: 50px; left: 18vw;' }
            ]
        }];
        this.periodoDefault = this.horarios[0].periodo;
        this.selectedHorarios = this.horarios[0].datosHorario;
        this.spinnerVisible = false;
    }

    changeTab() {
        this.detailVisible = false;
        let selectedPeriodo = this.template.querySelector('lightning-tabset').activeTabValue;
        let selected = this.horarios.find(periodo => periodo.periodo == selectedPeriodo);
        this.selectedHorarios = selected ? selected.datosHorario : [];
    }

    showDetail(event) {
        let dataId = event.target.getAttribute('data-id');
        this.detail = this.selectedHorarios.find(horario => horario.curso == dataId);
        this.detailVisible = true;
    }

    close() {
        this.dispatchEvent(new CustomEvent('hideme'));
    }
}
