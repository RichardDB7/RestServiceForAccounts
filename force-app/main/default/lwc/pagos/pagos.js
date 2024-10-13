import { LightningElement, api, track } from 'lwc';


const COLUMNS = [
    { label: 'Nombre', fieldName: 'nombre', type: 'text' },
    { label: 'Monto', fieldName: 'monto', type: 'number', initialWidth: 100 },
    { label: 'Fecha de solicitud', fieldName: 'fechaSolicitud', type: 'text' },
    { label: 'Fecha de emisión', fieldName: 'fechaEmision', type: 'text' },
    { label: 'Fecha de vencimiento', fieldName: 'fechaVencimiento', type: 'text' },
    { label: 'Fecha de pago', fieldName: 'fechaPago', type: 'text' },
    { label: 'Estado', fieldName: 'estado', type: 'text' },
];

export default class Pagos extends LightningElement {
    @api pagos = [];
    @track spinnerVisible = false;
    columns = COLUMNS;

    connectedCallback() {
        console.log('Pagos recibidos en el componente hijo:', this.pagos);
        this.spinnerVisible = true;
        this.loadPagos();
    }

    loadPagos() {
        if (this.pagos && this.pagos.length > 0) {
            console.log('Datos de pagos encontrados:', this.pagos);
            this.spinnerVisible = false;
        } else {
            console.log('No se encontraron resultados, mostrando datos simulados');
            this.simularPagos();
        }
    }

    simularPagos() {
        this.pagos = [
            { nombre: 'Pago Simulado 1', monto: 150.0, fechaSolicitud: '01/10/2024', fechaEmision: '03/10/2024', fechaVencimiento: '15/10/2024', fechaPago: '14/10/2024', estado: 'Pagado' },
            { nombre: 'Pago Simulado 2', monto: 200.0, fechaSolicitud: '01/09/2024', fechaEmision: '03/09/2024', fechaVencimiento: '15/09/2024', fechaPago: '14/09/2024', estado: 'Pendiente' }
        ];
        this.spinnerVisible = false;
    }

    close() {
        this.dispatchEvent(new CustomEvent('hideme'));
    }
}
