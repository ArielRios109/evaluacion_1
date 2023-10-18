import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formularioRegistro: FormGroup;

  constructor(public fb: FormBuilder, public alertController: AlertController, public navCtrl: NavController) {
    this.formularioRegistro = this.fb.group({
      'nombre': new FormControl('', Validators.required),
      'apellido': new FormControl('', Validators.required),
      'rut': new FormControl('', Validators.required),
      'region': new FormControl('', Validators.required),
      'comuna': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),
    });
  }

  async guardar() {
    const f = this.formularioRegistro.value;

    if (this.formularioRegistro.invalid) {
      const alert = await this.alertController.create({
        header: 'Datos incompletos',
        message: 'Es necesario llenar todos los datos',
        buttons: ['Aceptar']
      });

      await alert.present();
      return;
    }

    // Obtener la lista de usuarios existente o crear una nueva si no existe
    let usuarios: any[] = [];

    // Verificar si la clave 'usuarios' existe en el localStorage y no es null
    const usuariosData = localStorage.getItem('usuarios');
    if (usuariosData !== null) {
      usuarios = JSON.parse(usuariosData);
    }

    const usuario = {
      nombre: f.nombre,
      apellido: f.apellido,
      rut: f.rut,
      region: f.region,
      comuna: f.comuna,
      password: f.password,
    };

    // Agregar el nuevo usuario a la lista
    usuarios.push(usuario);

    // Guardar la lista de usuarios actualizada en el localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    localStorage.setItem('registrado', 'true');
    this.navCtrl.navigateRoot('login');
  }

  ngOnInit() {}
}
