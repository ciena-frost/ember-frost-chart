import { expect } from 'chai';
import { describe, it } from 'mocha';
import { linearScale } from 'ember-frost-chart/helpers/d3-linear-scale';

describe('Unit | Helper | d3 linear scale', function() {
  // Replace this with your real tests.
  it('works', function() {
    let result = linearScale(42);
    expect(result).to.be.ok;
  });
});
