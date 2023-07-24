import React from 'react';
import styled from 'styled-components';
import { TaxonomyItem } from 'veda';
import { Link } from 'react-router-dom';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading, Overline } from '@devseed-ui/typography';

import { Actions } from './browse-controls/use-browse-controls';

import { variableGlsp } from '$styles/variable-utils';
import Constrainer from '$styles/constrainer';
import { Pill } from '$styles/pill';
import { DATASETS_PATH } from '$utils/routes';

const TaxonomySection = styled.section`
  background-color: ${themeVal('color.base-100')};
  padding: ${variableGlsp()};
`;

const TaxonomySectionInner = styled(Constrainer)`
  ${Heading} {
    grid-column: 1 / -1;
  }
`;

const TaxonomyList = styled.dl`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: ${glsp(1.5, 1)};
  align-items: center;

  > dt {
    grid-column: 1;
  }

  > dd {
    grid-column: 2;
    display: flex;
    flex-flow: row wrap;
    gap: ${glsp(0.5)};
  }
`;

interface ContentTaxonomyProps {
  taxonomy: Record<string, TaxonomyItem[] | undefined>;
}

export function ContentTaxonomy(props: ContentTaxonomyProps) {
  const { taxonomy } = props;

  const taxonomies = Object.entries(taxonomy) as [string, TaxonomyItem[]][];

  if (!taxonomies.length) return null;

  return (
    <TaxonomySection>
      <TaxonomySectionInner>
        <Heading as='h2' hidden>
          Taxonomy
        </Heading>
        <TaxonomyList>
          {taxonomies.map(([key, values]) => (
            <React.Fragment key={key}>
              <dt>
                <Overline>{key}</Overline>
              </dt>
              <dd>
                {values.map((t) => (
                  <Pill
                    key={t.id}
                    as={Link}
                    to={`${DATASETS_PATH}?${
                      Actions.TAXONOMY
                    }=${encodeURIComponent(JSON.stringify({ [key]: t.id }))}`}
                  >
                    {t.name}
                  </Pill>
                ))}
              </dd>
            </React.Fragment>
          ))}
        </TaxonomyList>
      </TaxonomySectionInner>
    </TaxonomySection>
  );
}
