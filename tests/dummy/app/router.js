import config from './config/environment'
import Ember from 'ember'
const {Router: EmberRouter} = Ember

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('demo', {path: '/'})
})

export default Router
