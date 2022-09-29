import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import styled from 'styled-components';

import { listReset, media } from '@devseed-ui/theme-provider';
import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  CollecticonCircleInformation,
  CollecticonDownload2
} from '@devseed-ui/collecticons';

import { LayoutProps } from '$components/common/layout-root';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import PageHeroAnalysis from '$components/analysis/page-hero-analysis';
import { resourceNotFound } from '$components/uhoh';

import { PageMainContent } from '$styles/page';
import { VarHeading } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

import { useThematicArea } from '$utils/thematics';
import { thematicAnalysisPath } from '$utils/routes';
import { useAnalysisParams } from './use-analysis-params';
import {
  requestStacDatasetsTimeseries,
  TimeseriesData
} from './timeseries-data';

export const ResultsList = styled.ol`
  ${listReset()};
  display: grid;
  gap: ${variableGlsp()};
  grid-template-columns: repeat(2, 1fr);

  ${media.mediumUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.xlargeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const Result = styled.article`
  /* styled-component */
`;

const ResultHeader = styled.header`
  /* styled-component */
`;

const ResultHeadline = styled.div`
  /* styled-component */
`;

export const ResultTitle = styled(VarHeading).attrs({
  as: 'h3',
  size: 'large'
})`
  /* styled-component */
`;

const ResultActions = styled.div`
  /* styled-component */
`;

const ResultBody = styled.div`
  /* styled-component */
`;

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const queryClient = useQueryClient();
  const [requestStatus, setRequestStatus] = useState<TimeseriesData[]>([]);
  const { date, datasetsLayers, aoi, errors } = useAnalysisParams();

  useEffect(() => {
    if (!date.start || !datasetsLayers || !aoi) return;

    setRequestStatus([]);
    queryClient.cancelQueries(['analysis']);
    const requester = requestStacDatasetsTimeseries({
      date,
      aoi,
      layers: datasetsLayers,
      queryClient
    });

    requester.on('data', (data, index) => {
      setRequestStatus((dataStore) =>
        Object.assign([], dataStore, {
          [index]: data
        })
      );
    });
  }, [queryClient, date, datasetsLayers, aoi]);

  if (errors) {
    return <Navigate to={thematicAnalysisPath(thematic)} replace />;
  }

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Covering 8 datasets over a 50 M km2 area from Apr 7 to Sep 7, 2022.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHeroAnalysis
        title='Analysis'
        description='Covering 8 datasets over a 50 M km2 area from Apr 7 to Sep 7, 2022.'
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Results</FoldTitle>
        </FoldHeader>
        <ResultsList>
          <li>
            <Result>
              <ResultHeader>
                <ResultHeadline>
                  <ResultTitle>Dataset name</ResultTitle>
                </ResultHeadline>
                <ResultActions>
                  <Toolbar size='small'>
                    <ToolbarLabel>Actions</ToolbarLabel>
                    <ToolbarIconButton variation='base-text' disabled>
                      <CollecticonDownload2 title='Download' meaningful />
                    </ToolbarIconButton>
                    <VerticalDivider variation='dark' />
                    <ToolbarIconButton variation='base-text'>
                      <CollecticonCircleInformation
                        title='More info'
                        meaningful
                      />
                    </ToolbarIconButton>
                  </Toolbar>
                </ResultActions>
              </ResultHeader>
              <ResultBody>
                <div>
                  {!!requestStatus.length && (
                    <ul>
                      {requestStatus.map((l) => (
                        <li key={l.id}>
                          <h5>{l.name}</h5>
                          {l.status === 'errored' && (
                            <p>Something went wrong: {l.error.message}</p>
                          )}

                          {l.status === 'loading' && (
                            <p>
                              {l.meta.loaded} of {l.meta.total} loaded. Wait
                            </p>
                          )}

                          {l.status === 'succeeded' && !!l.data.length && (
                            <p>All good. Can show data now.</p>
                          )}

                          {l.status === 'succeeded' && !l.data.length && (
                            <p>There is no data available</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </ResultBody>
            </Result>
          </li>
        </ResultsList>
      </Fold>
    </PageMainContent>
  );
}
