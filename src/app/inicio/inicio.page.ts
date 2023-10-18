import { Component, OnInit } from '@angular/core';
import jsQR, { QRCode } from 'jsqr';

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
  qrContent: string | undefined;
  
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

  async LeerCode() {
    try {
      const constraints = { video: { facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      const video = document.createElement('video');
      document.body.appendChild(video);
      video.srcObject = stream;
      await video.play();

      video.addEventListener('canplay', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          // Decodificar código QR desde la imagen con jsQR
          const decodedQR: QRCode | null = jsQR(imageData.data, imageData.width, imageData.height);

          if (decodedQR) {
            this.qrContent = decodedQR.data;
          } else {
            console.error('No se pudo decodificar ningún código QR en la imagen.');
          }

          video.srcObject = null;
          stream.getTracks().forEach((track) => track.stop());
          document.body.removeChild(video);
        } else {
          console.error('Contexto del lienzo no encontrado.');
        }
      });
    } catch (err) {
      console.error('Error al escanear QR', err);
    }
  }

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const files = fileInput.files;

    if (files && files.length > 0) {
      const file = files[0];

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;

        if (typeof result === 'string') {
          const img = new Image();
          img.src = result;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const context = canvas.getContext('2d');

            if (context) {
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

              // Decodificar código QR desde la imagen con jsQR
              const decodedQR: QRCode | null = jsQR(imageData.data, imageData.width, imageData.height);

              if (decodedQR) {
                this.qrContent = decodedQR.data;
              } else {
                console.error('No se pudo decodificar ningún código QR en la imagen.');
              }
            }
          };
        } else {
          console.error('El resultado no es una cadena.');
        }
      };

      reader.readAsDataURL(file);
    }
  }
}
