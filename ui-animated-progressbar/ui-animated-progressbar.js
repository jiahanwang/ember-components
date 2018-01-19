import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'hr',

  classNames: ['ui-animated-progress-bar'],

  classNameBindings: ['inProgress:in-progress'],

  value: 0,

  thresholds: '0, 100',

  thresholdsNormalized: Ember.computed('thresholds', function() {
    return (this.get('thresholds') || '').toString().split(/\s*,\s*/).map(Number).sort((a, b) => a - b);
  }).readOnly(),

  valueAsRatio: Ember.computed('value', 'thresholdsNormalized.[]', function() {
    let value = this.get('value');
    let thresholds = this.get('thresholdsNormalized');
    let first = thresholds[0];
    let last = thresholds[thresholds.length - 1];

    return (value - first) / (last - first);
  }).readOnly(),

  inProgress: Ember.computed('valueAsRatio', function() {
    return this.get('valueAsRatio') > 0 && this.get('valueAsRatio') <= 1;
  }).readOnly(),

  _originalPercent: 0,

  onUpdateBarStyle: Ember.observer('valueAsRatio', function() {
    let percent = Math.min(100, Math.ceil(this.get('valueAsRatio') * 100));

    let originalPercent = this.get('_originalPercent');

    if (percent > originalPercent) {
      this.set('_originalPercent', percent);

      this.$().animate({
        width: `${percent}%`
      }, 50);
    } else {
      // we don't go backwards, we reset the progress bar
      this.set('_originalPercent', 0);

      this.$().clearQueue().css({
        width: '0%'
      });
    }
  })
});
