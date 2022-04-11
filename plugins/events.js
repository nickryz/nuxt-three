import EventEmitter from 'events'

export default ({ app }, inject) => {
  const events = new EventEmitter()
  inject('events', events)
}
