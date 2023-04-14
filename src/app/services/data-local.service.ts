import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
 
@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];
  private _storage: Storage | null = null;
 
  constructor(private storage: Storage,
              private navCtrl: NavController,
              private inAppBrowser: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer
             ) {
    this.initDB();
    // cargar registros
    this.cargarStorage();
   }
 
  async initDB() {
    const storage = await this.storage.create();
    this._storage = storage;
  }
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }
 
  async cargarStorage() {
    this.guardados = await this.storage.get('registros') || [];
  }
 
  async guardarRegistro(format: string, text: string) {
    await this.cargarStorage();
    const nuevoRegistro = new Registro(format, text);
    this.guardados.unshift(nuevoRegistro);
    // console.log('this.guardados: ', this.guardados);
    this.storage.set('registros', this.guardados);
    //Navegar directo el url del historial
    this.abrirRegistro( nuevoRegistro );
  }

  //Conectar los urls
  abrirRegistro( registro: Registro ){
    this.navCtrl.navigateForward('/tabs/tab2');
    this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);

    switch( registro.type ) {
      case 'http':
        //Abrir el navegador web
        this.inAppBrowser.create( registro.text, '_system')
      break;

      case 'geo':
        //Abrir el navegador web
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${ registro.text }`);
      break;
    }
  }

  //Creando un archivo de CSV el \n es como indicar de dar siguiento o un enter
  enviarCorreo() {
    const arrTemp = [];
    const titulos =  'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push( titulos );
      this.guardados.forEach( registro => {
         const linea = `${ registro.type }, ${ registro.format },${ registro.created },${ registro.text.replace(',', ' ')}\n`;

         arrTemp.push( linea );
      });
      // console.log( arrTemp.join('') );
      this.crearArchivoFisico( arrTemp.join('') );

  }
  //Creando archivo CSV
  crearArchivoFisico( text: string ) {
    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
      .then( existe => {
        console.log('Existe archivo?', existe );
        return this.escribirEnArchivo( text );
      })
      .catch( err => {
        return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
          .then( creado => this.escribirEnArchivo( text ) )
          .catch( err2 => console.log( 'No se pudo crear el archivo', err2 ))
      });
  }

  async escribirEnArchivo( text: string ) {
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );

    const archivo = `${this.file.dataDirectory}/registros.csv`

    let email = {
      to: 'cesaravilesrodriguez@hotmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Backup de scans',
      body: 'Aqui tienen sus backups de los scans - <strong>ScanApp</strong>',
      isHtml: true
    }
    
    // Send a text message using default options
    this.emailComposer.open(email);

  }
}