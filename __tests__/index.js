import React from 'react';
import { create } from 'react-test-renderer';
import classed from '../src';

const assertJSON = (expected, actual) => {
  return expect(create(expected).toJSON()).toEqual(create(actual).toJSON())
};

describe('Classed', () => {
  test('it works with tag input and no css classes', () => {
    const Text = classed('p')('');

    assertJSON(<Text/>, <p className=""/>);
  });

  test('it works with shorthand and no css classes', () => {
    const Text = classed.p('');

    assertJSON(<Text/>, <p className=""/>);
  });

  test('it works with display name', () => {
    const Text = classed.p('');

    expect(Text.displayName).toEqual('Classed(p)');
  });

  test('it allows passing custom components', () => {
    const Button = props => <button {...props}>{props.children}</button>;
    const BlackButton = classed(Button)('bg-black');

    assertJSON(<BlackButton>Submit</BlackButton>, <button className="bg-black">Submit</button>);
  });

  test('it works with classnames input', () => {
    const tests = [
      {
        classNames: 'foo',
        tag: 'p',
        actual: <p className="foo" />,
      },
      {
        classNames: ['foo', 'bar'],
        tag: 'p',
        actual: <p className="foo bar" />,
      },
      {
        classNames: [['a', 'b'], ['c', 'd']],
        tag: 'p',
        actual: <p className="a b c d" />
      },
      {
        classNames: ['b', { c: true, d: false }],
        tag: 'p',
        actual: <p className="b c" />
      },
      {
        classNames: [{ foo: true }, { bar: true }],
        tag: 'p',
        actual: <p className="foo bar" />
      },
      {
        classNames: ['foo', { bar: true, duck: false }, 'baz', { quux: true }],
        tag: 'p',
        actual: <p className="foo bar baz quux" />
      },
      {
        classNames: [null, false, 'bar', undefined, 0, 1, { baz: null }, ''],
        tag: 'p',
        actual: <p className="bar 1" />
      },
      {
        classNames: [{ foo: true }, { bar: true }],
        tag: 'p',
        render: test => {
          return props => {
            const Component = classed(test.tag)(test.classNames);
            return <Component className="classed" />;
          }
        },
        actual: <p className="foo bar classed" />
      },
      {
        classNames: [{ foo: true }, { bar: true }, 'classed'],
        tag: 'p',
        render: test => {
          return props => {
            const Component = classed(test.tag)(test.classNames);
            return <Component className="classed" />;
          }
        },
        actual: <p className="foo bar classed" />
      },
      {
        classNames: ['foo', ({ title }) => ({ 'is-title': typeof title !== 'undefined' })],
        tag: 'p',
        actual: <p className="foo" />
      },
      {
        classNames: ({ title }) => ({ 'is-title': typeof title !== 'undefined' }),
        tag: 'p',
        render: test => {
          return props => {
            const Component = classed(test.tag)(test.classNames);
            return <Component title="foo" />;
          }
        },
        actual: <p className="is-title" title="foo" />
      },
      {
        classNames: ['foo', ({ title }) => ({ 'is-title': typeof title !== 'undefined' })],
        tag: 'p',
        render: test => {
          return props => {
            const Component = classed(test.tag)(test.classNames);
            return <Component title="foo" />;
          }
        },
        actual: <p className="foo is-title" title="foo" />
      },
      {
        tag: 'p',
        render: test => {
          return props => {
            const Component = classed(test.tag)(({ title }) => ({ 'is-title': typeof title !== 'undefined' }));
            return <Component title="foo" />;
          }
        },
        actual: <p className="is-title" title="foo" />
      },
      {
        tag: 'p',
        render: test => {
          return props => {
            const Component = classed(test.tag)(({ title }) => ['input', { 'is-title': typeof title !== 'undefined' }]);
            return <Component title="foo" />;
          }
        },
        actual: <p className="input is-title" title="foo" />
      },
    ];

    tests.forEach(test => {
      const Component = test.render ? test.render(test) : classed(test.tag)(test.classNames);
      assertJSON(<Component />, test.actual)
    });
  });

  test('it works with additional style', () => {
    const tests = [
      {
        classNames: 'foo',
        css: `/* This is a comment */
        display: inline-block;
        border-radius: 3px;
        padding: 0.5rem 0;
        margin: 0.5rem 1rem;
        width: 11rem;
        background: transparent;
        color: white;
        border: 2px solid white;`,
        tag: 'p',
        actual: <p className="foo" style={{
          display: 'inline-block',
          borderRadius: '3px',
          padding: '0.5rem 0',
          margin: '0.5rem 1rem',
          width: '11rem',
          background: 'transparent',
          color: 'white',
          border: '2px solid white'
        }} />
      },
      {
        classNames: 'foo',
        css: ['color: green', 'padding: 1px'],
        tag: 'p',
        actual: <p className="foo" style={{
          color: 'green',
          padding: '1px'
        }} />
      },
      {
        classNames: 'foo',
        css: ['color: green;', 'padding: 1px;'],
        tag: 'p',
        actual: <p className="foo" style={{
          color: 'green',
          padding: '1px'
        }} />
      },
      {
        classNames: 'foo',
        css: { styles: 'color: black; padding: 1px' },
        tag: 'p',
        actual: <p className="foo" style={{
          color: 'black',
          padding: '1px'
        }} />
      }
    ];

    tests.forEach(test => {
      const Component = test.render ? test.render(test) : classed(test.tag)(test.classNames, test.css);
      assertJSON(<Component />, test.actual)
    });
  });
});
