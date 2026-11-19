import { DeklinabideHitza, HITZ_MOTAK, HitzMota } from "../hiztegia";

export type Kasua = typeof KASUAK[number];
export type Zenbakia = 'singularra' | 'plurala' | 'mugagabea';
export type IzenMota = HitzMota;


export const KASUAK = [
  'nor', 'nork', 'nori', 'noren', 'norekin', 'norentzat', 'zertaz',
  'non', 'nondik', 'nora', 'norantz', 'noraino', 'nongo',
] as const;

const KASU_GRAMATIKALAK: Kasua[] = [
    "nor", "nork", "nori", "noren", "norekin", "norentzat", "zertaz"
] as const;

export const OINARRIZKOAK: Kasua[] = ["nor", "nork", "nori"]
export const ERLAZIOZKOAK: Kasua[] = ["noren", "norekin", "norentzat", "zertaz"]
export const LEKUKOAK: Kasua[] = ["non", "nondik", "nora", "norantz", "noraino", "nongo"]

const KASU_LEKUZKOAK: Kasua[] = ['non', 'nondik', 'nora', 'norantz', 'noraino', 'nongo'];

export interface PraktikaItem {
  hitza: DeklinabideHitza;
  kasua: Kasua;
  zenbakia: Zenbakia
}



const ATZIZKIAK:
    Record<Kasua,
        Record<Zenbakia, string>> = {
    nor: { singularra: 'a', plurala: 'ak', 'mugagabea': '' },
    nork: { singularra: 'ak', plurala: 'ek', 'mugagabea': 'k' },
    nori: { singularra: 'ari', plurala: 'ei', 'mugagabea': 'i' },
    noren: { singularra: 'aren', plurala: 'en', 'mugagabea': 'en' },
    norekin: { singularra: 'arekin', plurala: 'ekin', 'mugagabea': 'ekin' },
    norentzat: { singularra: 'arentzat', plurala: 'entzat', 'mugagabea': 'entzat' },
    zertaz: { singularra: 'az', plurala: 'ez', 'mugagabea': 'z' },
    non: { singularra: 'an', plurala: 'etan', 'mugagabea': 'tan' },
    nondik: { singularra: 'tik', plurala: 'etatik', 'mugagabea': 'tatik' },
    nora: { singularra: 'ra', plurala: 'etara', 'mugagabea': 'tara' },
    nongo: { singularra: 'ko', plurala: 'etako', 'mugagabea': 'tako' },
    norantz : {singularra: 'rantz', plurala: 'etarantz', mugagabea: 'tarantz'},
    noraino: {singularra: 'raino', plurala: 'etaraino', mugagabea: 'taraino'}
};
const BIZIDUN_ATZIZKIAK = {
    non: { singularra: 'rengan', plurala: 'engan', 'mugagabea': 'engan' },
    nondik: { singularra: 'rengandik', plurala: 'engandik', 'mugagabea': 'engandik' },
    nora: { singularra: 'rengana', plurala: 'engana', 'mugagabea': 'engana' },
    norantz: {singularra: 'renganantz', plurala: 'enganantz', mugagabea: 'enganantz'},
    noraino: {singularra: 'renganaino', plurala: 'enganaino', mugagabea: 'enganaino'}
};

export function deklinatu(raiz: string, kasua: Kasua, zenbakia: Zenbakia, izenMota: IzenMota, bizigabea: boolean): string {
    if (!raiz) {
        return '';
    }
    let palabraLimpia = raiz.trim().toLowerCase();
    const ultimaLetra = palabraLimpia.slice(-1);
    const terminaEnVocal = ["a", "e", "i", "o", "u"].includes(ultimaLetra);
    const terminaEnA = ultimaLetra === "a";
    const terminaEnR = ultimaLetra === "r";
    const terminaEnLoN = ["l", "n"].includes(ultimaLetra);
    const rSuaves = [
        "ur", "zur", "paper", "plater", "karter",
        "lider", "txofer", "motor", "kontainer",
        "zer", "nor", "ezer", "inor", "edonor"];
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

        // Solo dentro de este bloque, un izenBerezia equivale a mugagabea
        const zenbakiEfektiboa: Zenbakia = izenMota === "izenBerezia" ? "mugagabea" : zenbakia;
        if (zenbakiEfektiboa === "mugagabea") {
            // Si acaba en R fuerte, siempre dobla (excepto en 'nor', que no lleva sufijo)
            if (doblarR && kasua !== "nor") enlace += "r";

            switch (kasua) {
                case "nor":
                    // Se queda igual (etxe, mutil, txakur)
                    break;
                case "nork":
                case "zertaz":
                    // Llevan 'e' solo si termina en consonante (mutilek, mutilez / etxek, etxez)
                    if (!terminaEnVocal) enlace += "e";

                    break;

                case "nori":
                case "noren":
                case "norekin":
                case "norentzat":
                    // Llevan 'r' solo si termina en vocal (etxeri, etxeren / mutili, mutilen)
                    if (terminaEnVocal) enlace += "r";
                    break;
            }

            return palabraLimpia + enlace + ATZIZKIAK[kasua]["mugagabea"];
        }
        // 1. SINGULARRA Y PLURALA
        else {
            if (terminaEnA) {
                // neska + ak -> neskak | neska + ek -> neskek
                palabraLimpia = palabraLimpia.slice(0, -1);
            } else if (doblarR) {
                // txakur + a -> txakurra | txakur + ak -> txakurrak
                enlace += "r";
            }
            return palabraLimpia + enlace + sufijoBase;
        }


    }
    // =========================================================
    // BLOQUE 2: Casos locativos (NON, NONDIK, NORA, NONGO)
    // =========================================================

    // 2A. ANIMADOS (Tanto propios como comunes)

    else if (izenMota === "izenBerezia") {
        // ANIMADOS (Nombres de personas: Mikel, Ane, Aitor)
        if (!bizigabea) {
            if (kasua === "nongo") {
                return deklinatu(palabraLimpia, "noren", "mugagabea", izenMota, bizigabea);
            }
            if (doblarR) enlace += "r";
            if (terminaEnVocal) enlace += "r";
            const kasuLok = kasua as 'non' | 'nondik' | 'nora' | 'norantz' | 'noraino';
            return palabraLimpia + enlace + BIZIDUN_ATZIZKIAK[kasuLok]["mugagabea"];
        }
        // INANIMADOS (Nombres de lugares: Bilbo, Irun, Eibar, Donostia)
        else {
            if (aOrganikoLekuak.includes(palabraLimpia)) {
                // En NON mantiene la -a (Bizkaian, Azpeitian)
                // En el resto de casos locativos pierde la -a (Bizkaitik, Bizkaira, Bizkaiko, Bizkairantz, Bizkairaino)
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
        }
    }
    else {
        // ANIMADOS (mutil, neska, seme, txakur)
        if (!bizigabea) {
            if (kasua === "nongo") {
                return deklinatu(palabraLimpia, "noren", zenbakia, izenMota, bizigabea);
            }

            const kasuLok = kasua as 'non' | 'nondik' | 'nora' | 'norantz' | 'noraino';
            const sufijoAnimado = BIZIDUN_ATZIZKIAK[kasuLok][zenbakia];

            if (zenbakia === "singularra") {
                if (doblarR) enlace += "r";
                if (!terminaEnA) enlace += "a"; // mutil + a + rengan | neska + rengan
                return palabraLimpia + enlace + sufijoAnimado;
            }
            else if (zenbakia === "plurala") {
                if (terminaEnA) {
                    palabraLimpia = palabraLimpia.slice(0, -1); // neska -> neskengan
                } else if (doblarR) {
                    enlace += "r"; // txakur -> txakurrengan
                }
                return palabraLimpia + enlace + sufijoAnimado;
            }
            else { // mugagabea
                if (doblarR) enlace += "r";
                if (terminaEnVocal) enlace += "r"; // neskarengan, semerengan
                return palabraLimpia + enlace + sufijoAnimado;
            }
        }
        // INANIMADOS (etxe, mendi, haran, hondartza, ur)
        else {
            if (zenbakia === "singularra") {
                if (terminaEnA && kasua === "non") {
                    // Solo en NON se fusiona la -a: hondartza + an -> hondartzan
                    // En nondik/nora/nongo la mantiene: hondartzatik, hondartzara, hondartzako
                    palabraLimpia = palabraLimpia.slice(0, -1);
                } else if (!terminaEnVocal) {
                    if (doblarR) enlace += "r";
                    enlace += "e"; // haran -> haranean, haranetik
                }
                return palabraLimpia + enlace + sufijoBase;
            }

            else if (zenbakia === "plurala") {
                if (terminaEnA) {
                    palabraLimpia = palabraLimpia.slice(0, -1); // hondartza -> hondartzetan
                } else if (doblarR) {
                    enlace += "r";
                }
                return palabraLimpia + enlace + sufijoBase;
            }
            else { // mugagabea
                if (!terminaEnVocal) {
                    if (doblarR) enlace += "r";
                    // Tras consonante usa -etan, -etatik, -etara, -etako (igual que plural)
                    return palabraLimpia + enlace + ATZIZKIAK[kasua]["plurala"];
                }
                // Tras vocal usa -tan, -tatik, -tara, -tako
                return palabraLimpia + sufijoBase;
            }
        }
    }


}

export function esCombinacionValida(
  hitza: DeklinabideHitza,
  kasua: Kasua,
  zenbakia: Zenbakia
): boolean {
  // Normalizamos: es animado si biziduna es true (o si bizigabe es explícitamente false)
  const esAnimado = 'biziduna' in hitza ? Boolean(hitza.biziduna) : !(hitza as any).bizigabe;

  if (hitza.mota === HITZ_MOTAK.IZEN_BEREZIA) {
    if (zenbakia !== 'mugagabea') {
      return false;
    }

    // Nombre propio de LUGAR (esAnimado === false) -> bloquea nori y norentzat
    if (!esAnimado && (kasua === 'nori' || kasua === 'norentzat')) {
      return false;
    }

    // Nombre propio de PERSONA (esAnimado === true) -> bloquea nongo
    if (esAnimado && kasua === 'nongo') {
      return false;
    }
  }

  // Nombre común ANIMADO (esAnimado === true) -> bloquea nongo
  if (hitza.mota === HITZ_MOTAK.IZEN_ARRUNTA && esAnimado && kasua === 'nongo') {
    return false;
  }

  return true;
}


