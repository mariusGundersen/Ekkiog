import test, { ExecutionContext } from 'ava';

import referrer from './getRepoFromUrl';

function macro(t: ExecutionContext, input: string, expected: any) {
  t.deepEqual(referrer(input), expected);
}

(macro as any).title = (providedTitle: string, input: string) => input;

test(
  macro,
  '',
  false);

test(
  macro,
  'https://github.com/mariusGundersen/ekkiog-workspace',
  { repo: 'github.com/mariusGundersen/ekkiog-workspace', branch: 'WELCOME' });

test(
  macro,
  'https://github.com/mariusGundersen/ekkiog-workspace?readme=1',
  { repo: 'github.com/mariusGundersen/ekkiog-workspace', branch: 'WELCOME' });

test(
  macro,
  'https://github.com/mariusGundersen/ekkiog-workspace/tree/HALF-ADDER',
  { repo: 'github.com/mariusGundersen/ekkiog-workspace', branch: 'HALF-ADDER' });

test(
  macro,
  'https://github.com/mariusGundersen/ekkiog-workspace/tree/HALF-ADDER?readme=1',
  { repo: 'github.com/mariusGundersen/ekkiog-workspace', branch: 'HALF-ADDER' });

test(
  macro,
  'https://github.com/mariusGundersen/ekkiog-workspace/blob/HALF-ADDER/readme.md',
  { repo: 'github.com/mariusGundersen/ekkiog-workspace', branch: 'HALF-ADDER' });
