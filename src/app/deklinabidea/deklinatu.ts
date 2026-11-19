export type Kasua = 'nor' | 'nork' | 'nori' | 'noren' | 'norekin' | 'norentzat' | 'zertaz';
export type Zenbakia = 'singularra' | 'plurala' | 'mugagabea';

const ATZIZKIAK:
Record<Kasua,
Record<Zenbakia, string>> = {
    nor: {singularra: 'a', plurala: 'ak', 'mugagabea': ''},
    nork: {singularra: 'ak', plurala: 'ek', 'mugagabea': 'k'},
    nori: {singularra: 'ari', plurala: 'ei', 'mugagabea': 'i'},
    noren: {singularra: 'aren', plurala: 'en', 'mugagabea': 'en'},
    norekin: {singularra: 'arekin', plurala: 'ekin', 'mugagabea': 'ekin'},
    norentzat: {singularra: 'arentzat', plurala: 'entzat', 'mugagabea': 'entzat'},
    zertaz: {singularra: 'az', plurala: 'ez', 'mugagabea': 'z'}
};

export function deklinatu (raiz: string, kasua: Kasua, zenbakia: Zenbakia): string{
    raiz = raiz.toLowerCase();
    const ultimaLetra = raiz.slice(-1);
    const terminaEnVocal = ["a", "e", "i", "o", "u"].includes(ultimaLetra);
    const terminaEnA = ultimaLetra === "a";
    const terminaEnR = ultimaLetra === "r";
    const rSuaves = [
    "ur", "zur", "paper", "plater", "karter", 
    "lider", "txofer", "motor", "kontainer", 
    "zer", "nor", "ezer", "inor", "edonor"];
    const doblarR = terminaEnR && !rSuaves.includes(raiz);

    const sufijoBase = ATZIZKIAK[kasua][zenbakia];
    let enlace = "";

    // 1. SINGULARRA Y PLURALA
    if (zenbakia === "singularra" || zenbakia === "plurala") {
        if (terminaEnA) {
            // neska + ak -> neskak | neska + ek -> neskek
            raiz = raiz.slice(0, -1);
        } else if (doblarR) {
            // txakur + a -> txakurra | txakur + ak -> txakurrak
            enlace += "r";
        }
        return raiz + enlace + sufijoBase;
    }

    // 2. MUGAGABEA
    if (zenbakia === "mugagabea") {
        // Si acaba en R fuerte, siempre dobla (excepto en 'nor', que no lleva sufijo)
        if (doblarR && kasua !== "nor") {
            enlace += "r";
        }

        switch (kasua) {
            case "nor":
                // Se queda igual (etxe, mutil, txakur)
                break;

            case "nork":
            case "zertaz":
                // Llevan 'e' solo si termina en consonante (mutilek, mutilez / etxek, etxez)
                if (!terminaEnVocal) {
                    enlace += "e";
                }
                break;

            case "nori":
            case "noren":
            case "norekin":
            case "norentzat":
                // Llevan 'r' solo si termina en vocal (etxeri, etxeren / mutili, mutilen)
                if (terminaEnVocal) {
                    enlace += "r";
                }
                break;
        }

        return raiz + enlace + sufijoBase;
    }

    return raiz;


}
