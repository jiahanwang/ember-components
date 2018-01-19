import Ember from 'ember';

export default function getOffsetTop(elem, parent) {
  if (Ember.isEmpty(elem)) {
    throw TypeError('element cannot be empty');
  }

  let pointer = elem;
  let parentElement = parent || document.body;
  let sum = 0;

  while (pointer !== null && pointer !== parentElement) {
    sum += pointer.offsetTop;
    pointer = pointer.offsetParent;
  }

  return sum;
}
