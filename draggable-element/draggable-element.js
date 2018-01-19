import Ember from 'ember';

export default Ember.Component.extend({
  layout: 'template/draggable-element',

  classNames: ['draggable-element'],

  classNameBindings: ['_draggingClassName'],

  attributeBindings: ['draggable'],

  // enable drag on the element
  draggable: true,

  // className you want to add to source element
  draggingClassName: null,

  // data you want to transfer
  content: null,

  _draggingClassName: null,

  dragStart(event) {
    this.set('_draggingClassName', this.get('draggingClassName'));

    let dt = event.dataTransfer;

    dt.setData('text/data', JSON.stringify(this.get('content')));
  },

  dragEnd() {
    this.set('_draggingClassName', null);
  }
});