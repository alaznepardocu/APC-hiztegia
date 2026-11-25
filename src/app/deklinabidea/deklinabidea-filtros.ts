import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceHiztegia } from '../hiztegiService';
import { DeklinabideHitza, PERTSONA_IZEN_ORDAINAK, ERAKUSLEAK, HITZ_MOTAK } from '../hiztegia';
import {shuffle} from '../utilidades';
import {
  esCombinacionValida,
  KASUAK,
  PraktikaItem,
  type Kasua,
  type Zenbakia,
  OINARRIZKOAK,
  ERLAZIOZKOAK,
  LEKUKOAK,
  BIZIDUN_KASUAK
} from '../deklinatu';

const ZENBAKIAK_GUZTIAK: readonly Zenbakia[] = [
  'singularra',
  'plurala',
  'mugagabea',
];

@Component({
  imports: [FormsModule],
  selector: 'app-deklinabidea-filtros',
  templateUrl: './deklinabidea-filtros.html',
})
export class DeklinabideaFiltros implements OnInit {
  readonly oinarrizkoak = OINARRIZKOAK;
  readonly erlaziozkoak = ERLAZIOZKOAK;
  readonly lekukoak = LEKUKOAK;
  readonly bizidunak = BIZIDUN_KASUAK;

  kasuakAEstudiar: Kasua[] = [];
  textoFiltrado = '';
  nPractica: number = 3;
  todasLasPalabras: DeklinabideHitza[] = [];

  @Output() empezar = new EventEmitter<PraktikaItem[]>();

  constructor(public readonly serviceHiztegia: ServiceHiztegia) {}

  ngOnInit(): void {
    const rawHitzak = this.serviceHiztegia.deklinabideHitzak
      ? this.serviceHiztegia.deklinabideHitzak()
      : [];
    this.todasLasPalabras = Array.isArray(rawHitzak) ? rawHitzak : [];
    this.actualizarMensaje();
  }

  get hitzakAEstudiar(): DeklinabideHitza[] {
    return [
      ...(this.todasLasPalabras ?? []),
      ...PERTSONA_IZEN_ORDAINAK,
      ...ERAKUSLEAK,
    ];
  }

  private getId(hitza: DeklinabideHitza): string {
    const euNormalizado = hitza.eu.trim().toLowerCase();
    const zenbakia = hitza.zenbakia ?? '';
    return `${hitza.mota}:${euNormalizado}:${zenbakia}`;
  }



  private getZenbakiaFijo(hitza: DeklinabideHitza): Zenbakia | null {
    if (hitza.mota === HITZ_MOTAK.IZEN_BEREZIA) {
      return 'mugagabea';
    }
    if (
      hitza.mota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA ||
      hitza.mota === HITZ_MOTAK.ERAKUSLEA
    ) {
      return (hitza.zenbakia ?? 'singularra') as Zenbakia;
    }
    return null;
  }

  private getCandidatosPara(
    candidatos: readonly DeklinabideHitza[],
    kasua: Kasua,
    zenbakia: Zenbakia
  ): DeklinabideHitza[] {
    return candidatos.filter((hitza) => {
      const fijo = this.getZenbakiaFijo(hitza);
      if (fijo && fijo !== zenbakia) {
        return false;
      }
      return esCombinacionValida(hitza, kasua, zenbakia);
    });
  }

  private ordenarPorMenorUso(
    candidatos: readonly DeklinabideHitza[],
    conteoUsoPalabras: Map<string, number>
  ): DeklinabideHitza[] {
    return shuffle(candidatos).sort((a, b) => {
      const usoA = conteoUsoPalabras.get(this.getId(a)) ?? 0;
      const usoB = conteoUsoPalabras.get(this.getId(b)) ?? 0;
      return usoA - usoB;
    });
  }

  private construirListaEjercicios(
    candidatos: readonly DeklinabideHitza[],
    kasuak: readonly Kasua[],
    cantidadPorKasu: number
  ): PraktikaItem[] {
    const resultado: PraktikaItem[] = [];
    const usadosExactos = new Set<string>();
    const conteoUsoPalabras = new Map<string, number>();
    const objetivoPorKasu = Math.max(3, cantidadPorKasu);

    const mapaPorKasuYNumero = new Map<
      Kasua,
      Record<Zenbakia, DeklinabideHitza[]>
    >();

    for (const kasua of kasuak) {
      const porNumero: Record<Zenbakia, DeklinabideHitza[]> = {
        singularra: this.getCandidatosPara(candidatos, kasua, 'singularra'),
        plurala: this.getCandidatosPara(candidatos, kasua, 'plurala'),
        mugagabea: this.getCandidatosPara(candidatos, kasua, 'mugagabea'),
      };

      const totalOpcionesKasu =
        porNumero.singularra.length +
        porNumero.plurala.length +
        porNumero.mugagabea.length;

      if (totalOpcionesKasu > 0) {
        mapaPorKasuYNumero.set(kasua, porNumero);
      }
    }

    const kasuakOrdenados = Array.from(mapaPorKasuYNumero.keys()).sort((a, b) => {
      const mapA = mapaPorKasuYNumero.get(a)!;
      const mapB = mapaPorKasuYNumero.get(b)!;
      const totalA = mapA.singularra.length + mapA.plurala.length + mapA.mugagabea.length;
      const totalB = mapB.singularra.length + mapB.plurala.length + mapB.mugagabea.length;
      return totalA - totalB;
    });

    const agregarItem = (
      hitza: DeklinabideHitza,
      kasua: Kasua,
      zenbakia: Zenbakia
    ): boolean => {
      const idPalabra = this.getId(hitza);
      const claveExacta = `${idPalabra}|${kasua}|${zenbakia}`;
      if (usadosExactos.has(claveExacta)) {
        return false;
      }
      usadosExactos.add(claveExacta);
      conteoUsoPalabras.set(idPalabra, (conteoUsoPalabras.get(idPalabra) ?? 0) + 1);
      resultado.push({ hitza, kasua, zenbakia });
      return true;
    };

    for (const kasua of kasuakOrdenados) {
      const porNumero = mapaPorKasuYNumero.get(kasua)!;
      let anadidosEnKasu = 0;

      // 1. Garantizar al menos 1 de singularra, 1 de plurala y 1 de mugagabea en este kasua
      for (const zenbakia of shuffle(ZENBAKIAK_GUZTIAK)) {
        const ordenadas = this.ordenarPorMenorUso(porNumero[zenbakia], conteoUsoPalabras);
        for (const hitza of ordenadas) {
          if (agregarItem(hitza, kasua, zenbakia)) {
            anadidosEnKasu++;
            break;
          }
        }
      }

      // 2. Completar hasta objetivoPorKasu priorizando las palabras menos usadas
      let progreso = true;
      while (anadidosEnKasu < objetivoPorKasu && progreso) {
        progreso = false;
        for (const zenbakia of shuffle(ZENBAKIAK_GUZTIAK)) {
          if (anadidosEnKasu >= objetivoPorKasu) break;
          const ordenadas = this.ordenarPorMenorUso(porNumero[zenbakia], conteoUsoPalabras);
          for (const hitza of ordenadas) {
            if (agregarItem(hitza, kasua, zenbakia)) {
              anadidosEnKasu++;
              progreso = true;
              break;
            }
          }
        }
      }
    }

    return shuffle(resultado);
  }

  get totalEjerciciosEstimados(): number {
    if (this.kasuakAEstudiar.length === 0 || this.hitzakAEstudiar.length === 0) {
      return 0;
    }
    const cantidad = Math.max(1, this.nPractica || 1);
    return this.construirListaEjercicios(
      this.hitzakAEstudiar,
      this.kasuakAEstudiar,
      cantidad
    ).length;
  }

  private generarEjercicios(): PraktikaItem[] {
    const cantidad = Math.max(1, this.nPractica || 1);
    return this.construirListaEjercicios(
      this.hitzakAEstudiar,
      this.kasuakAEstudiar,
      cantidad
    );
  }

  isBloqueSeleccionado(bloque: readonly Kasua[]): boolean {
    return bloque.length > 0 && bloque.every((kasu) => this.kasuakAEstudiar.includes(kasu));
  }

  seleccionarBloque(bloque: readonly Kasua[], seleccionado: boolean): void {
    if (seleccionado) {
      const combinados = new Set([...this.kasuakAEstudiar, ...bloque]);
      this.kasuakAEstudiar = Array.from(combinados);
    } else {
      this.kasuakAEstudiar = this.kasuakAEstudiar.filter((kasu) => !bloque.includes(kasu));
    }
    this.actualizarMensaje();
  }

  get todosDeklinabideSeleccionado(): boolean {
    return KASUAK.every((kasu) => this.kasuakAEstudiar.includes(kasu));
  }

  seleccionarTodoDeklinabide(seleccionado: boolean): void {
    this.kasuakAEstudiar = seleccionado ? [...KASUAK] : [];
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
      this.textoFiltrado = 'No hay palabras disponibles';
    } else {
      this.textoFiltrado = '';
    }
  }

  isBloqueIndeterminado(bloque: readonly Kasua[]): boolean {
    const marcados = bloque.filter((kasu) => this.kasuakAEstudiar.includes(kasu)).length;
    return marcados > 0 && marcados < bloque.length;
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