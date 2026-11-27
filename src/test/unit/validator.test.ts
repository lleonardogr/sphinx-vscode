import { strict as assert } from 'assert';
import { describe, it } from 'node:test';
import { defaultJobs, inOrder } from '../../validator';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('parallel validation', () => {
  it('runs at most `limit` tasks at a time, and reports results in the original order', async () => {
    let running = 0;
    let peak = 0;
    const delays = [40, 5, 25, 5, 15, 5];
    const tasks = delays.map((ms, i) => async () => {
      running++;
      peak = Math.max(peak, running);
      await wait(ms);
      running--;
      return i;
    });
    const reported: number[] = [];
    const results = await inOrder(tasks, 3, (r) => reported.push(r));
    assert.deepEqual(results, [0, 1, 2, 3, 4, 5]);
    assert.deepEqual(reported, [0, 1, 2, 3, 4, 5], 'a fast task waits for the slower ones before it');
    assert.equal(peak, 3);
  });

  it('runs one at a time with a limit of 1, and handles an empty list', async () => {
    let running = 0;
    let peak = 0;
    const tasks = [1, 2, 3].map((n) => async () => {
      running++;
      peak = Math.max(peak, running);
      await wait(2);
      running--;
      return n * 10;
    });
    assert.deepEqual(await inOrder(tasks, 1, () => undefined), [10, 20, 30]);
    assert.equal(peak, 1);
    assert.deepEqual(await inOrder([], 4, () => undefined), []);
  });

  it('uses one job per core, between 1 and 4', () => {
    const jobs = defaultJobs();
    assert.ok(jobs >= 1 && jobs <= 4, String(jobs));
  });
});
