export interface Hitz {
    id?: string,
    eu: string,
    eu_alt?: string[],
    notaeu?: string | null,
    es: string[],            // antes era string: ahora una palabra puede tener varios significados
    notaes?: string | null,
    maila: string,           // nivel: A1, A2...
    ikasturtea: number,      // año en que empieza el curso: 2026 = curso 2026-27
    data: string             // 'YYYY-MM-DD' (antes '06-oct')
}

export type NuevaHitz = Omit<Hitz, 'id'>;

// Formas "antiguas" de los verbos: el servicio las sigue ofreciendo para que
// las pantallas de verbos no cambien, aunque en la base de datos estén unificados.
export interface Trinkoa {
    konjugaioa: string,
    pertsona:   string,
    aditza:     string,
    denbora:    string,
    objektu?: string,
}

export interface NorNork {
    aditza:    string,
    konjugaioa: string,
    nor:        string,
    nork:       string,
    denbora:    string,
    modua: string;
}

// Fila de la tabla unificada "aditzak" (trinkoak + auxiliarrak)
export interface AditzaFila {
    id: string,
    mota: 'nor' | 'nork' | 'nor-nork',
    modua: string | null,
    aditza: string,
    denbora: string,
    nor: string | null,
    nork: string | null,
    objektu: 'singularra' | 'plurala' | null,
    konjugaioa: string
}

export interface AditzGehigarria {
    id: string,
    grupo: string,
    aditzak: string[],        // verbos a los que se aplica: ['eduki', 'ukan']
    objektu: 'singularra' | 'plurala' | null,
    texto: string
}

export const HITZ_MOTAK = {
  IZEN_ARRUNTA: 'izenArrunta',
  IZEN_BEREZIA: 'izenBerezia',
} as const;

export type HitzMota = (typeof HITZ_MOTAK)[keyof typeof HITZ_MOTAK];

export const HITZ_MOTA_ETIKETAK: Record<HitzMota, string> = {
  [HITZ_MOTAK.IZEN_ARRUNTA]: 'Izen arrunta',
  [HITZ_MOTAK.IZEN_BEREZIA]: 'Izen berezia',
};

export interface DeklinabideHitza {
  hitza: string;
  mota: HitzMota;
  biziduna: boolean;
}