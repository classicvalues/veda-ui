import React from 'react';
import { Link } from 'react-router-dom';

import { LayoutProps } from '../../common/layout-root';
import PageHero from '../../common/page-hero';
import { Fold } from '../../common/fold';

import { PageMainContent } from '../../../styles/page';
import { Card, CardList } from '../../../styles/card';
import { resourceNotFound } from '../../uhoh';

import { useThematicArea } from '../../../utils/thematics';

function DatasetsHub() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps title='Datasets' />
      <PageHero
        title='Datasets'
        description='This dashboard explores key indicators to track and compare changes over time.'
      />
      <Fold>
        <CardList>
          {thematic.data.datasets.map((t) => (
            <li key={t.id}>
              <Card>
                <Link to={`${t.id}`}>
                  <h2>{t.name}</h2>
                </Link>
              </Card>
            </li>
          ))}
        </CardList>
      </Fold>
    </PageMainContent>
  );
}

export default DatasetsHub;