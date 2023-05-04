import React, { useMemo, useRef } from 'react';
import styled from 'styled-components';
import { DatasetData, datasets, taxonomies } from 'veda';
import { Link } from 'react-router-dom';
import { glsp, media } from '@devseed-ui/theme-provider';
import { Subtitle } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { CollecticonXmarkSmall } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import DatasetMenu from './dataset-menu';

import BrowseControls from '$components/common/browse-controls';
import {
  Actions,
  optionAll,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import {
  LayoutProps,
  useSlidingStickyHeaderProps
} from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import {
  Card,
  CardList,
  CardMeta,
  CardTopicsList
} from '$components/common/card';
import EmptyHub from '$components/common/empty-hub';
import { PageMainContent } from '$styles/page';
import { DATASETS_PATH, getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import Pluralize from '$utils/pluralize';
import { Pill } from '$styles/pill';
import { FeaturedDatasets } from '$components/common/featured-slider-section';
import { CardSourcesList } from '$components/common/card-sources';

const allDatasets = Object.values(datasets).map((d) => d!.data);

const DatasetCount = styled(Subtitle)`
  grid-column: 1 / -1;
  display: flex;
  gap: ${glsp(0.5)};

  span {
    text-transform: uppercase;
    line-height: 1.5rem;
  }
`;

const BrowseHeader = styled(FoldHeader)`
  ${media.largeUp`
    ${FoldHeadline} {
      align-self: flex-start;
    }

    ${BrowseControls} {
      padding-top: 1rem;
    }
  `}
`;

const topicsOptions = [optionAll, ...taxonomies.thematics];

const sourcesOptions = [optionAll, ...taxonomies.sources];

const sortOptions = [{ id: 'name', name: 'Name' }];

const prepareDatasets = (data: DatasetData[], options) => {
  const { sortField, sortDir, search, topic, source } = options;

  let filtered = [...data];

  // Does the free text search appear in specific fields?
  if (search.length >= 3) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(searchLower) ||
        d.description.toLowerCase().includes(searchLower) ||
        d.layers.some((l) => l.stacCol.toLowerCase().includes(searchLower)) ||
        d.thematics.some((t) => t.name.toLowerCase().includes(searchLower))
    );
  }

  if (topic !== optionAll.id) {
    filtered = filtered.filter((d) => d.thematics.find((t) => t.id === topic));
  }

  if (source !== optionAll.id) {
    // TODO: Filter source
  }

  /* eslint-disable-next-line fp/no-mutating-methods */
  filtered.sort((a, b) => {
    if (!a[sortField]) return Infinity;

    return a[sortField]?.localeCompare(b[sortField]);
  });

  if (sortDir === 'desc') {
    /* eslint-disable-next-line fp/no-mutating-methods */
    filtered.reverse();
  }

  return filtered;
};

function DataCatalog() {
  const controlVars = useBrowserControls({
    topicsOptions,
    sourcesOptions,
    sortOptions
  });

  const { topic, source, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  const displayDatasets = useMemo(
    () =>
      prepareDatasets(allDatasets, {
        search,
        topic,
        source,
        sortField,
        sortDir
      }),
    [search, topic, source, sortField, sortDir]
  );

  const isFiltering = !!(
    topic !== optionAll.id ||
    source !== optionAll.id ||
    search
  );

  const browseControlsHeaderRef = useRef<HTMLDivElement>(null);
  const { headerHeight } = useSlidingStickyHeaderProps();

  return (
    <PageMainContent>
      <LayoutProps
        title='Data Catalog'
        description='This dashboard explores key indicators to track and compare changes over time.'
      />
      <PageHero
        title='Data Catalog'
        description='This dashboard explores key indicators to track and compare changes over time.'
      />

      <FeaturedDatasets />

      <Fold>
        <BrowseHeader
          ref={browseControlsHeaderRef}
          style={{
            scrollMarginTop: `${headerHeight + 16}px`
          }}
        >
          <FoldHeadline>
            <FoldTitle>Browse</FoldTitle>
          </FoldHeadline>
          <BrowseControls
            {...controlVars}
            topicsOptions={topicsOptions}
            sourcesOptions={sourcesOptions}
            sortOptions={sortOptions}
          />
        </BrowseHeader>

        <DatasetCount>
          <span>
            Showing{' '}
            <Pluralize
              singular='dataset'
              plural='datasets'
              count={displayDatasets.length}
              showCount={true}
            />{' '}
            out of {allDatasets.length}.
          </span>
          {isFiltering && (
            <Button forwardedAs={Link} to={DATASETS_PATH} size='small'>
              Clear filters <CollecticonXmarkSmall />
            </Button>
          )}
        </DatasetCount>

        {displayDatasets.length ? (
          <CardList>
            {displayDatasets.map((d) => (
              <li key={d.id}>
                <Card
                  cardType='cover'
                  overline={
                    <CardMeta>
                      <CardSourcesList
                        sources={d.sources}
                        rootPath={DATASETS_PATH}
                        onSourceClick={(id) => {
                          onAction(Actions.SOURCE, id);
                          browseControlsHeaderRef.current?.scrollIntoView();
                        }}
                      />
                      <VerticalDivider variation='light' />
                      {/* TODO: Implement modified date: https://github.com/NASA-IMPACT/veda-ui/issues/514 */}
                      {/* 
                      <Link
                        to={`${DATASETS_PATH}?${Actions.SORT_FIELD}=date`}
                        onClick={(e) => {
                          e.preventDefault();
                          onAction(Actions.SORT_FIELD, 'date');
                        }}
                      >
                        Updated <time dateTime='2023-01-01'>X time ago</time>
                      </Link> */}
                    </CardMeta>
                  }
                  linkLabel='View more'
                  linkTo={getDatasetPath(d)}
                  title={
                    <TextHighlight value={search} disabled={search.length < 3}>
                      {d.name}
                    </TextHighlight>
                  }
                  description={
                    <TextHighlight value={search} disabled={search.length < 3}>
                      {d.description}
                    </TextHighlight>
                  }
                  imgSrc={d.media?.src}
                  imgAlt={d.media?.alt}
                  footerContent={
                    <>
                      {d.thematics.length ? (
                        <CardTopicsList>
                          <dt>Topics</dt>
                          {d.thematics.map((t) => (
                            <dd key={t.id}>
                              <Pill
                                variation='achromic'
                                as={Link}
                                to={`${DATASETS_PATH}?${Actions.TOPIC}=${t.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  onAction(Actions.TOPIC, t.id);
                                  browseControlsHeaderRef.current?.scrollIntoView();
                                }}
                              >
                                <TextHighlight
                                  value={search}
                                  disabled={search.length < 3}
                                >
                                  {t.name}
                                </TextHighlight>
                              </Pill>
                            </dd>
                          ))}
                        </CardTopicsList>
                      ) : null}
                      <DatasetMenu dataset={d} />
                    </>
                  }
                />
              </li>
            ))}
          </CardList>
        ) : (
          <EmptyHub>
            There are no datasets to show with the selected filters.
          </EmptyHub>
        )}
      </Fold>
    </PageMainContent>
  );
}

export default DataCatalog;
