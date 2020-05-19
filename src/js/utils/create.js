/**
 * @param {String} el
 * @param {Array} classNames
 * @param {Ogject} attributes
 * @param {HTMLElement/String/Array of HTMLElements} child
 * @param {HTMLElement} parent
 */

export default function createElement(element, classNames, attributes, child, parent) {
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
      element.appendChild(childElement);
    });
  } else if (child && typeof child === 'string') {
    el.innerHTML = child;
  } else if (child && typeof child === 'object') {
    el.append(child);
  }

  return el;
}
