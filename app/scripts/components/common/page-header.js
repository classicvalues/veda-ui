import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import { Link, NavLink } from 'react-router-dom';

import { glsp, listReset, media, themeVal } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { Heading, Overline } from '@devseed-ui/typography';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';
import { Button } from '@devseed-ui/button';
import { CollecticonHamburgerMenu } from '@devseed-ui/collecticons';

import deltaThematics from 'delta/thematics';
import NasaLogo from './nasa-logo';
import { variableGlsp } from '../../styles/variable-utils';
import { useThematicArea } from '../../utils/thematics';
import {
  thematicAboutPath,
  thematicDatasetsPath,
  thematicDiscoveriesPath,
  thematicRootPath
} from '../../utils/routes';

import { useMediaQuery } from '../../utils/use-media-query';

const appTitle = process.env.APP_TITLE;

const PageHeaderSelf = styled.header`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp()};
  padding: ${variableGlsp(0.75, 1)};
  background: ${themeVal('color.primary')};
  animation: ${reveal} 0.32s ease 0s 1;

  &,
  &:visited {
    color: ${themeVal('color.surface')};
  }
`;

const Brand = styled.div`
  flex-shrink: 0;

  a {
    display: grid;
    align-items: center;
    gap: ${glsp(0, 0.5)};

    &,
    &:visited {
      color: inherit;
      text-decoration: none;
    }

    #nasa-logo-neg-mono {
      opacity: 1;
      transition: all 0.32s ease 0s;
    }

    #nasa-logo-pos {
      opacity: 0;
      transform: translate(0, -100%);
      transition: all 0.32s ease 0s;
    }

    &:hover {
      opacity: 1;

      #nasa-logo-neg-mono {
        opacity: 0;
      }

      #nasa-logo-pos {
        opacity: 1;
      }
    }

    svg {
      grid-row: 1 / span 2;
      height: 2.5rem;
      width: auto;
      transform: scale(1.125);
    }

    span:first-of-type {
      font-size: 0.875rem;
      line-height: 1rem;
      font-weight: ${themeVal('type.base.extrabold')};
      text-transform: uppercase;
    }

    span:last-of-type {
      grid-row: 2;
      font-size: 1.25rem;
      line-height: 1.5rem;
      font-weight: ${themeVal('type.base.light')};
      letter-spacing: -0.025em;
    }
  }
`;

const GlobalNav = styled.nav`
  position: fixed;
  inset: 0 0 0 auto;
  z-index: 900;
  display: flex;
  flex-flow: column nowrap;
  width: 20rem;
  margin-right: -20rem;
  transition: margin 0.24s ease 0s;

  ${({ revealed }) =>
    revealed &&
    css`
      & {
        margin-right: 0;
      }
    `}

  ${media.mediumUp`
    position: static;
    flex: 1;
    margin: 0;
  }

    &:before {
      content: '';
    }
  `}

  &::after {
    content: '';
    position: absolute;
    inset: 0 0 0 auto;
    z-index: -1;
    background: transparent;
    width: 0;
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

const GlobalNavInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: ${themeVal('color.primary')};

  ${media.smallDown`
    box-shadow: ${themeVal('boxShadow.elevationD')};
  `}

  ${media.mediumUp`
    /* background: yellow; */
  `}
`;

const GlobalNavHeader = styled.div`
  padding: ${variableGlsp()};
  box-shadow: 0 1px 0 0 ${themeVal('color.surface-100a')};

  ${media.mediumUp`
    display: none;
  `}
`;

const GlobalNavTitle = styled(Heading).attrs({
  as: 'span',
  size: 'small'
})`
  /* styled-component */
`;

export const GlobalNavActions = styled.div`
  /* styled-component */
`;

export const GlobalNavToggle = styled(Button)`
  position: absolute;
  top: ${variableGlsp()};
  right: calc(100% + ${variableGlsp()});
`;

const GlobalNavBody = styled(ShadowScrollbar).attrs({
  topShadowVariation: 'dark',
  bottomShadowVariation: 'dark'
})`
  display: flex;
  flex: 1;
`;

const GlobalNavBodyInner = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  ${media.mediumUp`
    flex-direction: row;
    gap: ${variableGlsp()};
  `}
`;

const SectionsNavBlock = styled.div`
  ${media.mediumUp`
    margin-left: auto;
  `}
`;

const ThemesNavBlock = styled.div`
  ${media.smallDown`
    order: 2;
  `}
`;

const GlobalNavBlockTitle = styled(Overline).attrs({
  as: 'span'
})`
  display: block;
  padding: ${variableGlsp(1, 1, 0.25, 1)};
  color: currentColor;
  opacity: 0.64;

  ${media.mediumUp`
    padding: 0;
  `}
`;

const GlobalMenu = styled.ul`
  ${listReset()}
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.5)};

  ${media.mediumUp`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: ${glsp()};
  `}
`;

const GlobalMenuLink = styled(NavLink)`
  position: relative;
  display: block;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  padding: ${variableGlsp(0, 1)};

  ${media.mediumUp`
    padding: ${glsp(0.25, 0, 0.75, 0)};
  `}

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0.25rem;
    height: 0;
    background: currentColor;

    ${media.mediumUp`
      width: 0;
      height: 0.25rem;
    `}
  }

  &.active::after {
    ${media.smallDown`
      height: 100%;
    `}

    ${media.mediumUp`
      width: 100%;
    `}
  }
`;

function PageHeader() {
  const thematic = useThematicArea();

  const { isSmallDown, isMediumDown } = useMediaQuery();

  const [globalNavRevealed, setGlobalNavRevealed] = useState(!isMediumDown);

  const globalNavBodyRef = useRef(null);
  // Click listener for the whole global nav body so we can close it when clicking
  // the overlay on medium down media query.
  const onGlobalNavClick = useCallback((e) => {
    if (!globalNavBodyRef.current?.contains(e.target)) {
      setGlobalNavRevealed(false);
    }
  }, []);

  // Close global nav when media query changes.
  useEffect(() => {
    setGlobalNavRevealed(!isMediumDown);
  }, [isMediumDown]);

  return (
    <PageHeaderSelf>
      <Brand>
        <Link to='/'>
          <NasaLogo />
          <span>Earthdata</span> <span>{appTitle}</span>
        </Link>
      </Brand>
      <GlobalNav
        aria-label='Global'
        revealed={globalNavRevealed}
        onClick={onGlobalNavClick}
      >
        <GlobalNavInner ref={globalNavBodyRef}>
          <GlobalNavHeader>
            <GlobalNavTitle aria-hidden='true'>Browse</GlobalNavTitle>
            <GlobalNavActions>
              <GlobalNavToggle
                variation='achromic-text'
                fitting='skinny'
                onClick={() => setGlobalNavRevealed((v) => !v)}
                active={globalNavRevealed}
              >
                <CollecticonHamburgerMenu
                  title='Toggle global nav visibility'
                  meaningful
                />
              </GlobalNavToggle>
            </GlobalNavActions>
          </GlobalNavHeader>
          <GlobalNavBody as={isSmallDown ? undefined : 'div'}>
            <GlobalNavBodyInner>
              {thematic && deltaThematics.length > 1 && (
                <ThemesNavBlock>
                  <GlobalNavBlockTitle>Thematic areas</GlobalNavBlockTitle>
                  <GlobalMenu>
                    {deltaThematics.map((t) => (
                      <li key={t.id}>
                        <GlobalMenuLink to={`/${t.id}`} aria-current={null}>
                          {t.name}
                        </GlobalMenuLink>
                      </li>
                    ))}
                  </GlobalMenu>
                </ThemesNavBlock>
              )}
              <SectionsNavBlock>
                <GlobalNavBlockTitle>Sections</GlobalNavBlockTitle>
                {thematic ? (
                  <GlobalMenu>
                    <li>
                      <GlobalMenuLink to={thematicRootPath(thematic)} end>
                        Welcome
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink to={thematicDatasetsPath(thematic)}>
                        Datasets
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink to={thematicDiscoveriesPath(thematic)}>
                        Discoveries
                      </GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink to={thematicAboutPath(thematic)} end>
                        About
                      </GlobalMenuLink>
                    </li>
                  </GlobalMenu>
                ) : (
                  <GlobalMenu>
                    <li>
                      <GlobalMenuLink to='/'>Welcome</GlobalMenuLink>
                    </li>
                    <li>
                      <GlobalMenuLink to='/about'>About</GlobalMenuLink>
                    </li>
                  </GlobalMenu>
                )}
              </SectionsNavBlock>
            </GlobalNavBodyInner>
          </GlobalNavBody>
        </GlobalNavInner>
      </GlobalNav>
    </PageHeaderSelf>
  );
}

export default PageHeader;
