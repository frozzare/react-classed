import React from 'react';
import isPropValid from '@emotion/is-prop-valid';
import classnames from 'classnames';
import tags from './tags';

/**
 * Flatten array.
 *
 * @param {array} arr
 *
 * @return {array}
 */
const flattenArray = arr =>
  arr.reduce((a, b) => a.concat(Array.isArray(b) ? flattenArray(b) : b), []);

/**
 * Process css and return style object.
 *
 * @param {mixed} css
 *
 * @return {object}
 */
const processStyle = style => {
  // Support objects that has styles property.
  if (typeof style == 'object' && typeof style.styles === 'string') {
    style = style.styles;
  }

  // Support arrays.
  if (Array.isArray(style)) {
    style = style.join(';').replace(';;', ';');
  }

  if (typeof style !== 'string') {
    return null;
  }

  const rules = style
    .replace(/\/\*.+?\*\//g, '')
    .trim()
    .replace("\n", ';')
    .split(';');

  return rules.reduce((acc, rule) => {
    let [key, value] = rule.split(':');
    if (key && value) {
      key = key.trim().split('-').map((item, index) => {
        return index ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase() : item
      }).join('')

      acc[key] = value.trim();
    }
    return acc
  }, {});
}

/**
 * Process classNames and returns classNames that should be used.
 *
 * @param {mixed} classNames
 * @param {object} props
 *
 * @return {string}
 */
const processClassNames = (classNames, props = {}) => {
  const arr = Array.isArray(classNames) ? classNames : [classNames];

  let value = arr.map(input => {
    if (typeof input === 'function') {
      const obj = input(props);
      const cs = [];

      if (Array.isArray(obj)) {
        cs.push(processClassNames(obj, props));
        return cs;
      }

      for (let key in obj) {
        if (obj[key]) {
          cs.push(key);
        }
      }

      return cs;
    }

    return classnames(input);
  });

  value = flattenArray(value)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  value = classnames(value, props.className);

  // remove dublicated classnames.
  return Array.from(new Set(value.split(' '))).join(' ');
}

const classed = tag => {
  const name = typeof tag === 'string' ? tag : tag.displayName || tag.name;

  return (classNames, css) => {
    const Hoc = props => {
      props = Object.keys(props)
      .filter(key => isPropValid(key))
      .reduce((obj, key) => {
        obj[key] = props[key];
        return obj;
      }, {});

      props = {
        ...props,
        className: `${processClassNames(classNames, props)}`,
      };

      const style = processStyle(css);
      if (style) {
        props.style = style;
      }

      return React.createElement(tag, props);
    };

    Hoc.displayName = `Classed(${name})`;

    return Hoc;
  };
};

for (const tag of tags) {
    classed[tag] = classed(tag);
}

export default classed;
