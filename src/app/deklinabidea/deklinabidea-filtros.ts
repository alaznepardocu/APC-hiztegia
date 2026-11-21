import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceHiztegia } from '../hiztegiService';
import { DeklinabideHitza, PERTSONA_IZEN_ORDAINAK, ERAKUSLEAK, HITZ_MOTAK } from '../hiztegia';
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

export interface FiltroPalabrasConfig {
  pertsonaIzenOrdainak: boolean;
  erakusleak: boolean;
  izenBereziaLekua: boolean;   // mota === 'izenBerezia' && bizigabe === true
  izenBereziaPertsona: boolean; // mota === 'izenBerezia' && bizigabe === false
  izenArruntaBizigabe: boolean; // mota === 'izenArrunta' && bizigabe === true
  izenArruntaBizidun: boolean;  // mota === 'izenArrunta' && bizigabe === false
}

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
  readonly bizidunak = BIZIDUN_KASUAK;

  kasuakAEstudiar: Kasua[] = [];
  textoFiltrado = '';
  nPractica: number = 1;
  todasLasPalabras: DeklinabideHitza[] = [];

  // Selector de tipos de palabra
  filtroPalabras: FiltroPalabrasConfig = {
    pertsonaIzenOrdainak: true,
    erakusleak: true,
    izenBereziaLekua: true,
    izenBereziaPertsona: true,
    izenArruntaBizigabe: true,
    izenArruntaBizidun: true,
  };

  // Selector de números (singularra / plurala / mugagabea)
  zenbakiakSeleccionados: Record<Zenbakia, boolean> = {
    singularra: true,
    plurala: true,
    mugagabea: true,
  };

  readonly zenbakiAukerak: { valor: Zenbakia; etiqueta: string }[] = [
    { valor: 'singularra', etiqueta: 'Singularra' },
    { valor: 'plurala', etiqueta: 'Plurala' },
    { valor: 'mugagabea', etiqueta: 'Mugagabea' },
  ];

  @Output() empezar = new EventEmitter<PraktikaItem[]>();

  constructor(public readonly serviceHiztegia: ServiceHiztegia) {}

  ngOnInit(): void {
    const rawHitzak = this.serviceHiztegia.deklinabideHitzak
      ? this.serviceHiztegia.deklinabideHitzak()
      : [];
    this.todasLasPalabras = Array.isArray(rawHitzak) ? rawHitzak : [];
    this.actualizarMensaje();
  }

  // Lista activa de zenbakiak marcados
  get zenbakiakActivos(): Zenbakia[] {
    return (['singularra', 'plurala', 'mugagabea'] as Zenbakia[]).filter(
      (z) => this.zenbakiakSeleccionados[z]
    );
  }

  // Palabras resultantes según el filtro de palabras elegido
  get hitzakAEstudiar(): DeklinabideHitza[] {
    const resultado: DeklinabideHitza[] = [];

    for (const hitza of this.todasLasPalabras ?? []) {
      if (hitza.mota === HITZ_MOTAK.IZEN_BEREZIA) {
        if (hitza.bizigabe && this.filtroPalabras.izenBereziaLekua) {
          resultado.push(hitza);
        } else if (!hitza.bizigabe && this.filtroPalabras.izenBereziaPertsona) {
          resultado.push(hitza);
        }
      } else if (hitza.mota === HITZ_MOTAK.IZEN_ARRUNTA) {
        if (hitza.bizigabe && this.filtroPalabras.izenArruntaBizigabe) {
          resultado.push(hitza);
        } else if (!hitza.bizigabe && this.filtroPalabras.izenArruntaBizidun) {
          resultado.push(hitza);
        }
      }
    }

    if (this.filtroPalabras.pertsonaIzenOrdainak) {
      resultado.push(...PERTSONA_IZEN_ORDAINAK);
    }

    if (this.filtroPalabras.erakusleak) {
      resultado.push(...ERAKUSLEAK);
    }

    return resultado;
  }

  onChangeZenbakia(zenbakia: Zenbakia, checked: boolean): void {
    this.zenbakiakSeleccionados[zenbakia] = checked;
    this.actualizarMensaje();
  }

  seleccionarTodosZenbakiak(checked: boolean): void {
    this.zenbakiakSeleccionados = {
      singularra: checked,
      plurala: checked,
      mugagabea: checked,
    };
    this.actualizarMensaje();
  }

  get todosZenbakiakSeleccionados(): boolean {
    return (['singularra', 'plurala', 'mugagabea'] as Zenbakia[]).every(
      (z) => this.zenbakiakSeleccionados[z]
    );
  }

  seleccionarTodasPalabras(checked: boolean): void {
    this.filtroPalabras = {
      pertsonaIzenOrdainak: checked,
      erakusleak: checked,
      izenBereziaLekua: checked,
      izenBereziaPertsona: checked,
      izenArruntaBizigabe: checked,
      izenArruntaBizidun: checked,
    };
    this.actualizarMensaje();
  }

  get todasPalabrasSeleccionadas(): boolean {
    return Object.values(this.filtroPalabras).every(Boolean);
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
    } else if (this.zenbakiakActivos.length === 0) {
      this.textoFiltrado = 'Selecciona al menos un zenbakia';
    } else if (this.hitzakAEstudiar.length === 0) {
      this.textoFiltrado = 'No hay palabras disponibles con los filtros actuales';
    } else {
      this.textoFiltrado = '';
    }
  }

  private generarEjercicios(): PraktikaItem[] {
    const paresBase: { hitza: DeklinabideHitza; kasua: Kasua }[] = [];
    const cantidad = Math.max(1, this.nPractica || 1);
    const zenbakiakDisponibles = this.zenbakiakActivos;

    if (zenbakiakDisponibles.length === 0) {
      return [];
    }

    // `hitzakAEstudiar` ya incluye las palabras filtradas + pronombres/demostrativos activos
    const candidatos: DeklinabideHitza[] = this.hitzakAEstudiar;

    // 1. Filtramos elementos válidos para cada kasua
    for (const kasua of this.kasuakAEstudiar) {
      const palabrasValidasParaKasu = candidatos.filter((hitza) => {
        if (hitza.mota === HITZ_MOTAK.IZEN_BEREZIA) {
          return (
            zenbakiakDisponibles.includes('mugagabea') &&
            esCombinacionValida(hitza, kasua, 'mugagabea')
          );
        }

        if (
          hitza.mota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA ||
          hitza.mota === HITZ_MOTAK.ERAKUSLEA
        ) {
          const z = hitza.zenbakia ?? 'singularra';
          return (
            zenbakiakDisponibles.includes(z) &&
            esCombinacionValida(hitza, kasua, z)
          );
        }

        // Para izenArrunta, válida si funciona con al menos uno de los zenbakiak activos
        return zenbakiakDisponibles.some((z) =>
          esCombinacionValida(hitza, kasua, z)
        );
      });

      if (palabrasValidasParaKasu.length === 0) {
        continue;
      }

      const palabrasMezcladas = [...palabrasValidasParaKasu].sort(
        () => Math.random() - 0.5
      );

      const limite = Math.min(cantidad, palabrasValidasParaKasu.length);

      for (let i = 0; i < limite; i++) {
        paresBase.push({ hitza: palabrasMezcladas[i], kasua });
      }
    }

    // 2. Separamos por tipo de palabra
    const fijosBerezia = paresBase.filter(
      (p) => p.hitza.mota === HITZ_MOTAK.IZEN_BEREZIA
    );
    const ordainEtaErakusleak = paresBase.filter(
      (p) =>
        p.hitza.mota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA ||
        p.hitza.mota === HITZ_MOTAK.ERAKUSLEA
    );
    const izenArruntak = paresBase
      .filter(
        (p) =>
          p.hitza.mota !== HITZ_MOTAK.IZEN_BEREZIA &&
          p.hitza.mota !== HITZ_MOTAK.PERTSONA_IZEN_ORDAINA &&
          p.hitza.mota !== HITZ_MOTAK.ERAKUSLEA
      )
      .sort(() => Math.random() - 0.5);

    // 3. Izen bereziak -> mugagabea (si está activo)
    const ejerciciosBerezia: PraktikaItem[] = zenbakiakDisponibles.includes('mugagabea')
      ? fijosBerezia
          .filter((par) => esCombinacionValida(par.hitza, par.kasua, 'mugagabea'))
          .map((par) => ({
            ...par,
            zenbakia: 'mugagabea' as Zenbakia,
          }))
      : [];

    // 4. Pertsona izen ordainak y erakusleak -> conservan su zenbakia si está activo
    const ejerciciosOrdainErakusle: PraktikaItem[] = ordainEtaErakusleak
      .map((par) => {
        const z = (par.hitza.zenbakia ?? 'singularra') as Zenbakia;
        return { ...par, zenbakia: z };
      })
      .filter(
        (item) =>
          zenbakiakDisponibles.includes(item.zenbakia) &&
          esCombinacionValida(item.hitza, item.kasua, item.zenbakia)
      );

    // 5. Izen arruntak -> reparto equilibrado solo entre los zenbakiak activos
    const zenbakiOrdenados: Zenbakia[] = [...zenbakiakDisponibles].sort(
      () => Math.random() - 0.5
    );

    const ejerciciosArrunta: PraktikaItem[] = [];
    izenArruntak.forEach((par, index) => {
      const zenbakiakValidos = zenbakiOrdenados.filter((z) =>
        esCombinacionValida(par.hitza, par.kasua, z)
      );

      if (zenbakiakValidos.length > 0) {
        ejerciciosArrunta.push({
          ...par,
          zenbakia: zenbakiakValidos[index % zenbakiakValidos.length],
        });
      }
    });

    // 6. Mezclamos el resultado final
    return [
      ...ejerciciosBerezia,
      ...ejerciciosOrdainErakusle,
      ...ejerciciosArrunta,
    ].sort(() => Math.random() - 0.5);
  }

  isBloqueIndeterminado(bloque: readonly Kasua[]): boolean {
    const marcados = bloque.filter((kasu) => this.kasuakAEstudiar.includes(kasu)).length;
    return marcados > 0 && marcados < bloque.length;
  }

  iniciarPractica(): void {
    if (
      this.kasuakAEstudiar.length > 0 &&
      this.hitzakAEstudiar.length > 0 &&
      this.zenbakiakActivos.length > 0
    ) {
      const listaEjercicios = this.generarEjercicios();
      console.log('Ejercicios de prueba:', listaEjercicios);

      if (listaEjercicios.length === 0) {
        this.textoFiltrado =
          'No hay palabras compatibles con los kasuak y zenbakiak seleccionados.';
        return;
      }

      this.empezar.emit(listaEjercicios);
    }
  }
}