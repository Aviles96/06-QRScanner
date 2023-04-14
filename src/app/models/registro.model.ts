//Propiedades a la hora de almacenar los registros de lector de qrs
export class Registro {

    public format: string;
    public text: string;
    public type!: string;
    public icon!: string;
    public created:  Date;

    constructor( format: string, text: string ) {
        this.format = format;
        this.text = text;

        this.created = new Date();
        
        this.determinarTipo();

    }

    //Determinando los parametrs de type y icon segun como comience su url
    private determinarTipo() {
        const inicioTexto = this.text.substr(0, 4);
        console.log('TIPO', inicioTexto);

        switch ( inicioTexto ) {
            case 'http':
                this.type = 'http';
                this.icon = 'globe';
            break;

            case 'geo':
                this.type = 'geo';
                this.icon = 'pin';
            break;

            default:
                this.type = 'No reconocido';
                this.icon = 'create';

        }
    }

}