import { Component } from '@angular/core';
import { ServiceHiztegia } from '../hiztegiService';
import { NorNork, Trinkoa } from '../hiztegia';

interface NorItem  { nor: string; konjugazioa: string}
interface NorkItem { nork: string; konjugazioa: string}

@Component({
  imports: [],
  selector: 'app-aditza-taulak',
  styleUrl: './aditza-taulak.css',
  templateUrl: './aditza-taulak.html',
})
export class AditzaTaulak {
  listaTrinkoakCompleta: Trinkoa[] = [];
  listaAuxiliarrakCompleta: any[] = [];
  todosAditzak: any[] = [];

  norPertsonak: string[] = [];
  norkPertsonak: string[] = [];
  aditzaActual : Trinkoa[] | NorNork[] | any[] = []  ;

  objecktuak = ["singularra", "plurala"];
  denborak = ["orainaldia", "lehenaldia"];
  ordenAlternativo = false;
  ocultarHi = false;

  constructor(public readonly serviceHiztegia: ServiceHiztegia) {
    this.listaTrinkoakCompleta = [...serviceHiztegia.trinkoak()];
    this.listaAuxiliarrakCompleta = [...serviceHiztegia.auxiliarrak()];
    this.todosAditzak = [...this.listaTrinkoakCompleta, ...this.listaAuxiliarrakCompleta];
    console.log("Todos los aditzak:", this.todosAditzak);

    this.cambiarOrden(this.ordenAlternativo);
  }

  cambiarOrden(ordenAlternativo: boolean): void {
    this.ordenAlternativo = ordenAlternativo;
    this.norPertsonak = ordenAlternativo ? this.serviceHiztegia.ordenNor2() : this.serviceHiztegia.ordenNor1();
    this.norkPertsonak = ordenAlternativo ? this.serviceHiztegia.ordenNork2() : this.serviceHiztegia.ordenNork1();
    
  }



  obtenerAditzaTrinkoa(aditza: string): void {
    this.aditzaActual =  this.serviceHiztegia.trinkoak().filter((item) => item.aditza === aditza);
  }

  irAID(id: string): void {
    const tabla = document.getElementById(id);
    if (!tabla) {
      console.error(`No se encontró la tabla con id "${id}".`);
      return;
    }

    window.history.pushState(null, '', `#${id}`);
    tabla.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  obtenerTrinkoKonjugazioa(pertsona: string, denbora: string, objektu?: string): string {
    const trinkoa = this.aditzaActual.find((item) => 
      item.denbora === denbora &&
      item.pertsona === pertsona &&
      (objektu ? item.objektu === objektu : true)
    );
    return trinkoa ? trinkoa.konjugaioa : '';
  }

  obtenerTrinkoDenborak(): any[] {
    var denborak: string[] = this.aditzaActual.map((item) => item.denbora);
    var denborakUnicas: string[] = Array.from(new Set(denborak));
    return denborakUnicas;
  }

    obtenerNorNorkKonjugazioa(norEdoNork: string, pertsona: string, denbora: string): string {
      var elemento = '';  
      if(denbora === "orainaldia"){
        const nor : NorItem[] = ([
            { nor: 'NI',    konjugazioa: 'nau'},
            { nor: 'HI',    konjugazioa: 'hau'},
            { nor: 'HURA',  konjugazioa: 'du'},
            { nor: 'GU',    konjugazioa: 'gaitu'},
            { nor: 'ZU',    konjugazioa: 'zaitu'},
            { nor: 'ZUEK',  konjugazioa: 'zaituzte'},
            { nor: 'HAIEK', konjugazioa: 'ditu'},
          ]);

        const nork : NorkItem[] = ([
            { nork: 'NIK',    konjugazioa: 't'},
            { nork: 'HIK',    konjugazioa: 'k/n'},
            { nork: 'HARK',  konjugazioa: '-'},
            { nork: 'GUK',    konjugazioa: 'gu'},
            { nork: 'ZUK',    konjugazioa: 'zu'},
            { nork: 'ZUEK',  konjugazioa: 'zue'},
            { nork: 'HAIEK', konjugazioa: '(*z)te'},
          ]);
    if (norEdoNork === 'nor') {
      const encontrado = nor.find(item => item.nor === pertsona.toUpperCase());
      elemento = encontrado ? encontrado.konjugazioa : '';
    } else {
      const encontrado = nork.find(item => item.nork === pertsona.toUpperCase());
      elemento = encontrado ? encontrado.konjugazioa : '';
    }
      }
      return elemento;

  }


}
