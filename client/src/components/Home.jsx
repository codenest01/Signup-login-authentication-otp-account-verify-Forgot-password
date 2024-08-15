import React from 'react';
import styles from '../styles/Home.module.css';

function Home() {
  return (
    <div>
      {replaceClassWithClassName(
        <div>
          <h1 class="header">Home page</h1>
          <button class="button">Button</button>
          <br />
          <div class="box text-center bg-info text-danger">Box</div>
        </div>
      )}
    </div>
  );
}

function replaceClassWithClassName(element) {
  if (typeof element === 'string') return element;
  const { class: className, ...props } = element.props || {}; 
  const appliedClassName = className
    ? className.split(' ').map(cls => styles[cls] || cls).join(' ')
    : props.className;

  const children = React.Children.map(element.props.children, replaceClassWithClassName);

  return React.cloneElement(
    element,
    {
      ...props,
      className: appliedClassName,
    },
    children
  );
}

export default Home;
