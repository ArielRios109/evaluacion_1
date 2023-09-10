import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScanResult } from '@awesome-cordova-plugins/barcode-scanner/ngx';

// Define el tipo Usuario con la estructura de datos de usuario
interface Usuario {
  nombre: string;
  apellido: string;
}

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})
export class InicioPage implements OnInit {

  usuario: Usuario | undefined;
  codigoQRGenerado: string | undefined;

  datocodificado: any;
  datoscaneado: { text: string } | undefined;

  constructor(private barcodeScanner: BarcodeScanner) {}

  ngOnInit() {
    this.verificarInicioSesion();
  }

  verificarInicioSesion() {
    const ingresado = localStorage.getItem('ingresado');

    if (ingresado === 'true') {
      const usuariosData = localStorage.getItem('usuarios');

      if (usuariosData !== null) {
        const usuarios: Usuario[] = JSON.parse(usuariosData);
        const nombreUsuario = localStorage.getItem('nombreUsuario');

        if (nombreUsuario) {
          this.usuario = usuarios.find((u: Usuario) => u.nombre === nombreUsuario);
        } else {
          console.error('El nombre de usuario no se ha registrado correctamente.');
        }
      }
    }
  }

  LeerCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.datoscaneado = barcodeData;
    })
    .catch(err => {
      console.log("Error", err);
    });
  }

  CodificarTexto() {
    this.barcodeScanner.encode(this.barcodeScanner.Encode.TEXT_TYPE, this.datocodificado).then(
      encodedData => {
        this.datocodificado = encodedData;
      },
      err => {
        console.log("Un error ha ocurrido: " + err);
      }
    );
  }
}
