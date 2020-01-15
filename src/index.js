import React from 'react';
import isPropValid from '@emotion/is-prop-valid';
import classnames from 'classnames';
import tags from './tags';

/**
 * Get style object.
 *
 * @param {mixed} css
 */
const getStyle = css => {
  // Support objects that has styles property.
  if (typeof css == 'object' && typeof css.styles === 'string') {
      css = css.styles;
  }

  // Support arrays.
  if (Array.isArray(css)) {
      css = css.join(';').replace(';;', ';');
  }

  if (typeof css !== 'string') {
    return null;
  }

  const rules = css
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
 * Get the class names that should be used.
 *
 * @param {mixed} classNames
 * @param {object} props
 *
 * @return {string}
 */
const getClassNames = (classNames, props = {}) => {
  const arr = Array.isArray(classNames) ? classNames : [classNames];

  let value = arr.map(input => {
    if (typeof input === 'function') {
      const obj = input(props);
      const cs = [];

      if (Array.isArray(obj)) {
        cs.push(getClassNames(obj, props));
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
  })
  .flat()
  .join(' ')
  .replace(/\s+/g, ' ')
  .trim();

  value = classnames(value, props.className);

  // remove dublicated classnames.
  return Array.from(new Set(value.split(' '))).join(' ');
}

const classed = tag => {
  const name = typeof tag === 'string' ? tag : tag.displayName || tag.name;

  const Hoc = (classNames, css) => {
    return props => {
      props = Object.fromEntries(Object.entries(props).filter(([key]) => isPropValid(key)))
      props = {
        ...props,
        className: `${getClassNames(classNames, props)}`,
      };

      const style = getStyle(css);
      if (style) {
        props.style = style;
      }

      return React.createElement(tag, props);
    };
  };

  Hoc.displayName = `Classed(${name})`;

  return Hoc;
};

for (const tag of tags) {
    classed[tag] = classed(tag);
}

export default classed;
