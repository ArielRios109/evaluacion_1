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

      if (usuariosData) {
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
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      const video = document.createElement('video');
      document.body.appendChild(video);
      video.srcObject = mediaStream;
      await video.play();

      video.addEventListener('canplay', async () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');

        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          const decodedQR: QRCode | null = jsQR(imageData.data, imageData.width, imageData.height);

          if (decodedQR) {
            this.qrContent = decodedQR.data;
          } else {
            console.error('No se pudo decodificar ningún código QR en la imagen.');
          }

          video.srcObject = null;

          if (mediaStream) {
            const tracks = mediaStream.getTracks();
            tracks.forEach((track) => track.stop());
          }

          document.body.removeChild(video);
        } else {
          console.error('Contexto del lienzo no encontrado.');
        }
      });
    } catch (err) {
      console.error('Error al escanear QR', err);
    }
  }

  onFileSelected(event: any) {
    const inputElement = event.target as any;

    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const selectedFile = inputElement.files[0];

      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;

          if (result) {
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

        reader.readAsDataURL(selectedFile);
      }
    }
  }

  openCamera() {
    const constraints = { video: { facingMode: 'environment' } };
  
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      const video = document.getElementById('video') as HTMLVideoElement;
      if (video) {
        video.srcObject = stream;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          video.onplay = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const scanQR = () => {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
              const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);
              if (decodedQR) {
                this.qrContent = decodedQR.data;
              }
              requestAnimationFrame(scanQR);
            };
            requestAnimationFrame(scanQR);
          };
        }
      }
    }).catch((error) => {
      console.error('Error al acceder a la cámara:', error);
      alert('No se pudo acceder a la cámara.');
    });
  }
  
  
}
