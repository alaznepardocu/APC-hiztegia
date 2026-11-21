import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  deklinatu,
  esCombinacionValida,
  KASUAK,
  Kasua,
  OINARRIZKOAK,
  ERLAZIOZKOAK,
  LEKUKOAK,
  BIZIDUN_KASUAK,
  Zenbakia,
  dividirForma,
  FORMAK_BEREZIAK,
} from '../deklinatu';
import { FormaDeklinatua, HITZ_MOTAK, HitzMota } from '../hiztegia';
import { readonly } from '@angular/forms/signals';

function zatituForma(hitza: string, forma: string): FormaDeklinatua {
  const valida = forma.length > 0;
  if (!valida) {
    return { valido: false, raiz: '', sufijo: '', completa: '' };
  }

  const raiz = forma.startsWith(hitza) ? hitza : forma;
  const sufijo = forma.startsWith(hitza) ? forma.slice(hitza.length) : '';
  return { valido: true, raiz, sufijo, completa: forma };
}
interface KasuLerroa {
  zenbakiaLabel: string;
  bokala: FormaDeklinatua;
  kontsonantea: FormaDeklinatua;
}

interface KasuTaulaView {
  kasua: Kasua;
  izenburua: string;
  lerroak: KasuLerroa[];
}

const KASU_IZNABURUAK: Record<Kasua, string> = {
  nor: 'NOR / ZER KASUA',
  nork: 'NORK / ZERK KASUA',
  nori: 'NORI / ZERI KASUA',
  noren: 'NOREN / ZEREN KASUA',
  norekin: 'NOREKIN / ZEREKIN KASUA',
  norentzat: 'NORENTZAT / ZERTZAT KASUA',
  zertaz: 'ZERTAZ KASUA',
  non: 'NON / ZERTAN KASUA',
  nondik: 'NONDIK / ZERTATIK KASUA',
  nora: 'NORA / ZERTARA KASUA',
  norantz: 'NORANTZ / ZERTARANTZ KASUA',
  noraino: 'NORAINO / ZERTARAINO KASUA',
  nongo: 'NONGO / ZERTAKO KASUA',
  norengan: 'NORENGAN KASUA',
  norengandik: 'NORENGANDIK KASUA',
  norengana: 'NORENGANA KASUA',
  norenganantz: 'NORENGANANTZ KASUA',
  norenganaino: 'NORENGANAINO KASUA',
};

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-deklinabide-taulak',
  styleUrl: './deklinabide-taulak.css',
  templateUrl: './deklinabide-taulak.html',
})
export class DeklinabideTaulak {
  // false = biziduna (por defecto para ume/mutil/Amaia/Unai), true = bizigabea
  bizigabea = signal(false);

  // Palabras por defecto para cada bloque
  private readonly gramatikalakHitzaBokala = 'ume';
  private readonly gramatikalakHitzaKontsonantea = 'mutil';

  private readonly lekuzkoakHitzaBokala = 'mendi';
  private readonly lekuzkoakHitzaKontsonantea = 'haran';

  // Nombres de lugar específicos para Leku-kasuak (Bizigabeak)
  private readonly lekuzkoakLekuBokala = 'Bilbo';
  private readonly lekuzkoakLekuKontsonantea = 'Zarautz';

  // Nombres propios animados para Kasu Gramatikalak y Leku-kasuak (Bizidunak)
  private readonly izenBereziaBokala = 'Amaia';
  private readonly izenBereziaKontsonantea = 'Mikel';

  readonly pertsonaIzenOrdainak = ['ni', 'hi', 'zu', 'gu', 'zuek'] as const;
  readonly erakusleakSingularra = ['hau', 'hori', 'hura'] as const;
  readonly erakusleakPlurala = ['hauek', 'horiek', 'haiek'] as const;

  // Solo mostramos los casos que tienen alguna forma definida en FORMAK_BEREZIAK (excluye non..nongo)
readonly kasuakBereziak = KASUAK.filter(
  (kasua) => Boolean(FORMAK_BEREZIAK['ni']?.[kasua])
);

obtenerFormaBerezia(hitza: string, kasua: Kasua): string {
  return FORMAK_BEREZIAK[hitza]?.[kasua] || '—';
}

  taulakGramatikalak = computed<KasuTaulaView[]>(() =>
    [...OINARRIZKOAK, ...ERLAZIOZKOAK].map((kasua) =>
      this.construirTaula(
        kasua,
        this.gramatikalakHitzaBokala,
        this.gramatikalakHitzaKontsonantea,
        this.izenBereziaBokala,
        this.izenBereziaKontsonantea,
        false
      )
    )
  );

  taulakLekuzkoak = computed<KasuTaulaView[]>(() =>
  LEKUKOAK.map((kasua) =>
    this.construirTaula(
      kasua,
      this.lekuzkoakHitzaBokala,
      this.lekuzkoakHitzaKontsonantea,
      this.lekuzkoakLekuBokala,
      this.lekuzkoakLekuKontsonantea,
      true
    )
  )
);

  taulakBizidunak = computed<KasuTaulaView[]>(() =>
    BIZIDUN_KASUAK.map((kasua) =>
      this.construirTaula(
        kasua,
        this.gramatikalakHitzaBokala,
        this.gramatikalakHitzaKontsonantea,
        this.izenBereziaBokala,
        this.izenBereziaKontsonantea,
        false
      )
    )
  );

  private construirTaula(
    kasua: Kasua,
    bokalaHitza: string,
    kontsonanteaHitza: string,
    bereziaBokala: string,
    bereziaKontsonantea: string,
    bizigabea: boolean
  ): KasuTaulaView {
    return {
      kasua,
      izenburua: KASU_IZNABURUAK[kasua],
      lerroak: [
        {
          zenbakiaLabel: 'Singularra',
          bokala: this.calcular(bokalaHitza, kasua, 'singularra', HITZ_MOTAK.IZEN_ARRUNTA, bizigabea),
          kontsonantea: this.calcular(kontsonanteaHitza, kasua, 'singularra', HITZ_MOTAK.IZEN_ARRUNTA, bizigabea),
        },
        {
          zenbakiaLabel: 'Plurala',
          bokala: this.calcular(bokalaHitza, kasua, 'plurala', HITZ_MOTAK.IZEN_ARRUNTA, bizigabea),
          kontsonantea: this.calcular(kontsonanteaHitza, kasua, 'plurala', HITZ_MOTAK.IZEN_ARRUNTA, bizigabea),
        },
        {
          zenbakiaLabel: 'Mugagabea',
          bokala: this.calcular(bokalaHitza, kasua, 'mugagabea', HITZ_MOTAK.IZEN_ARRUNTA, bizigabea),
          kontsonantea: this.calcular(kontsonanteaHitza, kasua, 'mugagabea', HITZ_MOTAK.IZEN_ARRUNTA, bizigabea),
        },
        {
          zenbakiaLabel: 'Izen Bereziak',
          bokala: this.calcular(bereziaBokala, kasua, 'mugagabea', HITZ_MOTAK.IZEN_BEREZIA, bizigabea),
          kontsonantea: this.calcular(bereziaKontsonantea, kasua, 'mugagabea', HITZ_MOTAK.IZEN_BEREZIA, bizigabea),
        },
      ],
    };
  }

  private calcular(
    hitza: string,
    kasua: Kasua,
    zenbakia: Zenbakia,
    mota: HitzMota,
    bizigabea: boolean
  ): FormaDeklinatua {
    const raw = deklinatu(hitza, kasua, zenbakia, mota, bizigabea);
    if (!raw) {
      return { valido: false, raiz: '', sufijo: '', completa: '' };
    }
    return dividirForma(hitza, raw, mota === HITZ_MOTAK.IZEN_BEREZIA);
  }

  irAID(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}