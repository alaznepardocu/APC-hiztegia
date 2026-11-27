import { AfterViewInit, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceHiztegia } from '../hiztegiService';
import { Hitz } from '../hiztegia';
import { agruparPorEu, etiquetaIkasturtea, formatearFecha, shuffle } from '../utilidades';

@Component({
  imports: [FormsModule],
  selector: 'app-hiztegia-praktikatu-filtros',
  templateUrl: './hiztegia-praktikatu-filtros.html',
})
export class HiztegiaPraktikatuFiltros implements AfterViewInit, OnInit {
  modo = 'Euskara';
  nivelSeleccionado = 'Todos';          // A1, A2... (antes "curso")
  ikasturteaSeleccionada = 'Todos';     // 2026-27...
  fechaSeleccionada = 'Todos';
  palabrasFiltradas: Hitz[] = [];
  nPalabras = 0;
  modoExamen = false;
  nPalabrasExamen = 5;


  readonly formatearFecha = formatearFecha;
  @Output() empezar = new EventEmitter<{ palabras: Hitz[]; modo: string; modoExamen: boolean}>();

  @ViewChild('panelFiltros') panelFiltros!: ElementRef<HTMLElement>;

  constructor(public readonly serviceHiztegia: ServiceHiztegia) {}

  ngAfterViewInit(): void {
    this.panelFiltros.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  ngOnInit(): void {
    // Por defecto, el curso más reciente
    this.ikasturteaSeleccionada = this.serviceHiztegia.ikasturteaActual();
    this.filtrar();
  }

  private palabrasDeNivelYCurso(): Hitz[] {
    return this.serviceHiztegia.hiztegia().filter(p =>
      (this.nivelSeleccionado === 'Todos' || p.maila === this.nivelSeleccionado) &&
      (this.ikasturteaSeleccionada === 'Todos' ||
        etiquetaIkasturtea(p.ikasturtea) === this.ikasturteaSeleccionada)
    );
  }

  get fechasDisponibles(): string[] {
    const fechas = new Set(this.palabrasDeNivelYCurso().map(p => p.data));
    // Se copia antes de ordenar: así no se toca el array original del servicio
    return ['Todos', ...[...fechas].sort().reverse()];
  }

  public cambiarNivel(nivel: string): void {
    this.nivelSeleccionado = nivel;
    this.revisarFecha();
    this.filtrar();
  }

  public cambiarIkasturtea(ikasturtea: string): void {
    this.ikasturteaSeleccionada = ikasturtea;
    this.revisarFecha();
    this.filtrar();
  }

  public cambiarFecha(fecha: string): void {
    this.fechaSeleccionada = fecha;
    this.filtrar();
  }

  private revisarFecha(): void {
    if (!this.fechasDisponibles.includes(this.fechaSeleccionada)) {
      this.fechaSeleccionada = 'Todos';
    }
  }

  public filtrar(): void {
    this.palabrasFiltradas = this.palabrasDeNivelYCurso().filter(p =>
      this.fechaSeleccionada === 'Todos' || p.data === this.fechaSeleccionada
    );
    // Si se mezclan niveles, la misma palabra cuenta una sola vez (con todos sus significados)
    this.nPalabras = agruparPorEu(this.palabrasFiltradas).length;
  }

  get palabrasRealesExamen(): number{
    return Math.min(this.nPalabras, Math.max(1, this.nPalabrasExamen || 10))
  }

  public iniciarPractica(): void {
    var listaPalabras: Hitz[] = agruparPorEu(this.palabrasFiltradas)
    
    if (this.modoExamen) {
    const limite = Math.min(this.nPalabras, Math.max(1, this.nPalabrasExamen || 10));
    listaPalabras = shuffle(listaPalabras).slice(0, limite);
  }

    this.empezar.emit({ palabras: listaPalabras, modo: this.modo, modoExamen: this.modoExamen});
  }
}
