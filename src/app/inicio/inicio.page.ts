import { Component, OnInit } from '@angular/core';

// Define el tipo Usuario con la estructura de tus datos de usuario
interface Usuario {
  nombre: string;
  apellido: string;
  // Agrega otros campos si los tienes
}

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  usuario: Usuario | undefined; 

  ngOnInit() {
    // Verificar si el usuario ha iniciado sesión
    const ingresado = localStorage.getItem('ingresado');

    if (ingresado === 'true') {
      // Recuperar los datos del usuario que inició sesión desde localStorage
      const usuariosData = localStorage.getItem('usuarios');

      if (usuariosData !== null) {
        const usuarios: Usuario[] = JSON.parse(usuariosData);
        const nombreUsuario = localStorage.getItem('nombreUsuario'); 

        if (nombreUsuario) {
          this.usuario = usuarios.find((u: Usuario) => u.nombre === nombreUsuario);
        } else {
          console.error('El nombre de usuario no se ha registrado correctamente durante el inicio de sesión.');
        }
      } else {
      }
    } else {
    }
  }
}
