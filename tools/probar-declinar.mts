import assert from 'node:assert/strict';
import { deklinatu } from '../src/app/deklinabidea/deklinatu.ts';

// =========================================================
// 1. CASOS GRAMATICALES (NOR - ZERTAZ) - Nombres comunes
// =========================================================
// Acabados en -a (neska)
assert.equal(deklinatu("neska", "nor", "singularra", "izenArrunta", false), "neska");
assert.equal(deklinatu("neska", "nork", "singularra", "izenArrunta", false), "neskak");
assert.equal(deklinatu("neska", "nork", "plurala", "izenArrunta", false), "neskek");
assert.equal(deklinatu("neska", "nork", "mugagabea", "izenArrunta", false), "neskak");
assert.equal(deklinatu("neska", "nori", "mugagabea", "izenArrunta", false), "neskari");

// Acabados en consonante (mutil)
assert.equal(deklinatu("mutil", "nori", "singularra", "izenArrunta", false), "mutilari");
assert.equal(deklinatu("mutil", "nori", "plurala", "izenArrunta", false), "mutilei");
assert.equal(deklinatu("mutil", "nori", "mugagabea", "izenArrunta", false), "mutili");
assert.equal(deklinatu("mutil", "zertaz", "mugagabea", "izenArrunta", false), "mutilez");

// Acabados en vocal distinta de -a (etxe)
assert.equal(deklinatu("etxe", "nork", "plurala", "izenArrunta", true), "etxeek");
assert.equal(deklinatu("etxe", "noren", "mugagabea", "izenArrunta", true), "etxeren");
assert.equal(deklinatu("etxe", "zertaz", "mugagabea", "izenArrunta", true), "etxez");

// R fuerte vs R suave (txakur vs ur)
assert.equal(deklinatu("txakur", "nor", "singularra", "izenArrunta", false), "txakurra");
assert.equal(deklinatu("txakur", "nori", "mugagabea", "izenArrunta", false), "txakurri");
assert.equal(deklinatu("ur", "nor", "singularra", "izenArrunta", true), "ura");
assert.equal(deklinatu("ur", "noren", "mugagabea", "izenArrunta", true), "uren");

// =========================================================
// 2. CASOS GRAMATICALES - Nombres propios (Izen bereziak)
// =========================================================
assert.equal(deklinatu("Mikel", "nork", "singularra", "izenBerezia", false), "mikelek");
assert.equal(deklinatu("Ane", "nori", "singularra", "izenBerezia", false), "aneri");
assert.equal(deklinatu("Aitor", "noren", "singularra", "izenBerezia", false), "aitorren");
assert.equal(deklinatu("Bilbo", "norentzat", "singularra", "izenBerezia", true), "bilborentzat");

// =========================================================
// 3. LOCATIVOS INANIMADOS - Nombres comunes (Bizigabeak)
// =========================================================
// Vocal -e (etxe)
assert.equal(deklinatu("etxe", "non", "singularra", "izenArrunta", true), "etxean");
assert.equal(deklinatu("etxe", "nondik", "singularra", "izenArrunta", true), "etxetik");
assert.equal(deklinatu("etxe", "non", "plurala", "izenArrunta", true), "etxeetan");
assert.equal(deklinatu("etxe", "non", "mugagabea", "izenArrunta", true), "etxetan");

// Vocal -a (hondartza)
assert.equal(deklinatu("hondartza", "non", "singularra", "izenArrunta", true), "hondartzan");
assert.equal(deklinatu("hondartza", "nora", "singularra", "izenArrunta", true), "hondartzara");
assert.equal(deklinatu("hondartza", "non", "plurala", "izenArrunta", true), "hondartzetan");

// Consonante (haran)
assert.equal(deklinatu("haran", "non", "singularra", "izenArrunta", true), "haranean");
assert.equal(deklinatu("haran", "nondik", "singularra", "izenArrunta", true), "haranetik");
assert.equal(deklinatu("haran", "non", "mugagabea", "izenArrunta", true), "haranetan");

// =========================================================
// 4. LOCATIVOS DE LUGAR - Nombres propios (Leku-izenak)
// =========================================================
// Vocal (Bilbo, Gernika)
assert.equal(deklinatu("Bilbo", "non", "singularra", "izenBerezia", true), "bilbon");
assert.equal(deklinatu("Bilbo", "nondik", "singularra", "izenBerezia", true), "bilbotik");
assert.equal(deklinatu("Bilbo", "nora", "singularra", "izenBerezia", true), "bilbora");
assert.equal(deklinatu("Bilbo", "nongo", "singularra", "izenBerezia", true), "bilboko");
assert.equal(deklinatu("Gernika", "non", "singularra", "izenBerezia", true), "gernikan");

// Consonante y R fuerte (Gasteiz, Eibar)
assert.equal(deklinatu("Gasteiz", "non", "singularra", "izenBerezia", true), "gasteizen");
assert.equal(deklinatu("Gasteiz", "nondik", "singularra", "izenBerezia", true), "gasteizetik");
assert.equal(deklinatu("Eibar", "non", "singularra", "izenBerezia", true), "eibarren");
assert.equal(deklinatu("Eibar", "nora", "singularra", "izenBerezia", true), "eibarrera");

// Acabados en -l o -n (Irun, Usurbil) -> Sonorización
assert.equal(deklinatu("Irun", "non", "singularra", "izenBerezia", true), "irunen");
assert.equal(deklinatu("Irun", "nondik", "singularra", "izenBerezia", true), "irundik");
assert.equal(deklinatu("Irun", "nongo", "singularra", "izenBerezia", true), "irungo");
assert.equal(deklinatu("Usurbil", "nongo", "singularra", "izenBerezia", true), "usurbilgo");

// -a orgánica (Donostia)
assert.equal(deklinatu("Donostia", "non", "singularra", "izenBerezia", true), "donostian");
assert.equal(deklinatu("Donostia", "nondik", "singularra", "izenBerezia", true), "donostiatik");
assert.equal(deklinatu("Donostia", "nora", "singularra", "izenBerezia", true), "donostiara");
assert.equal(deklinatu("Donostia", "nongo", "singularra", "izenBerezia", true), "donostiako");

// =========================================================
// 5. LOCATIVOS ANIMADOS - Personas y animales (Bizidunak)
// =========================================================
// Comunes (mutil, neska, txakur)
assert.equal(deklinatu("mutil", "non", "singularra", "izenArrunta", false), "mutilarengan");
assert.equal(deklinatu("mutil", "non", "plurala", "izenArrunta", false), "mutilengan");
assert.equal(deklinatu("mutil", "non", "mugagabea", "izenArrunta", false), "mutilengan");
assert.equal(deklinatu("neska", "nora", "singularra", "izenArrunta", false), "neskarengana");
assert.equal(deklinatu("neska", "nora", "plurala", "izenArrunta", false), "neskengana");
assert.equal(deklinatu("neska", "nora", "mugagabea", "izenArrunta", false), "neskarengana");
assert.equal(deklinatu("txakur", "nondik", "singularra", "izenArrunta", false), "txakurrarengandik");

// Propios (Mikel, Ane, Aitor)
assert.equal(deklinatu("Mikel", "non", "singularra", "izenBerezia", false), "mikelengan");
assert.equal(deklinatu("Ane", "nora", "singularra", "izenBerezia", false), "anerengana");
assert.equal(deklinatu("Aitor", "nondik", "singularra", "izenBerezia", false), "aitorrengandik");
assert.equal(deklinatu("Mikel", "nongo", "singularra", "izenBerezia", false), "mikelen");

// NORANTZ y NORAINO
assert.equal(deklinatu("etxe", "norantz", "singularra", "izenArrunta", true), "etxerantz");
assert.equal(deklinatu("etxe", "noraino", "plurala", "izenArrunta", true), "etxeetaraino");
assert.equal(deklinatu("haran", "norantz", "singularra", "izenArrunta", true), "haranerantz");
assert.equal(deklinatu("Bilbo", "norantz", "singularra", "izenBerezia", true), "bilborantz");
assert.equal(deklinatu("Gasteiz", "noraino", "singularra", "izenBerezia", true), "gasteizeraino");
assert.equal(deklinatu("Mikel", "norantz", "singularra", "izenBerezia", false), "mikelenganantz");
assert.equal(deklinatu("neska", "noraino", "singularra", "izenArrunta", false), "neskarenganaino");




console.log('✅ ¡Todos los tests de deklinatu han pasado correctamente!');
