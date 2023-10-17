import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  formularioLogin: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, public navCtrl: NavController) {
    this.formularioLogin = this.fb.group({
      'nombre': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required)
    });
  }

  ngOnInit() {}

  async ingresar() {
    const f = this.formularioLogin.value;
    let usuarios: any[] = [];

    // Verificar si la clave 'usuarios' existe en el localStorage y no es null
    const usuariosData = localStorage.getItem('usuarios');
    if (usuariosData !== null) {
      usuarios = JSON.parse(usuariosData);
    }

    const usuario = usuarios.find(u => u.nombre === f.nombre && u.password === f.password);

    if (usuario) {
      // Almacena el nombre del usuario que inició sesión en el localStorage
      localStorage.setItem('nombreUsuario', f.nombre);
      localStorage.setItem('ingresado', 'true');
      this.navCtrl.navigateRoot('inicio');
    } else {
      const alert = await this.alertController.create({
        header: 'Datos incorrectos',
        message: 'Usuario o contraseña incorrectos',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }
}
