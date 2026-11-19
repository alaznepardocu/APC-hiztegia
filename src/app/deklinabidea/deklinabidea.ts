import { Component, signal } from '@angular/core';
import { Hitz } from '../hiztegia';
import { ServiceHiztegia } from '../hiztegiService';

@Component({
  imports: [],
  selector: 'app-deklinabidea',
  styleUrl: './deklinabidea.css',
  templateUrl: './deklinabidea.html',
})
export class Deklinabidea {
  pantalla = signal<'cargando' | 'filtros' | 'practicando'>('cargando');
  sesionPractica: { palabras: Hitz[]; modo: string } = { palabras: [], modo: 'Euskara' };

  public constructor(public readonly serviceHiztegia: ServiceHiztegia) {
    effect(() => {
      const palabras = this.serviceHiztegia.hiztegia();
      if (palabras.length > 0) {
        this.pantalla.set('filtros');
      }
    });
  }

  public empezarPractica(sesion: { palabras: Hitz[]; modo: string }): void {
    this.sesionPractica = sesion;
    this.pantalla.set('practicando');
  }

  public reset(): void {
    this.pantalla.set('filtros');
  }
}
