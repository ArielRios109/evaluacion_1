import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BrowserQRCodeReader } from '@zxing/library';

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
  datoscaneado: { text: string } | undefined;

  zxing = new BrowserQRCodeReader();

  constructor() {}

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
    const codeReader = new BrowserQRCodeReader();
    
    codeReader
      .decodeFromInputVideoDevice(undefined, 'video')
      .then(result => {
        this.datoscaneado = { text: result.getText() };
        codeReader.reset();
      })
      .catch(err => {
        console.error('Error al escanear QR', err);
        codeReader.reset();
      });
  }
}