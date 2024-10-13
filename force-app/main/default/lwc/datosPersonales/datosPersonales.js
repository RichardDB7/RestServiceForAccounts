    import { LightningElement, track, api } from 'lwc';
    import { ShowToastEvent } from 'lightning/platformShowToastEvent';


    import getNotas from '@salesforce/apex/IL_GetDataNoteSMART.getDatosNotas';
    //import getAsistencias from '@salesforce/apex/AsistenciasCallout.getAsistencias';
    import getPagos from '@salesforce/apex/IL_GetPaidDataSMART.getPaidData';
    import getHorarios from '@salesforce/apex/HorariosCallout.getHorarios';
    import getDatosPersonales from '@salesforce/apex/IL_GetObtainPersonalDataSMART.getDatosPersonales';
    import getAsistencias from '@salesforce/apex/IL_GetDataAssistanceSMART.getAsistencias';

    export default class DatosPersonales extends LightningElement {


        //@track alumno = null;
        @api dni;
        @api institucion = 'IDAT';
        @api idUnidadNegocio = '2'; 
        
        @track alumno = {};
        @track notas = [];
        @track asistencias = [];
        @track pagos = [];
        @track horarios = [];
        @track notasVisible = false;
        @track asistenciasVisible = false;
        @track pagosVisible = false;
        @track horariosVisible = false;
        @track spinnerVisible = false;
        @track datosVisible = false;

        connectedCallback() {
            this.institucion = 'IDAT';
        }

        changeDNI(event) {
            this.dni = event.detail.value;
            console.log(this.dni);
        }

        async getDatos() {
            if (!this.dni || this.dni.trim() === '') {
                this.showToast('Error', 'Por favor, ingresa un DNI válido.', 'error');
                this.datosVisible = false;
                return;
            }

            this.spinnerVisible = true;
            this.datosVisible = false; 
            console.log('DNI:', this.dni);
            console.log('Institución:', this.institucion);
            
            try {
                const datosPersonales = await getDatosPersonales({ dni: this.dni, idunidadnegocio: '1' });
                //console.log('Respuesta de getDatosPersonales:', JSON.stringify(datosPersonales));
            
                if (datosPersonales && datosPersonales.message === 'Éxito') {
                    this.alumno = datosPersonales.results || {};
                    console.log('Datos del alumno asignados:', this.alumno);
                    //this.idUnidadNegocio = this.alumno.idUnidadNegocio || '2';
                    this.datosVisible = true;
                } else if (datosPersonales && datosPersonales.message === 'NoEncontrado') {
                    this.simularDatosAlumno();
                    this.showToast('Información', 'No se encontraron datos para el DNI proporcionado.', 'warning');
                    this.datosVisible = true;
                } else {
                    this.simularDatosAlumno();
                    this.showToast('Error', 'Ocurrió un error al obtener los datos personales.', 'error');
                    this.datosVisible = true;
                }
            } catch (error) {
                console.error('Error en la llamada a Apex:', error);
                let errorMessage = 'Ocurrió un error al obtener los datos personales.';
                if (error.body && Array.isArray(error.body)) {
                    errorMessage = error.body.map(e => e.message).join(', ');
                } else if (error.body && typeof error.body.message === 'string') {
                    errorMessage = error.body.message;
                }
                this.simularDatosAlumno();
                this.showToast('Error', errorMessage, 'error');
                this.datosVisible = true;
            } finally {
                this.spinnerVisible = false;
            }
            
        }

        simularDatosAlumno() {
            this.alumno = {
                idActor: 'No se ha encontrado Información',
                codigo: 'No se ha encontrado Información',
                nombreCompleto: 'No se ha encontrado Información',
                numeroIdentidad: 'No se ha encontrado Información',
                paterno: 'No se ha encontrado Información',
                materno: 'No se ha encontrado Información',
                nombres: 'No se ha encontrado Información',
                correoPersonal: 'No se ha encontrado Información',
                correoInstitucional: 'No se ha encontrado Información',
                telefono: 'No se ha encontrado Información',
                fechaNacimiento: 'No se ha encontrado Información',
                edad: 'No se ha encontrado Información'
            };
        }

        async getNotas() {
            this.spinnerVisible = true;
            console.log('Obteniendo notas para el DNI:', this.dni);
            console.log('ID Unidad de Negocio:', this.idUnidadNegocio);

            try {
                const datosNota = await getNotas({ dni: this.dni, idunidadnegocio: this.idUnidadNegocio });
                console.log('Datos de notas recibidos:', datosNota);

                if (datosNota.message && datosNota.message === 'Éxito') {
                    if (datosNota.results && datosNota.results.length > 0) {
                        console.log('Resultados obtenidos:', datosNota.results);
                        this.notas = datosNota.results;
                    } else {
                        console.log('No se encontraron resultados, simulando datos');
                        this.simularDatos();
                    }
                } else {
                    console.log('Error en el resultado de la llamada Apex:', datosNota.message);
                    this.simularDatos();
                }
            } catch (error) {
                console.error('Error al obtener las notas:', error);
                this.simularDatos();
            } finally {
                this.spinnerVisible = false;
                this.notasVisible = true;
            }
        }

        simularDatos() {
            console.log('Simulando datos predeterminados debido a error o falta de datos');
            this.notas = [{
                periodo: 'Simulado - 2024-1',
                PromedioGeneral: 'N/A',
                OrdenMerito: 'N/A',
                datosNota: [
                    { Curso: 'Curso Simulado 1', PromedioGeneral: '15.5' },
                    { Curso: 'Curso Simulado 2', PromedioGeneral: '16.0' }
                ]
            }];
        }


        async getAsistencias() {
            this.spinnerVisible = true;
            console.log('Obteniendo asistencias para el DNI:', this.dni);
            console.log('ID Unidad de Negocio::', this.idUnidadNegocio);

                if (!this.dni || !this.idUnidadNegocio) {
                console.error('El DNI o la institución están vacíos o nulos, revisa los valores');
                this.spinnerVisible = false;
                return;  
            }
        
            try {
                const datosAsistencias = await getAsistencias({ dni: this.dni, idunidadnegocio: this.idUnidadNegocio });
                
                console.log('Datos de asistencias recibidos (crudo):', JSON.stringify(datosAsistencias));
        
                if (datosAsistencias === null) {
                    console.error('La respuesta es nula, revisa el método Apex');
                    return;
                }
        
                if (datosAsistencias.message === 'Éxito') {
                    if (Array.isArray(datosAsistencias.results) && datosAsistencias.results.length > 0) {
                        this.asistencias = datosAsistencias.results;
                        console.log('Asistencias obtenidas:', this.asistencias);
                    } else if (typeof datosAsistencias.results === 'object') {
                        this.asistencias = [datosAsistencias.results];
                        console.log('Asistencias obtenidas (convertidas en array):', this.asistencias);
                    } else {
                        console.log('No se encontraron resultados, mostrando datos simulados');
                        this.simularAsistencias();
                    }
                } else {
                    console.log('Error en el resultado de la llamada Apex:', datosAsistencias.message);
                    this.simularAsistencias();
                }
            } catch (error) {
                console.error('Error al obtener las asistencias:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
                this.simularAsistencias();
            } finally {
                this.spinnerVisible = false;
                this.asistenciasVisible = true;
            }
        }
        
        
        
        

        simularAsistencias() {
            console.log('Simulando datos predeterminados de asistencias debido a error o falta de datos');
            this.asistencias = [{
                periodo: 'Simulado - 2024-1',
                datosAsistencia: [
                    { curso: 'Curso Simulado 1', docente: 'Docente Simulado 1', asistencia: 10, inasistencia: 2, fechaInasistencia: '01/10/2024' },
                    { curso: 'Curso Simulado 2', docente: 'Docente Simulado 2', asistencia: 12, inasistencia: 1, fechaInasistencia: '05/10/2024' }
                ]
            }];
        }

        async getPagos() {
            this.spinnerVisible = true;
            console.log('Obteniendo pagos para el DNI:', this.dni);

            try {
                const datosPagos = await getPagos({ dni: this.dni, institucion: this.institucion });
                console.log('Datos de pagos recibidos:', datosPagos);

                if (datosPagos.message && datosPagos.message === 'Éxito') {
                    if (datosPagos.results && datosPagos.results.length > 0) {
                        this.pagos = datosPagos.results;
                    } else {
                        console.log('No se encontraron resultados, simulando datos');
                        this.simularPagos();
                    }
                } else {
                    console.log('Error en el resultado de la llamada Apex:', datosPagos.message);
                    this.simularPagos();
                }
            } catch (error) {
                console.error('Error al obtener los pagos:', error);
                this.simularPagos();
            } finally {
                this.spinnerVisible = false;
                this.pagosVisible = true;
            }
        }

        simularPagos() {
            console.log('Simulando datos predeterminados de pagos debido a error o falta de datos');
            this.pagos = [{
                periodo: 'Simulado - 2024-1',
                datosPago: [
                    { nombre: 'Pago Simulado 1', monto: 150.0, fechaSolicitud: '01/10/2024', fechaEmision: '03/10/2024', fechaVencimiento: '15/10/2024', fechaPago: '14/10/2024', estado: 'Pagado' },
                    { nombre: 'Pago Simulado 2', monto: 200.0, fechaSolicitud: '01/09/2024', fechaEmision: '03/09/2024', fechaVencimiento: '15/09/2024', fechaPago: '14/09/2024', estado: 'Pendiente' }
                ]
            }];
        }


        async getHorarios() {
            this.spinnerVisible = true;
            console.log('Obteniendo horarios para el DNI:', this.dni);

            try {
                const datosHorarios = await getHorarios({ dni: this.dni, institucion: this.institucion });
                console.log('Datos de horarios recibidos:', datosHorarios);

                if (datosHorarios.message && datosHorarios.message === 'Éxito') {
                    if (datosHorarios.results && datosHorarios.results.length > 0) {
                        console.log('Resultados de horarios obtenidos:', datosHorarios.results);
                        this.horarios = datosHorarios.results;
                    } else {
                        console.log('No se encontraron horarios, simulando datos');
                        this.simularHorarios();
                    }
                } else {
                    console.log('Error en el resultado de la llamada Apex:', datosHorarios.message);
                    this.simularHorarios();
                }
            } catch (error) {
                console.error('Error al obtener los horarios:', error);
                this.simularHorarios();
            } finally {
                this.spinnerVisible = false;
                this.horariosVisible = true;
            }
        }

        simularHorarios() {
            console.log('Simulando datos de horarios predeterminados');
            this.horarios = [{
                periodo: 'Simulado - 2024-1',
                datosHorario: [
                    { curso: 'Curso Simulado 1', horaInicio: '08:00', horaFin: '10:00', docente: 'Docente Simulado 1', ambiente: 'Aula 101', modalidad: 'Presencial', style: 'top: 10px; left: 10px;' },
                    { curso: 'Curso Simulado 2', horaInicio: '10:00', horaFin: '12:00', docente: 'Docente Simulado 2', ambiente: 'Aula 102', modalidad: 'Virtual', style: 'top: 100px; left: 100px;' }
                ],
                horas: [
                    { horario: '08:00', style: 'top: 10px;' },
                    { horario: '10:00', style: 'top: 100px;' }
                ]
            }];
        }


        closeChildren() {
            console.log('Cerrando todas las cards');
            this.notasVisible = false;
            this.asistenciasVisible = false;
            this.pagosVisible = false;
            this.horariosVisible = false;
        }

        showToast(title, message, variant) {
            this.dispatchEvent(new ShowToastEvent({ title: title || 'Información', message, variant }));
        }

        // Getters para los datos del alumno
        get nombreCompleto() {
            return this.alumno && this.alumno.nombreCompleto ? this.alumno.nombreCompleto : 'Nombre no disponible';
        }

        get codigo() {
            return this.alumno && this.alumno.codigo ? this.alumno.codigo : 'Código no disponible';
        }

        get correoPersonal() {
            return this.alumno && this.alumno.correoPersonal ? this.alumno.correoPersonal : 'Correo personal no disponible';
        }

        get correoInstitucional() {
            return this.alumno && this.alumno.correoInstitucional ? this.alumno.correoInstitucional : 'Correo institucional no disponible';
        }

        get telefono() {
            return this.alumno && this.alumno.telefono ? this.alumno.telefono : 'Teléfono no disponible';
        }

        get fechaNacimiento() {
            return this.alumno && this.alumno.fechaNacimiento ? this.alumno.fechaNacimiento : 'Fecha de nacimiento no disponible';
        }

        get edad() {
            return this.alumno && this.alumno.edad ? this.alumno.edad : 'Edad no disponible';
        }

        get idActor() {
            return this.alumno && this.alumno.idActor ? this.alumno.idActor : 'ID Actor no disponible';
        }

        get numeroIdentidad() {
            return this.alumno && this.alumno.numeroIdentidad ? this.alumno.numeroIdentidad : 'Número de Identidad no disponible';
        }

        get paterno() {
            return this.alumno && this.alumno.paterno ? this.alumno.paterno : 'Apellido Paterno no disponible';
        }

        get materno() {
            return this.alumno && this.alumno.materno ? this.alumno.materno : 'Apellido Materno no disponible';
        }

        get nombres() {
            return this.alumno && this.alumno.nombres ? this.alumno.nombres : 'Nombres no disponibles';
        }
    }
