import Ember from 'ember';

export default Ember.Component.extend({
  layout: 'template/droppable-area',

  classNames: ['droppable-area'],

  classNameBindings: ['_dragOverClassName'],

  dragOverClassName: null,

  _dragOverClassName: null,

  successHandler: null,

  content: null,

  dataType: 'text/data',

  dragOver(event) {
    event.preventDefault();

    return false;
  },

  dragEnter(event) {
    if (event.target.classList.contains('droppable-area')) {
      this.set('_dragOverClassName', this.get('dragOverClassName'));
    }

    return false;
  },

  dragLeave(event) {
    if (event.target.classList.contains('droppable-area')) {
      this.set('_dragOverClassName', null);
    }

    return false;
  },

  drop(event) {
    event.preventDefault();

    let data = event.dataTransfer.getData(this.get('dataType'));

    this.setProperties({
      content: data,
      _dragOverClassName: null
    });

    this.sendAction('successHandler', data);

    return false;
  }
});
