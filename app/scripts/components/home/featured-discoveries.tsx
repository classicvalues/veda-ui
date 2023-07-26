import React from 'react';
import styled from 'styled-components';
import { listReset, media } from '@devseed-ui/theme-provider';
import { discoveries, getString } from 'veda';

import { Card } from '$components/common/card';
import { Fold, FoldHeader, FoldTitle, FoldBody } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';
import { DISCOVERIES_PATH, getDiscoveryPath } from '$utils/routes';

const FeaturedDiscoveryList = styled.ol`
  ${listReset()}
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${variableGlsp()};

  ${media.mediumUp`
    grid-template-columns: repeat(8, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(12, 1fr);
  `}

  li {
    grid-column: span 4;

    &:nth-child(1) {
      ${media.mediumUp`
        grid-column: 1 / span 8;
        min-height: 18rem;
      `}

      ${media.largeUp`
        grid-column: 1 / span 6;
        grid-row: 1 / span 2;
      `}
    }

    &:nth-child(2),
    &:nth-child(3) {
      ${media.largeUp`
        grid-column: span 3;
        grid-row: 1;
      `}
    }

    &:nth-child(4),
    &:nth-child(5) {
      ${media.largeUp`
        grid-column: span 3;
        grid-row: 2;
      `}
    }
  }
`;

// Get 5 discoveries that have the featured flag
/* eslint-disable-next-line fp/no-mutating-methods */
const featuredDiscoveries = Object.values(discoveries)
  .filter((d) => d && !!d.data.featured)
  .slice(0, 5)
  .map((d) => d!.data)
  .sort((a, b) => (new Date(a.pubDate) > new Date(b.pubDate) ? -1 : 1));

function FeaturedDiscoveries() {
  return (
    <Fold>
      <FoldHeader>
        <FoldTitle>Featured {getString('stories').plural}</FoldTitle>
      </FoldHeader>
      <FoldBody>
        {featuredDiscoveries.length ? (
          <FeaturedDiscoveryList>
            {featuredDiscoveries.map((d, i) => {
              return (
                <li key={d.id}>
                  <Card
                    cardType='cover'
                    linkLabel='View more'
                    linkTo={getDiscoveryPath(d)}
                    title={d.name}
                    parentName={getString('stories').singular}
                    parentTo={DISCOVERIES_PATH}
                    description={i === 0 ? d.description : undefined}
                    date={d.pubDate ? new Date(d.pubDate) : undefined}
                    imgSrc={d.media?.src}
                    imgAlt={d.media?.alt}
                  />
                </li>
              );
            })}
          </FeaturedDiscoveryList>
        ) : null}
      </FoldBody>
    </Fold>
  );
}

export default FeaturedDiscoveries;
