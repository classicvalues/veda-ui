import React from 'react';
import styled from 'styled-components';
import { glsp, listReset, themeVal } from '@devseed-ui/theme-provider';
import { Link } from 'react-router-dom';

import deltaThematics from 'delta/thematics';
import Constrainer from '../../styles/constrainer';
import { PageMainContent } from '../../styles/page';

import { LayoutProps } from '../common/layout-root';
import PageHero from '../common/page-hero';

const ThematicList = styled.ul`
  ${listReset()}
  display: flex;
  gap: ${glsp(2)};
  margin-top: ${glsp(3)};

  li {
    padding: ${glsp()};
    border-radius: ${themeVal('shape.rounded')};
    box-shadow: ${themeVal('boxShadow.elevationC')};
  }
`;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHero title='Welcome' />
      <Constrainer>
        <h2>Explore the areas</h2>
        <ThematicList>
          {deltaThematics.map((t) => (
            <li key={t.id}>
              <Link to={`/${t.id}`}>
                <h2>{t.name}</h2>
                <p>{t.description}</p>
                <small>
                  {t.datasets.length} datasets, {t.discoveries.length}{' '}
                  discoveries
                </small>
              </Link>
            </li>
          ))}
        </ThematicList>
      </Constrainer>
    </PageMainContent>
  );
}

export default RootHome;