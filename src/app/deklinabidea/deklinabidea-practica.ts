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

  ngOnInit(): void {
    this.ejerciciosPendientes = [...this.listaEjercicios];
    this.siguientePalabra();
  }

  siguientePalabra(): void {
    if (this.ejerciciosPendientes.length === 0) {
      this.ejercicioActual = null;
      return;
    }

    // Sacamos el primer elemento de los pendientes
    this.ejercicioActual = this.ejerciciosPendientes.shift()!;
    this.respuestaUsuario = '';
    this.acertado = false;
    this.intentos = 3;

    // Calculamos cuál es la solución correcta para este ejercicio
    // (Ajusta los parámetros según cómo tengas definida tu función deklinatu)
    this.solucionCorrecta = deklinatu(
      this.ejercicioActual.hitza.hitza,          // <-- antes pusimos .eu
      this.ejercicioActual.kasua,
      this.ejercicioActual.zenbakia,
      this.ejercicioActual.hitza.mota as IzenMota, // <-- asegura compatibilidad entre HitzMota e IzenMota
      !this.ejercicioActual.hitza.biziduna       // <-- !biziduna equivale a bizigabea
    );


  }

  comprobarRespuesta(): void {
    if (!this.ejercicioActual || this.acertado || this.intentos === 0) return;

    const limpiaUsuario = this.respuestaUsuario.trim().toLowerCase();
    const limpiaSolucion = this.solucionCorrecta.trim().toLowerCase();

    if (limpiaUsuario === limpiaSolucion) {
      this.acertado = true;
    } else {
      this.intentos--;
      // Si falla a la primera, opcionalmente puedes volver a meterla al final de pendientes:
      // if (this.intentos === 0) this.ejerciciosPendientes.push(this.ejercicioActual);
    }
  }

  volverAFiltros(): void {
    this.reset.emit(); // Avisa al padre para volver a la pantalla 'filtros'
  }
}
