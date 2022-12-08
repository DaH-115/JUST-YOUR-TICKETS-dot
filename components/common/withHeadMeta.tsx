import Head from 'next/head';
import { ComponentType } from 'react';

const withHeadMeta = (Component: ComponentType, title: string) => {
  const component = (props: JSX.IntrinsicAttributes) => {
    return (
      <>
        <Head>
          <title>{`JUST MY TICKETS. | ${title}`}</title>
        </Head>
        <Component {...props} />
      </>
    );
  };

  return component;
};

export default withHeadMeta;
