module.exports = {
  description: '',
  normalizeEntityName: function () {},

  afterInstall: function () {
    return this.addAddonsToProject({
      packages: [
        {name: 'ember-frost-core', target: '1.23.10'},
        {name: 'ember-hook', target: '1.4.1'},
        {name: 'ember-prop-types', target: '3.14.1'}
      ]
    })
  }
}
