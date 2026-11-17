import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NorNork, Trinkoa } from '../hiztegia';
import type { Aditza } from './aditzak-praktikatu';
import { ServiceHiztegia } from '../hiztegiService';

@Component({
  imports: [FormsModule],
  selector: 'app-aditzak-praktikatu-practica',
  templateUrl: './aditzak-praktikatu-practica.html',
})
export class AditzakPraktikatuPractica implements OnInit {
  @ViewChild('primerInput') primerInput?: ElementRef<HTMLInputElement>;
  @Input() aditzak: Aditza[] = [];
  @Input() usarGauzak: boolean = true;
  @Input() practicarDeclinacion: boolean = true;
  @Output() reset = new EventEmitter<void>();

  aditzakPendientes: Aditza[] = [];
  modoGauzak: boolean = true;
  adivinarPronombres: boolean = true;
  palabraSeleccionada: Aditza = { konjugaioa: '', aditza: '', denbora: '', pertsona: '' };
  modo = '';
  verboNorNork = '';
  intentos = 3;
  acertado = false;
  palabraIntroducida = '';
  fraseAAcertar: string[] = [''];
  textoAcierto = '';
  pronombreAPracticar = '';
  classTextoAcierto = 'text-center';
  /* readonly verbosNorNork = ['gonbidatu', 'maite', 'ikusi', 'izendatu', 'ikastera animatu'];
  readonly gauzakPoseerSingular = ['buruko mina', 'etxe handi bat', 'telefonoa', 'denbora asko', 'arazo bat'];
  readonly gauzakPoseerPlural = ['hiru txakurra', 'lagun asko', 'galdera batzuk', 'giltza guztiak', 'liburu berriak'];
  readonly gauzakLlevarSingular = ['ogia', 'gutun bat', 'ura', 'tarta handi bat', 'kotxea', 'gazta asko', 'poltsa', 'maleta'];
  readonly gauzakLlevarPlural = ['liburuak', 'bi maleta', 'opariak', 'lagunak', 'umeak', 'loreak'];
  readonly gauzakSaberSingular = ['erantzuna', 'euskara', 'sekretua', 'kanta hori', 'egia'];
  readonly gauzakSaberPlural = ['abezti guztiak', 'hitz asko', 'hiru hizkuntza', 'istorio asko', 'lagunen izenak', 'aditz hauek', 'euskal kantu asko', 'hitz berriak', 'galdera guztien erantzunak', 'aditz hauek'];
 */
  constructor(public readonly serviceHiztegia: ServiceHiztegia) {}

  private ejemplos(aditza: string, objektu: 'singularra' | 'plurala' | null = null): string[] {
    return this.serviceHiztegia.gehigarriak(aditza, objektu);
  }

  ngOnInit(): void {
    this.aditzakPendientes = [...this.aditzak];
    this.modoGauzak = this.usarGauzak;
    this.adivinarPronombres = this.practicarDeclinacion;
    this.sacarPalabra();
  }

  sacarPalabra(): void {
    
    if (this.aditzakPendientes.length === 0) {
      return;
    }

    const indice = Math.trunc(Math.random() * this.aditzakPendientes.length);
    this.palabraSeleccionada = this.aditzakPendientes[indice];
    if ('pertsona' in this.palabraSeleccionada) {
      this.modo = 'trikoa';
    } else if ('nor' in this.palabraSeleccionada && 'nork' in this.palabraSeleccionada) {
      this.modo = 'norNork';
      const verboIndice = Math.trunc(Math.random() * this.ejemplos('nor-nork').length);
      this.verboNorNork = this.ejemplos('nor-nork')[verboIndice];
    }

    this.intentos = 3;
    this.textoAcierto = '';
    this.classTextoAcierto = 'text-center';
    this.acertado = false;
    this.fraseAAcertar = [];
     this.textoAMostrar();
    this.vaciarAmbos();
    this.enfocarInput(); 

  }

  textoAMostrar() {
    console.log(this.adivinarPronombres);
    if (this.modo === 'trikoa') {
      // Si se ha seleccionado usar gauzak
      if(!this.adivinarPronombres && 'pertsona' in this.palabraSeleccionada){
        this.fraseAAcertar[0] = this.palabraSeleccionada.pertsona;
      }else if('pertsona' in this.palabraSeleccionada){
        const indice = this.serviceHiztegia.ordenNork1().indexOf(this.palabraSeleccionada.pertsona)
        this.fraseAAcertar[0] = "(" ;
        this.fraseAAcertar[0] += this.serviceHiztegia.ordenNor1()[indice] 
        this.fraseAAcertar[0] += ")";
        
      }
      if ('objektu' in this.palabraSeleccionada && this.palabraSeleccionada.objektu) {
        if (this.modoGauzak) {
          if (this.palabraSeleccionada.objektu === 'singularra') {
            this.fraseAAcertar[1] = " gauza bat";
          } else {
            this.fraseAAcertar[1] = " bi gauza ";
          }
        }
        // Si se ha seleccionado no usar gauzak
        else {
          // Para el verbo eduki
          if (this.palabraSeleccionada.aditza === 'eduki') {
            if (this.palabraSeleccionada.objektu === 'singularra') {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('eduki', 'singularra').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('eduki', 'singularra')[objektuIndice];
            } else {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('eduki', 'plurala').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('eduki', 'plurala')[objektuIndice];
            }
          } 
          // Para el verbo ukan
          else if(this.palabraSeleccionada.aditza === 'ukan'){
            if (this.palabraSeleccionada.objektu === 'singularra') {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('ukan', 'singularra').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('ukan', 'singularra')[objektuIndice];
            } else {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('ukan', 'plurala').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('ukan', 'plurala')[objektuIndice];
            }
          }
          // Para los verbos eraman eta ekarri se utilizan los gauzakLlevarSingular y Plural
          else if (this.palabraSeleccionada.aditza === 'eraman')
            if (this.palabraSeleccionada.objektu === 'singularra') {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('eraman', 'singularra').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('eraman', 'singularra')[objektuIndice];
            } else {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('eraman', 'plurala').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('eraman', 'plurala')[objektuIndice];
            } 
          else if (this.palabraSeleccionada.aditza === 'ekarri')
            if (this.palabraSeleccionada.objektu === 'singularra') {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('ekarri', 'singularra').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('ekarri', 'singularra')[objektuIndice];
            } else {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('ekarri', 'plurala').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('ekarri', 'plurala')[objektuIndice];
            } 
          // Para el verbo Jakin se utilizan los gauzakSaberSingular y Plural
            else if (this.palabraSeleccionada.aditza === 'jakin')
            if (this.palabraSeleccionada.objektu === 'singularra') {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('jakin', 'singularra').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('jakin', 'singularra')[objektuIndice];
            } else {
              var objektuIndice = Math.trunc(Math.random() * this.ejemplos('jakin', 'plurala').length);
              this.fraseAAcertar[1] = " " + this.ejemplos('jakin', 'plurala')[objektuIndice];
            }
        }


      } else if ('pertsona' in this.palabraSeleccionada) {
        this.fraseAAcertar[0] = this.palabraSeleccionada.pertsona;
        this.fraseAAcertar[1] = "";
        this.fraseAAcertar[2] = this.palabraSeleccionada.aditza;

      }
      this.fraseAAcertar[2] = "(" + this.palabraSeleccionada.aditza + ")";
      this.fraseAAcertar[3] = "\n(" + this.palabraSeleccionada.denbora + ")";
    } else if (this.modo === 'norNork' && 'nor' in this.palabraSeleccionada && 'nork' in this.palabraSeleccionada) {
      this.fraseAAcertar[0] = this.palabraSeleccionada.nork + " " + this.palabraSeleccionada.nor;
      this.fraseAAcertar[1] = " ";
      this.fraseAAcertar[2] = this.verboNorNork;
    }

    if (this.modo === 'trikoa') {
      this.fraseAAcertar[3] = "(" + this.palabraSeleccionada.denbora + ")";
    } else if (this.modo === 'norNork' && 'nor' in this.palabraSeleccionada && 'nork' in this.palabraSeleccionada) {
      this.fraseAAcertar[3] = "(" + this.palabraSeleccionada.denbora + ")" + "(" + this.palabraSeleccionada.modua + ")";
    }
  }

  probar(): void {
    if (this.intentos <= 0) {
      return;
    }
    var pronombreAcerdado = true;
    this.acertado = this.palabraIntroducida.trim().toLowerCase() ===
      this.palabraSeleccionada.konjugaioa.toLowerCase();

      // el pronombre declinado solo se pide para los trinkos transitivos si el modo está activado
    if(this.practicarDeclinacion && 'objektu' in this.palabraSeleccionada && 'pertsona' in this.palabraSeleccionada){
          pronombreAcerdado = this.pronombreAPracticar.trim().toLowerCase() ===
      this.palabraSeleccionada.pertsona.toLowerCase();
      
    }
    if (this.acertado && pronombreAcerdado) {
      this.textoAcierto = '<strong>Oso ondo!</strong><br>';
      this.classTextoAcierto = 'text-center text-success fw-bold fs-2';
      this.aditzakPendientes.splice(this.aditzakPendientes.indexOf(this.palabraSeleccionada), 1);
      this.palabraIntroducida = '';
      if (this.aditzakPendientes.length === 0) {
        this.textoAcierto = 'Zorionak!<br> Has adivinado todas las palabras.';
      }
      return;
    }

    this.intentos--;
    this.textoAcierto = this.intentos > 0 ? 'Intentalo de nuevo' : '';
    this.textoAcierto += `<br>Intentos restantes: ${this.intentos}`;
    this.classTextoAcierto = 'text-center text-info';
  }

  vaciarAmbos(){
    this.pronombreAPracticar = '';
    this.palabraIntroducida = '';
    this.enfocarInput();
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event): void {
    // Se ejecuta solo cuando NO está el formulario de "Saiatu" (acertado o sin intentos)
    // y todavía quedan palabras por practicar
    if ((this.acertado || this.intentos === 0) && this.aditzakPendientes.length > 0) {
      event.preventDefault(); // Evita comportamientos por defecto del navegador
      this.sacarPalabra();
    }
  }
  private enfocarInput(): void {
    // El setTimeout(0) espera a que Angular termine de renderizar el @if en el HTML
    setTimeout(() => {
      this.primerInput?.nativeElement.focus();
    }, 0);
  }
}
