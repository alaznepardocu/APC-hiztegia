export type Kasua = 'nor' | 'nork';
export type Zenbakia = 'singularra' | 'plurala' | 'mugagabea';

const ATZIZKIAK:
Record<Kasua,
Record<Zenbakia, string>> = {
    nor: {singularra: 'a', plurala: 'ak', 'mugagabea': ''},
    nork: {singularra: 'ak', plurala: 'ek', 'mugagabea': 'ek'}
};

export function declinar (raiz: string, kasua: Kasua, zenbakia: Zenbakia): string{
    if(raiz.charAt(raiz.length-1) === 'A'){
        raiz = raiz.slice(0,-1);
    }
    const sufijo =  ATZIZKIAK[kasua][zenbakia];

    return raiz + sufijo;


}
