import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { deklinatu, IzenMota, type PraktikaItem } from './deklinatu';

@Component({
  selector: 'app-deklinabidea-practica',
  imports: [FormsModule],
  templateUrl: './deklinabidea-practica.html',
})
export class DeklinabideaPractica implements OnInit {
  @Input({ required: true }) listaEjercicios: PraktikaItem[] = [];
  @Output() reset = new EventEmitter<void>();

  ejerciciosPendientes: PraktikaItem[] = [];
  ejercicioActual: PraktikaItem | null = null;
  respuestaUsuario = '';
  solucionCorrecta = '';
  acertado = false;
  intentos = 3;
  textoAcierto = '';
  classTextoAcierto = 'text-center';
  nEjercicios = 0;

  ngOnInit(): void {
    this.ejerciciosPendientes = [...this.listaEjercicios];
    this.nEjercicios = this.ejerciciosPendientes.length;
    this.sacarPalabra();
  }

  sacarPalabra(): void {

    if (!this.ejerciciosPendientes || this.ejerciciosPendientes.length === 0) {
      return; // Espera a que los datos carguen
    }
    // Sacamos el primer elemento de los pendientes
    this.ejercicioActual = this.ejerciciosPendientes[0];
    this.limpiarInput();



    if (this.ejercicioActual?.hitza) {
      const esBizigabea = 'biziduna' in this.ejercicioActual.hitza
        ? !this.ejercicioActual.hitza.biziduna
        : Boolean((this.ejercicioActual.hitza as any).bizigabe);

      // Calculamos cuál es la solución correcta para este ejercicio
      // (Ajusta los parámetros según cómo tengas definida tu función deklinatu)
      this.solucionCorrecta = deklinatu(
        this.ejercicioActual.hitza.eu,
        this.ejercicioActual.kasua,
        this.ejercicioActual.zenbakia,
        this.ejercicioActual.hitza.mota as IzenMota,
        esBizigabea
      );
    }


  }

  pasarPalabra(): void {
    this.moverAlFinal();
    this.sacarPalabra();
  }


  moverAlFinal(): void {
    const actual = this.ejerciciosPendientes.shift();
    if (actual) {
      this.ejerciciosPendientes.push(actual);
    }
  }

  limpiarInput(): void {
    this.respuestaUsuario = '';
    this.acertado = false;
    this.intentos = 3;
    this.solucionCorrecta = '';
    this.textoAcierto = '';
    this.classTextoAcierto = 'text-center';
  }

  comprobarRespuesta(): void {
    if (!this.ejercicioActual || this.acertado || this.intentos === 0) return;

    const limpiaUsuario = this.respuestaUsuario.trim().toLowerCase();
    const limpiaSolucion = this.solucionCorrecta.trim().toLowerCase();

    if (limpiaUsuario === limpiaSolucion) {
      this.acertado = true;
      this.textoAcierto = '<strong>Oso ondo!</strong><br>';
      this.classTextoAcierto = 'text-center text-success fw-bold fs-2';
      this.ejerciciosPendientes.shift();
      // No vaciamos palabraSeleccionada aquí para que no desaparezca el enunciado de arriba al acertar
      if (this.ejerciciosPendientes.length === 0) {
        this.textoAcierto = 'Zorionak!<br> Has adivinado todas las palabras.';
      }
      return;
    }
    else {
      const fallado = this.ejerciciosPendientes.shift();
      if (fallado) {
        this.ejerciciosPendientes.push(fallado);
      }
    }
    this.intentos--;
    this.textoAcierto = this.intentos > 0 ? 'Intentalo de nuevo' : '';
    this.textoAcierto += this.intentos > 0 ? `<br>Intentos restantes: ${this.intentos}` : '';
    this.classTextoAcierto = 'text-center text-info';

  }




  volverAFiltros(): void {
    this.reset.emit(); // Avisa al padre para volver a la pantalla 'filtros'
  }
}
