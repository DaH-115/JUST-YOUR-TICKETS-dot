import Head from 'next/head';
import { ComponentType } from 'react';

const withHead = (Component: ComponentType, title: string) => {
  const titleText = `JUST MY TICKETS. | ${title}`;

  const component = (props: JSX.IntrinsicAttributes) => {
    return (
      <>
        <Head>
          <title>{titleText}</title>
        </Head>
        <Component {...props} />
      </>
    );
  };

  return component;
};

export default withHead;
