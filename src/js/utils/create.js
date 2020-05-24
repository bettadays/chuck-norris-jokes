/**
 * @param {String} el
 * @param {Array} classNames
 * @param {Object} attributes
 * @param {HTMLElement/String/Array of HTMLElements} child
 * @param {HTMLElement} parent
 * @param {Object} data-attributes
 */

export default function createElement(element, classNames, attributes,
  child, parent, dataAttributes) {
  const el = document.createElement(element);
  if (classNames) {
    el.classList.add(...classNames);
  }

  if (attributes) {
    const keys = Object.keys(attributes);
    keys.forEach((key) => {
      el.setAttribute(key, attributes[key]);
    });
  }

  if (parent) {
    parent.append(el);
  }

  if (child && Array.isArray(child)) {
    child.forEach((childElement) => {
      el.append(childElement);
    });
  } else if (child && typeof child === 'string') {
    el.innerHTML = child;
  } else if (child && typeof child === 'object') {
    el.append(child);
  }

  if (dataAttributes) {
    const keys = Object.keys(dataAttributes);
    keys.forEach((key) => {
      el.dataset[key] = dataAttributes[key];
    });
  }

  return el;
}
