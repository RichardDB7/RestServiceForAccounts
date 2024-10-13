import { LightningElement, api, track } from 'lwc';
import getAsistencias from '@salesforce/apex/IL_GetDataAssistanceSMART.getAsistencias';

const COLUMNS = [
    { label: 'Curso', fieldName: 'curso', type: 'text' },
    { label: 'Docente', fieldName: 'docente', type: 'text' },
    { label: 'Asistencias', fieldName: 'asistencia', type: 'number', initialWidth: 120 },
    { label: 'Inasistencias', fieldName: 'inasistencia', type: 'number', initialWidth: 120 },
    { label: 'Fecha inasistencia', fieldName: 'fechaInasistencia', type: 'text' }
];

export default class Asistencias extends LightningElement {
    @api dni;
    @api institucion; 
    @track asistencias = [];
    periodoDefault;
    columns = COLUMNS;
    spinnerVisible = false;

    connectedCallback() {
        this.spinnerVisible = true;
        this.loadAsistencias();
    }

    loadAsistencias() {
        getAsistencias({ dni: this.dni, idunidadnegocio: this.institucion })
            .then((result) => {
                if (result.message === 'Éxito') {
                    if (result.results && result.results.length > 0) {
                        let asistenciasPlanas = [];
                        result.results.forEach(division => {
                            if (division.datosAsistencia && division.datosAsistencia.length > 0) {
                                asistenciasPlanas = asistenciasPlanas.concat(division.datosAsistencia);
                            }
                        });
                        
                        this.asistencias = asistenciasPlanas;
                        this.periodoDefault = result.results[0].periodo;  
                    } else {
                        this.simularAsistencias(); 
                    }
                } else {
                    console.error('Error en el resultado de la llamada Apex:', result.messagePublic);
                    this.simularAsistencias(); 
                }
                this.spinnerVisible = false;
            })
            .catch((error) => {
                console.error('Error en el llamado Apex: ', error);
                this.simularAsistencias(); 
                this.spinnerVisible = false;
            });
    }
    
    

    simularAsistencias() {
        console.log('Simulando datos de asistencias debido a error o falta de datos');
        this.asistencias = [
            { curso: 'No se encontraron cursos', docente: 'No se encontro docente', asistencia: '-', inasistencia: '-', fechaInasistencia: '--/--/----' },
            { curso: 'No se encontraron cursos', docente: 'No se encontro docente', asistencia: '-', inasistencia: '-', fechaInasistencia: '--/--/----' }
        ];
        this.periodoDefault = 'Simulado - 2024-1';
    }
    

    close() {
        this.dispatchEvent(new CustomEvent('hideme'));
    }
}
