import Ember from 'ember';
import getOffsetTop from 'app/utils/get-element-offset';
import _ from 'lodash';
/*
  Component to wrap content with waypoints

  Example:

    {{#waypoints-content
          currentWaypointId=...
          waypointTriggedAction=...}}
          ...

          // data-waypoint-id is required to distinguish different waypoints
          <div data-waypoint-id=...>...</div>

          ...

          <div data-waypoint-id=...>...</div>

          ...
    {{/waypoints-content}}

  Notes:
    (1) this component does not change currentWaypointId, change it in the handler of the waypointTriggedAction action
    (2) content needs to be static at this point, as offsets of waypoint elements are calculated and cached after the inital rendering;
        But feel free to inherit this component to adjust to dynamic content
*/

export default Ember.Component.extend({
  classNames: ['waypoints-content'],

  currentWaypointId: null, // required

  waypointTriggedAction: 'wayPointTrigged', // required

  didInsertElement(...args) {
    this._super(args);

    let parentElem = this.$('div.waypoint-content-container')[0];
    // get all the waypoint elements
    let waypointElems = [...$('div.waypoint-content-container [data-waypoint-id]')];

    if (waypointElems.length <= 1) {
      return;
    }

    // pre-calculate waypoint offsetTop
    let waypointOffsets = [];

    waypointElems.forEach(elem => {
      elem.dataset.waypointOffset = getOffsetTop(elem, parentElem);

      waypointOffsets.push({
        id: elem.dataset.waypointId,
        offsetTop: elem.dataset.waypointOffset
      });
    });

    // save the calculated waypoint offsets
    this.setProperties({
      _parentElem: parentElem,
      _waypointOffsets: waypointOffsets
    });

    // attach scroll event
    $(parentElem).on('scroll', this.onScroll.bind(this));

    // attach observer
    this.addObserver('currentWaypointId', this, this.onCurrentWaypointIdChanged);
  },

  willDestoryElement() {
    $(this.get('_parentElem')).off('scroll');

    this.removeObserver('currentWaypointId', this, this.onCurrentWaypointIdChanged);
  },

  onCurrentWaypointIdChanged() {
    let currentWaypointId = this.get('currentWaypointId');
    let waypointOffsets = this.get('_waypointOffsets');
    let parentElem = this.get('_parentElem');
    let offsetTop = waypointOffsets.filterBy('id', currentWaypointId)[0].offsetTop;

    parentElem.scrollTop = offsetTop;
  },

  onScroll() {
    let scrollTop = this.get('_parentElem').scrollTop;
    let waypointOffsets = this.get('_waypointOffsets');
    let i = 0;

    if (scrollTop <= waypointOffsets[0].offsetTop) {
      // scrolled to very top
      i = 0;
    } else if (scrollTop >= waypointOffsets[waypointOffsets.length - 1].offsetTop) {
      // scrolled to very bottom
      i = waypointOffsets.length - 1;
    } else {
      // find the waypoint
      while (i < waypointOffsets.length) {
        if (scrollTop >= waypointOffsets[i].offsetTop && scrollTop < waypointOffsets[i + 1].offsetTop) {
          break;
        }
        i++;
      }
    }

    if (waypointOffsets[i].id !== this.get('currentWaypointId')) {
      this.sendAction('waypointTriggedAction', waypointOffsets[i].id);
    }
  }
});
