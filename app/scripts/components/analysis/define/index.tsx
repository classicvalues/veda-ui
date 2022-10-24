import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media, multiply, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarIconButton, ToolbarLabel } from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import {
  Form,
  FormCheckable,
  FormGroupStructure,
  FormInput
} from '@devseed-ui/form';
import {
  CollecticonCircleInformation,
  CollecticonEllipsisVertical,
  CollecticonTickSmall,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import { useThematicArea } from '$utils/thematics';
import { variableGlsp } from '$styles/variable-utils';
import {
  analysisParams2QueryString,
  useAnalysisParams
} from '../results/use-analysis-params';
import { thematicAnalysisPath } from '$utils/routes';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHeroAnalysis from '$components/analysis/page-hero-analysis';
import { resourceNotFound } from '$components/uhoh';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldTitle,
  FoldBody
} from '$components/common/fold';
import AoiSelector from './aoi-selector';
import { useAoiControls } from '$components/common/aoi/use-aoi-controls';
import { Tip } from '$components/common/tip';
import { dateToInputFormat, inputFormatToDate } from '$utils/date';
import { Feature, MultiPolygon } from 'geojson';
import { getFilterPayload } from '$components/common/mapbox/layers/utils';
import axios from 'axios';

const FormBlock = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp(0.5)};

  > * {
    width: 50%;
  }
`;

const CheckableGroup = styled.div`
  display: grid;
  gap: ${variableGlsp(0.5)};
  grid-template-columns: repeat(2, 1fr);
  background: ${themeVal('color.surface')};

  ${media.mediumUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.xlargeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const FormCheckableCustom = styled(FormCheckable)`
  padding: ${variableGlsp(0.5)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.base-100a')};
  border-radius: ${themeVal('shape.rounded')};
`;

export const Note = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp(0.5)};
  justify-content: center;
  align-items: center;
  text-align: center;
  background: ${themeVal('color.base-50')};
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  min-height: 12rem;
  padding: ${variableGlsp()};

  [class*='Collecticon'] {
    opacity: 0.32;
  }
`;

export default function Analysis() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const { params, setAnalysisParam } = useAnalysisParams();
  const { start, end, datasetsLayers, aoi, errors } = params;

  const { aoi: aoiDrawState, onAoiEvent } = useAoiControls();

  // If there are errors in the url parameters it means that this should be
  // treated as a new analysis. If the parameters are all there and correct, the
  // user is refining the analysis.
  const isNewAnalysis = !!errors?.length;

  const analysisParamsQs = analysisParams2QueryString({
    start,
    end,
    datasetsLayers,
    aoi
  });

  const onStartDateChange = useCallback(
    (e) => {
      setAnalysisParam('start', inputFormatToDate(e.target.value));
    },
    [setAnalysisParam]
  );

  const onEndDateChange = useCallback(
    (e) => {
      setAnalysisParam('end', inputFormatToDate(e.target.value));
    },
    [setAnalysisParam]
  );

  const controller = useRef<AbortController>();

  useEffect(() => {
    if (!start || !end || !aoi) return;

    const load = async () => {
      try {

        if (controller.current) controller.current.abort();
        controller.current = new AbortController();
  
        const url = `${process.env.API_STAC_ENDPOINT}/search`;
        
        const payload = {
          'filter-lang': 'cql2-json',
          filter: getFilterPayload(start, undefined, end),
          limit: 500,
          fields: {
            include: ['bbox'],
            exclude: ['collection', 'links']
          }
        };
        const response = await axios.post(url, payload, {
          signal: controller.current.signal
        });
        console.log(response)
      } catch (error) {
        // TODO
      }
    };
    load();

  }, [start, end, aoi]);

  useEffect(() => {
    if (!aoiDrawState.drawing && aoiDrawState.feature) {
      // Quick and dirty conversion to MultiPolygon - might be avoided if using Google-polyline?
      const toMultiPolygon: Feature<MultiPolygon> = {
        type: 'Feature',
        properties: {...aoiDrawState.feature.properties},
        geometry: {
          type: 'MultiPolygon',
          coordinates: [aoiDrawState.feature.geometry.coordinates]
        }
      };
      setAnalysisParam('aoi', toMultiPolygon);
    }
  // setAnalysisParam not added to dependency array as it causes a infinite loop
  }, [aoiDrawState]);

  const readyToSelectDatasets = start && end && aoi;

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Visualize insights from a selected area over a period of time.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHeroAnalysis
        title={isNewAnalysis ? 'Start analysis' : 'Refine analysis'}
        description='Visualize insights from a selected area over a period of time.'
        renderActions={({ size }) => (
          <>
            {!isNewAnalysis && (
              <Button
                forwardedAs={Link}
                to={`${thematicAnalysisPath(
                  thematic
                )}/results${analysisParamsQs}`}
                type='button'
                size={size}
                variation='achromic-outline'
              >
                <CollecticonXmarkSmall /> Cancel
              </Button>
            )}
            <Tip
              visible
              placement='bottom-end'
              content='To get results, define an area, pick a date and select datasets.'
            >
              <Button type='button' size={size} variation='achromic-outline'>
                <CollecticonTickSmall /> Save
              </Button>
            </Tip>
          </>
        )}
      />

      <AoiSelector
        qsFeature={aoi}
        aoiDrawState={aoiDrawState}
        onAoiEvent={onAoiEvent}
      />

      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Date</FoldTitle>
          </FoldHeadline>
          <FoldHeadActions>
            <Toolbar size='small'>
              <ToolbarLabel>Actions</ToolbarLabel>
              <Dropdown
                alignment='right'
                triggerElement={(props) => (
                  <ToolbarIconButton variation='base-text' {...props}>
                    <CollecticonEllipsisVertical
                      title='More options'
                      meaningful
                    />
                  </ToolbarIconButton>
                )}
              >
                <DropTitle>Select a date preset</DropTitle>
                <DropMenu>
                  <li>
                    <DropMenuItem href='#'>Preset A</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Preset B</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Preset C</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Preset D</DropMenuItem>
                  </li>
                </DropMenu>
              </Dropdown>
            </Toolbar>
          </FoldHeadActions>
        </FoldHeader>
        <FoldBody>
          <Form>
            <FormBlock>
              <FormGroupStructure label='Start' id='start-date' required>
                <FormInput
                  type='date'
                  size='large'
                  id='start-date'
                  name='start-date'
                  value={start ? dateToInputFormat(start) : ''}
                  onChange={onStartDateChange}
                />
              </FormGroupStructure>

              <FormGroupStructure label='End' id='end-date' required>
                <FormInput
                  type='date'
                  size='large'
                  id='end-date'
                  name='end-date'
                  value={end ? dateToInputFormat(end) : ''}
                  onChange={onEndDateChange}
                />
              </FormGroupStructure>
            </FormBlock>
          </Form>
        </FoldBody>
      </Fold>

      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Datasets</FoldTitle>
          </FoldHeadline>
        </FoldHeader>
        <FoldBody>
          {readyToSelectDatasets ? (
            <Form>
              <CheckableGroup>
                <FormCheckableCustom
                  id='dataset-a'
                  name='dataset-a'
                  textPlacement='right'
                  type='checkbox'
                >
                  Dataset name
                </FormCheckableCustom>

                <FormCheckableCustom
                  id='dataset-b'
                  name='dataset-b'
                  textPlacement='right'
                  type='checkbox'
                >
                  Dataset name
                </FormCheckableCustom>

                <FormCheckableCustom
                  id='dataset-c'
                  name='dataset-c'
                  textPlacement='right'
                  type='checkbox'
                >
                  Dataset name
                </FormCheckableCustom>

                <FormCheckableCustom
                  id='dataset-d'
                  name='dataset-d'
                  textPlacement='right'
                  type='checkbox'
                >
                  Dataset name
                </FormCheckableCustom>

                <FormCheckableCustom
                  id='dataset-e'
                  name='dataset-e'
                  textPlacement='right'
                  type='checkbox'
                >
                  Dataset name
                </FormCheckableCustom>

                <FormCheckableCustom
                  id='dataset-f'
                  name='dataset-f'
                  textPlacement='right'
                  type='checkbox'
                >
                  Dataset name
                </FormCheckableCustom>
              </CheckableGroup>
            </Form>
          ) : (
            <Note>
              <CollecticonCircleInformation size='large' />
              <p>To select datasets, please define an area and a date first.</p>
            </Note>
          )}
        </FoldBody>
      </Fold>
    </PageMainContent>
  );
}
