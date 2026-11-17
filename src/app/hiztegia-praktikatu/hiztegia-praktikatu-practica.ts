import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Hitz } from '../hiztegia';
import { esCorrecta } from '../utilidades';

const palabraVacia = (): Hitz => ({ eu: '', es: [], maila: '', ikasturtea: 0, data: '' });

@Component({
  imports: [FormsModule],
  selector: 'app-hiztegia-praktikatu-practica',
  templateUrl: './hiztegia-praktikatu-practica.html',
})
export class HiztegiaPraktikatuPractica implements OnInit {
  @ViewChild('primerInput') primerInput?: ElementRef<HTMLInputElement>;
  @Input() modo = 'Euskara';
  @Input() palabrasAEstudiar: Hitz[] = [];
  palabraSeleccionada: Hitz = palabraVacia();
  nPalabras = 0;
  palabraIntroducida = '';
  intentos = 3;
  acertado = false;
  textoAcierto = '';
  classTextoAcierto = 'text-center';
  solucion = '';
  @Output() reset = new EventEmitter<void>();

  ngOnInit(): void {
    this.palabrasAEstudiar = [...this.palabrasAEstudiar];
    this.nPalabras = this.palabrasAEstudiar.length;
    this.sacarPalabra();
  }

  get respuestaVisible(): string {
    const p = this.palabraSeleccionada;
    let respuesta = '';
    if (this.modo === 'Euskara') {
      respuesta = p.es.join(' / ');
      if (p.notaes) {
        respuesta += ' (' + p.notaes + ')';
      }
    } else {
      respuesta = [p.eu, ...(p.eu_alt ?? [])].join(' / ');
      if (p.notaeu) {
        respuesta += ' (' + p.notaeu + ')';
      }
    }
    return respuesta.toLowerCase();
  }

  get respuestaTotal(): string {
    const p = this.palabraSeleccionada;
    let respuesta = '';
    respuesta += [p.eu, ...(p.eu_alt ?? [])].join(' / ');
    if (p.notaeu) {
      respuesta += ' (' + p.notaeu + ')';
    }
    respuesta += ' = ';
    respuesta += p.es.join(' / ');
    if (p.notaes) {
      respuesta += ' (' + p.notaes + ')';
    }
    return respuesta.toLowerCase();
  }

  public sacarPalabra(): void {
    if (this.palabrasAEstudiar.length === 0) {
      return;
    }
    const indice = Math.trunc(Math.random() * this.palabrasAEstudiar.length);
    this.palabraSeleccionada = this.palabrasAEstudiar[indice];
    this.intentos = 3;
    this.textoAcierto = '';
    this.classTextoAcierto = 'text-center';
    this.acertado = false;
    this.palabraIntroducida = '';
    this.solucion = '';
    this.enfocarInput();
  }

  public probar(): void {
    if (this.intentos <= 0 || this.acertado) {
      return;
    }

    const aceptadas = this.modo === 'Euskara'
      ? this.palabraSeleccionada.es
      : [this.palabraSeleccionada.eu, ...(this.palabraSeleccionada.eu_alt ?? [])];
    this.acertado = esCorrecta(aceptadas, this.palabraIntroducida);

    if (this.acertado) {
      this.textoAcierto = '<strong>Oso ondo!</strong><br>';
      this.solucion = this.respuestaTotal;
      this.classTextoAcierto = 'text-center text-success fw-bold fs-2';
      this.palabrasAEstudiar.splice(this.palabrasAEstudiar.indexOf(this.palabraSeleccionada), 1);
      this.palabraIntroducida = '';
      // No vaciamos palabraSeleccionada aquí para que no desaparezca el enunciado de arriba al acertar
      if (this.palabrasAEstudiar.length === 0) {
        this.textoAcierto = 'Zorionak!<br> Has adivinado todas las palabras.';
      }
      return;
    }

    this.intentos--;
    this.textoAcierto = this.intentos > 0 ? 'Intentalo de nuevo' : '';
    this.textoAcierto += `<br>Intentos restantes: ${this.intentos}`;
    this.classTextoAcierto = 'text-center text-info';
  }

  public enfocarInput(): void {
    setTimeout(() => {
      this.primerInput?.nativeElement.focus();
    }, 0);
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'BUTTON')) {
      return;
    }

    if ((this.acertado || this.intentos === 0) && this.palabrasAEstudiar.length > 0) {
      event.preventDefault();
      this.sacarPalabra();
    }
  }

}
