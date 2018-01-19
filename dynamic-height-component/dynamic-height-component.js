import Ember from 'ember';
import getOffsetTop from '/utils/get-element-offset';

/*
  Component to fill the 'rest' of the screen

  Get the offset of the element using offsetParent. This component also listens to window resize event
*/

export default Ember.Component.extend({
  offset: 0, // optional, custom offset for you to do minor adjustment

  didInsertElement(...args) {
    this._super(args);

    this.set('_bindedSetHeight', _.throttle(this.setHeight.bind(this), 200));

    Ember.run.schedule('afterRender', this.get('_bindedSetHeight'));

    $(window).on('resize', this.get('_bindedSetHeight'));
  },

  willDestroyElement() {
    $(window).off('resize', this.get('_bindedSetHeight'));
  },


  setHeight() {
    let viewportHeight = $(window).height();
    let offsetTop = getOffsetTop(this.$()[0]);

    this.set('_height', (viewportHeight - offsetTop + this.get('offset')) + 'px');
  }
});
