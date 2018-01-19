import Ember from 'ember';
import _ from 'lodash';
/*

  Component that truactex multiple-line text and show view more button if configured

  Example:

    {{line-clamp
      text=...
      maxLines=...
      showViewMore=..
      onShowMore=(closure-action ...) }}

  Notes:
    (1)algorithm: get the container width and then add word one by one, calculcate the width of the text by using context,
      if width of current line is bigger than width the container, go to next line until get all lines based on maxLines
*/

export default Ember.Component.extend({
  tagName: 'p',

  classNames: ['@width(100%)', 'line-clamp'],

  text: null, // required, the orignal full text

  maxLines: 0, // required, maxium number of lines are gonna be shown

  showViewMore: false, // required, show the view more button or not

  ellipsisText: '...', // optional, text to sigify text has been trcucated

  viewMoreText: 'view more', // optional, text for the view more button

  onShowMore: null, // optional, action fired when view more button clicked, accpects closure action only

  didInsertElement(...args) {
    this._super(args);

    // setup canvas
    let canvas = document.createElement('canvas');
    let canvasContext = canvas.getContext('2d');

    // setup ellipsisText
    let additionalText = ' ' + this.get('ellipsisText') + ' ';

    if (this.get('showViewMore')) {
      additionalText += this.get('viewMoreText');
    }

    this.setProperties({
      _ellipsisText: ' ' + this.get('ellipsisText') + ' ',
      additionalText,
      canvasContext,
      onResize: _.debounce(this._setTruncatedText.bind(this), 300)
    });

    // setup text
    this._setTruncatedText();

    // add resize listener
    window.addEventListener('resize', this.get('onResize'));
  },

  willDestroyElement(...args) {
    this._super(args);

    window.removeEventListener('resize', this.get('onResize'));
  },

  _calculateTargetWidth() {
    let elem = this.$()[0];
    let computedStyle = window.getComputedStyle(elem);

    let paddingLeft = parseInt(computedStyle.getPropertyValue('padding-left'), 10);
    let paddingRight = parseInt(computedStyle.getPropertyValue('padding-right'), 10);
    let maxWidth = elem.clientWidth - paddingLeft - paddingRight;

    let font = [
      computedStyle.getPropertyValue('font-weight'),
      computedStyle.getPropertyValue('font-style'),
      computedStyle.getPropertyValue('font-size'),
      computedStyle.getPropertyValue('font-family')
    ].join(' ');

    this.get('canvasContext').font = font;

    this.set('maxWidth', maxWidth);
  },

  _getTextWidth(text) {
    if (Ember.isEmpty(this.get('canvasContext'))) {
      return 0;
    }

    return this.get('canvasContext').measureText(text).width;
  },

  _setTruncatedText() {
    Ember.run(() => {
      this._calculateTargetWidth();
    });

    let words = this.get('text').split(/\s+/);
    let truncatedText = '';
    let currLine = '';
    let lineCount = this.get('maxLines');
    let maxWidth = this.get('maxWidth');
    let i = 0;

    for (let len = words.length; i < len && lineCount > 0; i++) {
      if (lineCount === 1) {
        if (this._getTextWidth(currLine + ' ' + words[i] + this.get('additionalText')) >= maxWidth) {
          truncatedText += currLine;
          currLine = '';
          i--;
          lineCount--;
        } else {
          currLine = currLine + ' ' + words[i];
        }
      } else if (this._getTextWidth(currLine + ' ' + words[i]) >= maxWidth) {
        truncatedText += currLine;
        currLine = '';
        i--;
        lineCount--;
      } else {
        currLine = currLine + ' ' + words[i];
      }
    }

    if (currLine) {
      truncatedText += currLine;
    }

    this.setProperties({
      truncatedText,
      isTextTruncated: i <= words.length - 1
    });
  },

  actions: {
    showMoreClicked() {
      if (Ember.notEmpty(this.get('onShowMore'))) {
        this.get('onShowMore')();
      }
    }
  }
});
