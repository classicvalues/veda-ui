import styled, { css } from 'styled-components';

import { media, themeVal, visuallyHidden } from '@devseed-ui/theme-provider';
import { createOverlineStyles } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { variableGlsp } from './variable-utils';

const panelWidth = {
  xsmall: '20rem',
  small: '24rem'
};

export const Panel = styled.div`
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: ${panelWidth.xsmall};
  margin-left: -${panelWidth.xsmall};
  transition: margin 0.24s ease 0s;

  ${media.smallUp`
    width: ${panelWidth.small};
    margin-left: -${panelWidth.small};
  `}

  ${media.mediumDown`
    position: absolute;
    inset: 0;
  `}

  ${({ revealed }) =>
    revealed &&
    css`
      & {
        margin: 0;
      }
    `}
  
  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0;
    background: ${themeVal('color.surface')};
    box-shadow: ${themeVal('boxShadow.elevationD')};
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -2;
    background: transparent;
    width: 0;
    height: 100%;
    transition: background 0.64s ease 0s;

    ${({ revealed }) =>
      revealed &&
      css`
        & {
          ${media.mediumDown`
            background: ${themeVal('color.base-300a')};
            width: 200vw;
        `}
        }
      `}
  }
`;

export const PanelHeader = styled.div`
  position: relative;
`;

export const PanelHeadline = styled.div`
  ${visuallyHidden}
  padding: ${variableGlsp()};
`;

export const PanelActions = styled.div`
  /* styled-component */
`;

export const PanelTitle = styled.h2`
  /* styled-component */
`;

export const PanelToggle = styled(Button)`
  position: absolute;
  top: ${variableGlsp()};
  left: calc(100% + ${variableGlsp()});
`;

export const PanelBody = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const PanelWidget = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${variableGlsp(0.25)};
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')},
    0 -1px 0 0 ${themeVal('color.base-100a')};
`;

export const PanelWidgetHeader = styled.div`
  /* styled-component */
`;

export const PanelWidgetTitle = styled.h3`
  ${createOverlineStyles()}
  background: transparent;
`;

export const PanelWidgetBody = styled.div`
  /* styled-component */
`;
