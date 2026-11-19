import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceHiztegia } from '../hiztegiService';
import { DeklinabideHitza } from '../hiztegia';
import {
  esCombinacionValida,
  KASUAK,
  PraktikaItem,
  type Kasua,
  type Zenbakia,
  OINARRIZKOAK, 
  ERLAZIOZKOAK, 
  LEKUKOAK
} from './deklinatu';

@Component({
  imports: [FormsModule],
  selector: 'app-deklinabidea-filtros',
  templateUrl: './deklinabidea-filtros.html',
})
export class DeklinabideaFiltros implements OnInit {
  readonly kasuak = KASUAK;
  readonly oinarrizkoak = OINARRIZKOAK;
  readonly erlaziozkoak = ERLAZIOZKOAK;
  readonly lekukoak = LEKUKOAK;
  kasuakAEstudiar: Kasua[] = [];
  hitzakAEstudiar: DeklinabideHitza[] = [];
  textoFiltrado = '';
  nPractica: number = 1;

  @Output() empezar = new EventEmitter<PraktikaItem[]>();

  constructor(public readonly serviceHiztegia: ServiceHiztegia) {}

  ngOnInit(): void {
    this.hitzakAEstudiar = this.serviceHiztegia.deklinabideHitzak
      ? this.serviceHiztegia.deklinabideHitzak()
      : [];
  }

  get todosDeklinabideSeleccionado(): boolean {
    return (
      this.kasuak.length > 0 &&
      this.kasuak.every((kasu) => this.kasuakAEstudiar.includes(kasu))
    );
  }

  seleccionarTodoDeklinabide(isChecked: boolean): void {
    this.kasuakAEstudiar = isChecked ? [...this.kasuak] : [];
    this.actualizarMensaje();
  }

  onChangeKasu(kasu: Kasua, isChecked: boolean): void {
    if (isChecked) {
      if (!this.kasuakAEstudiar.includes(kasu)) {
        this.kasuakAEstudiar = [...this.kasuakAEstudiar, kasu];
      }
    } else {
      this.kasuakAEstudiar = this.kasuakAEstudiar.filter((k) => k !== kasu);
    }
    this.actualizarMensaje();
  }

  private actualizarMensaje(): void {
    if (this.kasuakAEstudiar.length === 0) {
      this.textoFiltrado = 'No se ha seleccionado ningún kasu';
    } else if (this.hitzakAEstudiar.length === 0) {
      this.textoFiltrado = 'No hay palabras disponibles en el diccionario';
    } else {
      this.textoFiltrado = '';
    }
  }

  private generarEjercicios(): PraktikaItem[] {
    const paresBase: { hitza: DeklinabideHitza; kasua: Kasua }[] = [];
    const cantidad = Math.max(1, this.nPractica || 1);

    // 1. Generamos las combinaciones filtrando previamente las palabras válidas para cada kasu
    for (const kasua of this.kasuakAEstudiar) {
      const palabrasValidasParaKasu = this.hitzakAEstudiar.filter((hitza) => {
        // Para izenBerezia solo aplica 'mugagabea'; para izenArrunta probamos con 'singularra'
        const zenbakiPrueba: Zenbakia =
          hitza.mota === 'izenBerezia' ? 'mugagabea' : 'singularra';
        return esCombinacionValida(hitza, kasua, zenbakiPrueba);
      });

      if (palabrasValidasParaKasu.length === 0) {
        continue; // Si ninguna palabra sirve para este kasu, pasamos al siguiente
      }

      const palabrasMezcladas = [...palabrasValidasParaKasu].sort(
        () => Math.random() - 0.5
      );

      const limite = Math.min(cantidad, palabrasValidasParaKasu.length);

      for (let i = 0; i < limite; i++) {
        const hitza = palabrasMezcladas[i];
        paresBase.push({ hitza, kasua });
      }
    }

    // 2. Separamos nombres propios (izenBerezia) de nombres comunes (izenArrunta)
    const izenBereziak = paresBase.filter((p) => p.hitza.mota === 'izenBerezia');
    const izenArruntak = paresBase
      .filter((p) => p.hitza.mota !== 'izenBerezia')
      .sort(() => Math.random() - 0.5);

    // 3. A los izenBerezia les asignamos directamente 'mugagabea'
    const ejerciciosBerezia: PraktikaItem[] = izenBereziak.map((par) => ({
      ...par,
      zenbakia: 'mugagabea',
    }));

    // 4. Solo los izenArrunta se reparten equilibradamente entre los 3 zenbakiak
    const zenbakiak: Zenbakia[] = ['singularra', 'plurala', 'mugagabea'].sort(
      () => Math.random() - 0.5
    ) as Zenbakia[];

    const ejerciciosArrunta: PraktikaItem[] = izenArruntak.map((par, index) => ({
      ...par,
      zenbakia: zenbakiak[index % zenbakiak.length],
    }));

    // 5. Juntamos ambos grupos y barajamos el resultado final
    return [...ejerciciosBerezia, ...ejerciciosArrunta].sort(
      () => Math.random() - 0.5
    );
  }

  iniciarPractica(): void {
    if (this.kasuakAEstudiar.length > 0 && this.hitzakAEstudiar.length > 0) {
      const listaEjercicios = this.generarEjercicios();
      console.log('Ejercicios de prueba:', listaEjercicios);

      if (listaEjercicios.length === 0) {
        this.textoFiltrado =
          'No hay palabras compatibles con los kasuak seleccionados.';
        return;
      }

      this.empezar.emit(listaEjercicios);
    }
  }
}
