const MetaTags = () => {
  return (
    <>
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      />

      <meta name='description' content='나의 영화 감상 티켓을 모아보세요.' />
      <meta
        name='keywords'
        content='movie,review,moviereview,ticket,영화,감상,영화감상,리뷰,티켓'
      />

      <meta property='og:type' content='website' />
      <meta property='og:locale' content='ko_KR' />
      <meta property='og:image:width' content='350' />
      <meta property='og:image:height' content='140' />
      <meta property='og:url' content='' />
      <meta property='og:title' content='JUST MY TICKETS.' />
      <meta property='og:image' content='/images/og-card.png' />
      <meta
        property='og:description'
        content='나의 영화 감상 티켓을 모아보세요.'
      />
      <meta property='og:site_name' content='JUST MY TICKETS.' />

      {/* Twitter Card */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:title' content='JUST MY TICKETS.' />
      <meta
        name='twitter:description'
        content='나의 영화 감상 티켓을 모아보세요.'
      />
      <meta name='twitter:image' content='/images/og-card.png' />

      <link rel='canonical' href='' />
    </>
  );
};

export default MetaTags;
