import { Component, effect, signal } from '@angular/core';
import { ServiceHiztegia } from '../hiztegiService';
import { DeklinabideaFiltros } from './deklinabidea-filtros';
import { DeklinabideaPractica } from './deklinabidea-practica';
import { type PraktikaItem } from '../deklinatu';

@Component({
  imports: [DeklinabideaFiltros, DeklinabideaPractica],
  selector: 'app-deklinabidea',
  styleUrl: './deklinabidea.css',
  templateUrl: './deklinabidea.html',
})
export class Deklinabidea {
  pantalla = signal<'cargando' | 'filtros' | 'practicando'>('cargando');
  sesionPractica: PraktikaItem[] = [];

  public constructor(public readonly serviceHiztegia: ServiceHiztegia) {
    effect(() => {
      const palabras = this.serviceHiztegia.deklinabideHitzak();
      if (palabras.length > 0 && this.pantalla() === 'cargando') {
        this.pantalla.set('filtros');
      }
    });
  }

  public empezarPractica(listaEjercicios: PraktikaItem[]): void {
    this.sesionPractica = listaEjercicios;
    this.pantalla.set('practicando');
  }

  public reset(): void {
    this.sesionPractica = [];
    this.pantalla.set('filtros');
  }
}
