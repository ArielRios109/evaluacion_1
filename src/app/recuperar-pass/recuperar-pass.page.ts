import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar-pass',
  templateUrl: './recuperar-pass.page.html',
  styleUrls: ['./recuperar-pass.page.scss'],
})
export class RecuperarPassPage {
  formularioRecuperacion: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.formularioRecuperacion = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required]],
      nuevaContrasena: ['', [Validators.required]],
    });
  }

  async cambiarContrasena() {
    if (this.formularioRecuperacion.valid) {
      const nombreUsuario = this.formularioRecuperacion.value.nombreUsuario;
      const nuevaContrasena = this.formularioRecuperacion.value.nuevaContrasena;

      // Obtener la lista de usuarios desde el localStorage
      let usuarios: any[] = [];
      const usuariosData = localStorage.getItem('usuarios');
      if (usuariosData !== null) {
        usuarios = JSON.parse(usuariosData);
      }

      // Buscar al usuario por su nombre de usuario
      const usuarioIndex = usuarios.findIndex((u) => u.nombre === nombreUsuario);

      if (usuarioIndex !== -1) {
        // Actualizar la contraseña del usuario
        usuarios[usuarioIndex].password = nuevaContrasena;

        // Guardar la lista actualizada de usuarios en el localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Mostrar una alerta de contraseña cambiada con éxito
        const alert = await this.alertController.create({
          header: 'Contraseña Cambiada',
          message: 'Tu contraseña se ha cambiado con éxito.',
          buttons: ['Aceptar'],
        });
        await alert.present();

        // Redirigir al usuario a otra página o realizar cualquier otra acción necesaria
        // this.navCtrl.navigateRoot('otra-pagina');
      } else {
        // Mostrar una alerta si el nombre de usuario no se encuentra
        const alert = await this.alertController.create({
          header: 'Usuario no encontrado',
          message: 'No se encontró un usuario con el nombre proporcionado.',
          buttons: ['Aceptar'],
        });
        await alert.present();
      }
    }
  }
}
