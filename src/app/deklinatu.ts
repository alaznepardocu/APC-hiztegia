import { DeklinabideHitza,
  ERAKUSLEAK,
  FormaDeklinatua,
  HITZ_MOTAK,
  HitzMota,
  PERTSONA_IZEN_ORDAINAK } from "./hiztegia";

export type Kasua = typeof KASUAK[number];
export type Zenbakia = 'singularra' | 'plurala' | 'mugagabea';
export type IzenMota = HitzMota;
export type FormaDeclinadaMap = Partial<Record<Kasua, string>>;

export const KASUAK = [
  'nor', 'nork', 'nori', 'noren', 'norekin', 'norentzat', 'zertaz',
  'non', 'nondik', 'nora', 'norantz', 'noraino', 'nongo',
  'norengan', 'norengandik', 'norengana', 'norenganantz', 'norenganaino',
] as const;

const KASU_GRAMATIKALAK: Kasua[] = [
  "nor", "nork", "nori", "noren", "norekin", "norentzat", "zertaz"
] as const;

export const OINARRIZKOAK: Kasua[] = ["nor", "nork", "nori"];
export const ERLAZIOZKOAK: Kasua[] = ["noren", "norekin", "norentzat", "zertaz"];
export const LEKUKOAK: Kasua[] = ["non", "nondik", "nora", "norantz", "noraino", "nongo"];
export const BIZIDUN_KASUAK: Kasua[] = [
  "norengan", "norengandik", "norengana", "norenganantz", "norenganaino"
];

const KASU_LEKUZKOAK: Kasua[] = ['non', 'nondik', 'nora', 'norantz', 'noraino', 'nongo'];
const KASU_BIZIDUNAK: Kasua[] = [
  'norengan', 'norengandik', 'norengana', 'norenganantz', 'norenganaino'
];

const KASU_LEKUZKO_MUGIMENDU_ETA_KOKAPENA: readonly Kasua[] = [
  "non",
  "nondik",
  "nora",
  "norantz",
  "noraino",
] as const;

// Excepciones inanimadas comunes que aceptan con naturalidad NORI / NORENTZAT
const NORI_NORENTZAT_BIZIGABE_BAIMENDUAK = new Set([
  "herri",
  "hiri",
]);

// Sustantivos comunes inanimados (lugar y tiempo) que encajan bien en NON / NONDIK / NORA / NORANTZ / NORAINO
const LEKU_ETA_DENBORA_BIZIGABE_BAIMENDUAK = new Set([
  "bulego", "parke", "denda", "taberna", "jatetxe", "ospitale",
"unibertsitate", "gela", "sukalde", "komun", "baso", "hondartza",
"zelai", "plaza", "zubi", "geltoki", "aste", "hilabete",
"urte", "goiz", "arratsalde"
]);

// Sustantivos comunes inanimados que pueden actuar como agente/causa en NORK con naturalidad
const NORK_BIZIGABE_BAIMENDUAK = new Set([
  "haize",
  "euri",
  "ekaitz",
  "elur",
  "eguzki",
  "su",
  "ura",
  "ur",
  "tximista",
  "trumoia",
]);



export interface PraktikaItem {
  hitza: DeklinabideHitza;
  kasua: Kasua;
  zenbakia: Zenbakia;
}

const ATZIZKIAK: Record<Kasua, Record<Zenbakia, string>> = {
  nor: { singularra: 'a', plurala: 'ak', mugagabea: '' },
  nork: { singularra: 'ak', plurala: 'ek', mugagabea: 'k' },
  nori: { singularra: 'ari', plurala: 'ei', mugagabea: 'i' },
  noren: { singularra: 'aren', plurala: 'en', mugagabea: 'en' },
  norekin: { singularra: 'arekin', plurala: 'ekin', mugagabea: 'ekin' },
  norentzat: { singularra: 'arentzat', plurala: 'entzat', mugagabea: 'entzat' },
  zertaz: { singularra: 'az', plurala: 'ez', mugagabea: 'z' },
  non: { singularra: 'an', plurala: 'etan', mugagabea: 'tan' },
  nondik: { singularra: 'tik', plurala: 'etatik', mugagabea: 'tatik' },
  nora: { singularra: 'ra', plurala: 'etara', mugagabea: 'tara' },
  nongo: { singularra: 'ko', plurala: 'etako', mugagabea: 'tako' },
  norantz: { singularra: 'rantz', plurala: 'etarantz', mugagabea: 'tarantz' },
  noraino: { singularra: 'raino', plurala: 'etaraino', mugagabea: 'taraino' },
  norengan: { singularra: 'rengan', plurala: 'engan', mugagabea: 'engan' },
  norengandik: { singularra: 'rengandik', plurala: 'engandik', mugagabea: 'engandik' },
  norengana: { singularra: 'rengana', plurala: 'engana', mugagabea: 'engana' },
  norenganantz: { singularra: 'renganantz', plurala: 'enganantz', mugagabea: 'enganantz' },
  norenganaino: { singularra: 'renganaino', plurala: 'enganaino', mugagabea: 'enganaino' },
};

export const FORMAK_BEREZIAK: Record<string, FormaDeclinadaMap> = {
  // --- PERTSONA IZEN ORDAINAK (sin hura / haiek) ---
  ni: {
    nor: 'ni',
    nork: 'nik',
    nori: 'niri',
    noren: 'nire',
    norekin: 'nirekin',
    norentzat: 'niretzat',
    zertaz: 'nitaz',
    norengan: 'nigan',
    norengandik: 'nigandik',
    norengana: 'nigana',
    norenganantz: 'niganantz',
    norenganaino: 'niganaino',
  },
  hi: {
    nor: 'hi',
    nork: 'hik',
    nori: 'hiri',
    noren: 'hire',
    norekin: 'hirekin',
    norentzat: 'hiretzat',
    zertaz: 'hitaz',
    norengan: 'higan',
    norengandik: 'higandik',
    norengana: 'higana',
    norenganantz: 'higanantz',
    norenganaino: 'higanaino',
  },
  zu: {
    nor: 'zu',
    nork: 'zuk',
    nori: 'zuri',
    noren: 'zure',
    norekin: 'zurekin',
    norentzat: 'zuretzat',
    zertaz: 'zutaz',
    norengan: 'zugan',
    norengandik: 'zugandik',
    norengana: 'zugana',
    norenganantz: 'zuganantz',
    norenganaino: 'zuganaino',
  },
  gu: {
    nor: 'gu',
    nork: 'guk',
    nori: 'guri',
    noren: 'gure',
    norekin: 'gurekin',
    norentzat: 'guretzat',
    zertaz: 'gutaz',
    norengan: 'gugan',
    norengandik: 'gugandik',
    norengana: 'gugana',
    norenganantz: 'guganantz',
    norenganaino: 'guganaino',
  },
  zuek: {
    nor: 'zuek',
    nork: 'zuek',
    nori: 'zuei',
    noren: 'zuen',
    norekin: 'zuekin',
    norentzat: 'zuentzat',
    zertaz: 'zuetaz',
    norengan: 'zuegan',
    norengandik: 'zuegandik',
    norengana: 'zuegana',
    norenganantz: 'zueganantz',
    norenganaino: 'zueganaino',
  },

  // --- ERAKUSLEAK: SINGULARRA ---
  hau: {
    nor: 'hau',
    nork: 'honek',
    nori: 'honi',
    noren: 'honen',
    norekin: 'honekin',
    norentzat: 'honentzat',
    zertaz: 'honetaz',
    norengan: 'honengan',
    norengandik: 'honengandik',
    norengana: 'honengana',
    norenganantz: 'honenganantz',
    norenganaino: 'honenganaino',
  },
  hori: {
    nor: 'hori',
    nork: 'horrek',
    nori: 'horri',
    noren: 'horren',
    norekin: 'horrekin',
    norentzat: 'horrentzat',
    zertaz: 'horretaz',
    norengan: 'horrengan',
    norengandik: 'horrengandik',
    norengana: 'horrengana',
    norenganantz: 'horrenganantz',
    norenganaino: 'horrenganaino',
  },
  hura: {
    nor: 'hura',
    nork: 'hark',
    nori: 'hari',
    noren: 'haren',
    norekin: 'harekin',
    norentzat: 'harentzat',
    zertaz: 'hartaz',
    norengan: 'harengan',
    norengandik: 'harengandik',
    norengana: 'harengana',
    norenganantz: 'harenganantz',
    norenganaino: 'harenganaino',
  },

  // --- ERAKUSLEAK: PLURALA ---
  hauek: {
    nor: 'hauek',
    nork: 'hauek',
    nori: 'hauei',
    noren: 'hauen',
    norekin: 'hauekin',
    norentzat: 'hauentzat',
    zertaz: 'hauetaz',
    norengan: 'hauegan',
    norengandik: 'hauegandik',
    norengana: 'hauegana',
    norenganantz: 'haueganantz',
    norenganaino: 'haueganaino',
  },
  horiek: {
    nor: 'horiek',
    nork: 'horiek',
    nori: 'horiei',
    noren: 'horien',
    norekin: 'horiekin',
    norentzat: 'horientzat',
    zertaz: 'horietaz',
    norengan: 'horiegan',
    norengandik: 'horiegandik',
    norengana: 'horiegana',
    norenganantz: 'horieganantz',
    norenganaino: 'horieganaino',
  },
  haiek: {
    nor: 'haiek',
    nork: 'haiek',
    nori: 'haiei',
    noren: 'haien',
    norekin: 'haiekin',
    norentzat: 'haientzat',
    zertaz: 'haietaz',
    norengan: 'haiengan',
    norengandik: 'haiengandik',
    norengana: 'haiengana',
    norenganantz: 'haienganantz',
    norenganaino: 'haienganaino',
  },
};


export function deklinatu(
  raiz: string,
  kasua: Kasua,
  zenbakia: Zenbakia,
  izenMota: IzenMota,
  bizigabea: boolean
): string {
  if (!raiz) {
    return '';
  }

  let palabraLimpia = raiz.trim().toLowerCase();

  // Bloqueo explícito: hura / haiek nunca pertenecen a pertsonaIzenOrdaina
  if (
    izenMota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA &&
    ["hura", "haiek"].includes(palabraLimpia)
  ) {
    return "";
  }

  // Si es pertsonaIzenOrdaina o erakuslea, buscamos en FORMAK_BEREZIAK
  if (
    izenMota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA ||
    izenMota === HITZ_MOTAK.ERAKUSLEA
  ) {
    // Bloquea casos locativos inanimados si es animado
    if (!bizigabea && KASU_LEKUZKOAK.includes(kasua)) {
      return "";
    }
    // Bloquea casos animados si es inanimado
    if (bizigabea && KASU_BIZIDUNAK.includes(kasua)) {
      return "";
    }

    const formaBerezia = FORMAK_BEREZIAK[palabraLimpia]?.[kasua];
    return formaBerezia ?? "";
  }

  const ultimaLetra = palabraLimpia.slice(-1);
  const terminaEnVocal = ["a", "e", "i", "o", "u"].includes(ultimaLetra);
  const terminaEnA = ultimaLetra === "a";
  const terminaEnR = ultimaLetra === "r";
  const terminaEnLoN = ["l", "n"].includes(ultimaLetra);

  const rSuaves = [
    "ur", "zur", "paper", "plater", "karter",
    "lider", "txofer", "motor", "kontainer",
    "zer", "nor", "ezer", "inor", "edonor"
  ];
  const doblarR = terminaEnR && !rSuaves.includes(palabraLimpia);

  const aOrganikoLekuak = [
    "azpeitia", "azkoitia", "hendaia", "ermua",
    "ondarroa", "bizkaia", "gipuzkoa", "nafarroa", "araba"
  ];

  const sufijoBase = ATZIZKIAK[kasua][zenbakia];
  let enlace = "";

  // =========================================================
  // BLOQUE 1: Casos gramaticales (NOR - ZERTAZ)
  // =========================================================
  if (KASU_GRAMATIKALAK.includes(kasua)) {
    const zenbakiEfektiboa: Zenbakia = izenMota === "izenBerezia" ? "mugagabea" : zenbakia;

    if (zenbakiEfektiboa === "mugagabea") {
      if (doblarR && kasua !== "nor") enlace += "r";

      switch (kasua) {
        case "nor":
          break;
        case "nork":
        case "zertaz":
          if (!terminaEnVocal) enlace += "e";
          break;
        case "nori":
        case "noren":
        case "norekin":
        case "norentzat":
          if (terminaEnVocal) enlace += "r";
          break;
      }

      return palabraLimpia + enlace + ATZIZKIAK[kasua]["mugagabea"];
    } else {
      if (terminaEnA) {
        palabraLimpia = palabraLimpia.slice(0, -1);
      } else if (doblarR) {
        enlace += "r";
      }
      return palabraLimpia + enlace + sufijoBase;
    }
  }

  // =========================================================
  // BLOQUE 2: Casos locativos animados (NORENGAN - NORENGANAINO)
  // Solo permitidos para sustantivos animados (!bizigabea)
  // =========================================================
  if (KASU_BIZIDUNAK.includes(kasua)) {
    if (bizigabea) {
      return "";
    }

    // Izen berezi bizidunak (Mikel, Ane, Aitor)
    if (izenMota === "izenBerezia") {
      if (doblarR || terminaEnVocal) enlace += "r";
      return palabraLimpia + enlace + ATZIZKIAK[kasua]["mugagabea"];
    }

    // Izen arrunt bizidunak (mutil, neska, seme, txakur)
    if (zenbakia === "singularra") {
      if (doblarR) enlace += "r";
      if (!terminaEnA) enlace += "a"; // mutil + a + rengan | neska + rengan
      return palabraLimpia + enlace + sufijoBase;
    } else if (zenbakia === "plurala") {
      if (terminaEnA) {
        palabraLimpia = palabraLimpia.slice(0, -1); // neska -> neskengan
      } else if (doblarR) {
        enlace += "r"; // txakur -> txakurrengan
      }
      return palabraLimpia + enlace + sufijoBase;
    } else {
      // mugagabea
      if (doblarR || terminaEnVocal) enlace += "r"; // neskarengan, semerengan
      return palabraLimpia + enlace + sufijoBase;
    }
  }

  // =========================================================
  // BLOQUE 3: Casos locativos inanimados (NON - NONGO)
  // Solo permitidos para sustantivos inanimados (bizigabea)
  // =========================================================
  if (KASU_LEKUZKOAK.includes(kasua)) {
    if (!bizigabea) {
      return "";
    }

    // Izen berezi bizigabeak (Bilbo, Irun, Eibar, Donostia)
    if (izenMota === "izenBerezia") {
      if (aOrganikoLekuak.includes(palabraLimpia)) {
        if (["nondik", "nora", "nongo", "norantz", "noraino"].includes(kasua)) {
          palabraLimpia = palabraLimpia.slice(0, -1);
        }
      }

      if (kasua === "nongo" && terminaEnLoN) return palabraLimpia + "go";
      if (kasua === "nondik" && terminaEnLoN) return palabraLimpia + "dik";

      if (doblarR) enlace += "r";

      switch (kasua) {
        case "non":
          return palabraLimpia + enlace + (terminaEnVocal ? "n" : "en");
        case "nondik":
        case "nora":
        case "norantz":
        case "noraino":
        case "nongo":
        default:
          if (!terminaEnVocal) enlace += "e";
          return palabraLimpia + enlace + ATZIZKIAK[kasua]["singularra"];
      }
    } else {
      // Izen arrunt bizigabeak (etxe, mendi, haran, hondartza, ur)
      if (zenbakia === "singularra") {
        if (terminaEnA && kasua === "non") {
          palabraLimpia = palabraLimpia.slice(0, -1);
        } else if (!terminaEnVocal) {
          if (doblarR) enlace += "r";
          enlace += "e";
        }
        return palabraLimpia + enlace + sufijoBase;
      } else if (zenbakia === "plurala") {
        if (terminaEnA) {
          palabraLimpia = palabraLimpia.slice(0, -1);
        } else if (doblarR) {
          enlace += "r";
        }
        return palabraLimpia + enlace + sufijoBase;
      } else {
        // mugagabea
        if (!terminaEnVocal) {
          if (doblarR) enlace += "r";
          return palabraLimpia + enlace + ATZIZKIAK[kasua]["plurala"];
        }
        return palabraLimpia + sufijoBase;
      }
    }
  }

  return "";
}

export function esCombinacionValida(
  hitza: DeklinabideHitza,
  kasua: Kasua,
  zenbakia: Zenbakia
): boolean {
  const esAnimado =
    "biziduna" in hitza ? Boolean(hitza.biziduna) : !(hitza as any).bizigabe;
  const formaLimpia = hitza.eu.trim().toLowerCase();

  // hura / haiek solo en erakusleak, nunca en pertsonaIzenOrdaina
  if (
    hitza.mota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA &&
    ["hura", "haiek"].includes(formaLimpia)
  ) {
    return false;
  }

  // Los sustantivos/elementos ANIMADOS no usan casos locativos inanimados
  if (esAnimado && KASU_LEKUZKOAK.includes(kasua)) {
    return false;
  }

  // Los sustantivos/elementos INANIMADOS no usan casos animados
  if (!esAnimado && KASU_BIZIDUNAK.includes(kasua)) {
    return false;
  }

  // Reglas específicas para nombres comunes INANIMADOS (izenArrunta + !esAnimado)
  if (hitza.mota === HITZ_MOTAK.IZEN_ARRUNTA && !esAnimado) {
    // 1. NORK solo en causas/fuerzas naturales permitidas
    if (kasua === "nork" && !NORK_BIZIGABE_BAIMENDUAK.has(formaLimpia)) {
      return false;
    }

    // 2. NORI y NORENTZAT bloqueados salvo excepciones puntuales (herri, hiri)
    if (
      (kasua === "nori" || kasua === "norentzat") &&
      !NORI_NORENTZAT_BIZIGABE_BAIMENDUAK.has(formaLimpia)
    ) {
      return false;
    }

    // 3. NON, NONDIK, NORA, NORANTZ y NORAINO limitados a lugares/tiempos permitidos
    if (
      KASU_LEKUZKO_MUGIMENDU_ETA_KOKAPENA.includes(kasua) &&
      !LEKU_ETA_DENBORA_BIZIGABE_BAIMENDUAK.has(formaLimpia)
    ) {
      return false;
    }
  }

  // Pertsona izen ordainak y erakusleak tienen un zenbakia fijo ('singularra' o 'plurala')
  if (
    hitza.mota === HITZ_MOTAK.PERTSONA_IZEN_ORDAINA ||
    hitza.mota === HITZ_MOTAK.ERAKUSLEA
  ) {
    if (hitza.zenbakia && zenbakia !== hitza.zenbakia) {
      return false;
    }
    return Boolean(FORMAK_BEREZIAK[formaLimpia]?.[kasua]);
  }

  if (hitza.mota === HITZ_MOTAK.IZEN_BEREZIA) {
    if (zenbakia !== "mugagabea") {
      return false;
    }

    if (!esAnimado && (kasua === "nori" || kasua === "norentzat")) {
      return false;
    }
  }

  return true;
}


export function dividirForma(
  palabraOriginal: string,
  resultado: string,
  esNombrePropio = false
): FormaDeklinatua {
  if (!resultado) {
    return { valido: false, raiz: '', sufijo: '', completa: '' };
  }

  const base = palabraOriginal.trim();
  const baseMinuscula = base.toLowerCase();
  const resultadoMinuscula = resultado.toLowerCase();

  const capitalizarInicial = (texto: string): string => {
    if (!texto) return texto;
    const debeCapitalizar =
      esNombrePropio ||
      (base.length > 0 &&
        base[0] === base[0].toUpperCase() &&
        base[0] !== base[0].toLowerCase());

    if (!debeCapitalizar) return texto;
    return texto[0].toUpperCase() + texto.slice(1);
  };

  // Caso 1: El resultado empieza exactamente por la palabra base (ej. "amaia" + "k" -> "Amaia" + "K", "unai" + "ek" -> "Unai" + "EK")
  if (resultadoMinuscula.startsWith(baseMinuscula)) {
    const raiz = capitalizarInicial(base);
    const sufijo = resultado.slice(base.length).toUpperCase();

    return {
      valido: true,
      raiz,
      sufijo,
      completa: sufijo ? `${raiz}-${sufijo}` : raiz,
    };
  }

  // Caso 2: Hubo cambio vocálico al final (ej. "neska" -> "neskaren" o "etxe" -> "etxean")
  let indice = 0;
  while (
    indice < baseMinuscula.length &&
    indice < resultadoMinuscula.length &&
    baseMinuscula[indice] === resultadoMinuscula[indice]
  ) {
    indice++;
  }

  const raiz = capitalizarInicial(resultado.slice(0, indice));
  const sufijo = resultado.slice(indice).toUpperCase();

  return {
    valido: true,
    raiz,
    sufijo,
    completa: sufijo ? `${raiz}-${sufijo}` : raiz,
  };
}
