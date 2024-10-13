import { LightningElement, api, track } from 'lwc';
import getNotas from '@salesforce/apex/IL_GetDataNoteSMART.getDatosNotas'; 

const COLUMNS = [
    { label: 'Curso', fieldName: 'Curso', type: 'text', initialWidth: 300 },
    { label: 'Docente', fieldName: 'Docente', type: 'text', initialWidth: 300 },
    { label: 'Promedio General', fieldName: 'PromedioGeneral', type: 'number' },
    { label: 'Trabajo Final', fieldName: 'TRABAJO_FINAL_DEL_MODULO', type: 'Text' },
    { label: 'Promedio Curso', fieldName: 'PromedioCurso', type: 'text' },
    { label: 'Evaluación Continua', fieldName: 'EVALUACIÓN CONTINUA.', type: 'text' }, 
    { label: 'Evaluación Final', fieldName: 'EVALUACIÓN FINAL', type: 'text' }
];    



export default class Notas extends LightningElement {
    @api dni; 
    @api institucion; 
    @api idUnidadNegocio; 
    

    @api notas = []; 
    columns = COLUMNS;
    spinnerVisible = false;

    connectedCallback() {
        this.spinnerVisible = true;
        this.loadNotas();
    }

    renderedCallback() {
        if (!this.renderedOnce) {
            console.log('Notas recibidas en el componente hijo:', JSON.stringify(this.notas));
            this.renderedOnce = true; 
        }
    }
    
    loadNotas() {
        console.log('Valor de idUnidadNegocio:', this.idUnidadNegocio);
        let params = { dni: this.dni };
        
        if (this.idUnidadNegocio && this.idUnidadNegocio !== 'null' && this.idUnidadNegocio !== 'undefined') {
            params.idunidadnegocio = this.idUnidadNegocio;
        }
    
        console.log('Parámetros enviados a Apex:', params);
    
        getNotas(params)
            .then((result) => {
                console.log('Datos de notas recibidos:', result);
                if (result && result.message === 'Éxito' && result.results) {
                    this.mapearDatos(result.results); 
                } else {
                    console.error('Error al obtener las notas: ', result ? result.message : 'Respuesta vacía');
                    //this.simularDatos(); 
                }
                this.spinnerVisible = false;
            })
            .catch((error) => {
                console.error('Error en el llamado Apex: ', error);
                //this.simularDatos(); 
                this.spinnerVisible = false;
            });
    }
    
    

    mapearDatos(results) {
        this.notas = results.map(periodo => ({
            periodo: periodo.periodo,
            OrdenMerito: periodo.OrdenMerito,
            OrdenMerito: (periodo.OrdenMerito === null || periodo.OrdenMerito === undefined || periodo.OrdenMerito === 0) ? 'No se encontró información' : periodo.OrdenMerito,
            datosNota: periodo.datosNota.map(nota => ({
                Curso: nota.Curso || 'N/A',
                Docente: nota.Docente || 'N/A',
                PromedioGeneral: nota.PromedioGeneral || 0,
                TAREA_ACADEMICA_I: nota.TAREA_ACADEMICA_I || 0,
                TAREA_ACADEMICA_II: nota.TAREA_ACADEMICA_II || 0,
                TAREA_ACADEMICA_III: nota.TAREA_ACADEMICA_III || 0,
                TRABAJO_FINAL_DEL_MODULO: nota.TRABAJO_FINAL_DEL_MODULO || 0,
                PRACTICA_CALIFICADA: nota.PRACTICA_CALIFICADA || 0,
                'EVALUACIÓN CONTINUA.': nota['EVALUACIÓN CONTINUA.'] || 'N/A', 
                'EVALUACIÓN FINAL': nota['EVALUACIÓN FINAL'] || 'N/A'
            }))
        }));
        this.notas = [...this.notas];
        console.log('Datos mapeados para la tabla:', JSON.stringify(this.notas));
    }
    
    
    
    

    simularDatos() {
        this.notas = [
            {
                Curso: 'El Alumno no posee cursos',
                Docente: '----',
                PromedioGeneral: '--',
                TAREA_ACADEMICA_I: '--',
                TAREA_ACADEMICA_II: '--',
                TAREA_ACADEMICA_III: '--',
                TRABAJO_FINAL_DEL_MODULO: '--',
                PRACTICA_CALIFICADA: '--'
            },
            // {
            //     Curso: 'Curso Simulado 2',
            //     Docente: 'Docente Simulado 2',
            //     PromedioGeneral: 16.0,
            //     TAREA_ACADEMICA_I: 16,
            //     TAREA_ACADEMICA_II: 17,
            //     TAREA_ACADEMICA_III: 18,
            //     TRABAJO_FINAL_DEL_MODULO: 16,
            //     PRACTICA_CALIFICADA: 17
            // }
        ];
    }

    close() {
        this.dispatchEvent(new CustomEvent('hideme'));
    }
}
