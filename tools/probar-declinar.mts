import assert from 'node:assert/strict';
import { deklinatu } from '../src/app/deklinabidea/deklinatu.ts'

assert.equal(deklinatu("neska", "nork", "singularra"), 'neskak');
assert.equal(deklinatu("neska", "nork", "plurala"), 'neskek');
assert.equal(deklinatu("neska", "nork", "mugagabea"), 'neskak');
assert.equal(deklinatu("mutil", "nori", "mugagabea"), 'mutili');
assert.equal(deklinatu("txakur", "nori", "mugagabea"), 'txakurri');
assert.equal(deklinatu("ur", "noren", "mugagabea"), 'uren');
assert.equal(deklinatu("etxe", "zertaz", "mugagabea"), 'etxez');
assert.equal(deklinatu("mutil", "zertaz", "mugagabea"), 'mutilez');
console.log('declinar OK')


