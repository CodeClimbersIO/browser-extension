import React from 'react';
import { renderWithProviders } from '../utils/test-utils';
import { CODE_CLIMBER_URL, GITHUB_EXTENSION_URL } from '../constants';
import NavBar from './NavBar';

jest.mock('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => {
        return { version: 'test-version' };
      },
    },
  };
});

describe('NavBar', () => {
  it('should render properly', () => {
    const { container } = renderWithProviders(<NavBar />);
    // eslint-disable-next-line
    expect(container).toMatchInlineSnapshot(`
      <div>
        <nav
          class="navbar shadow-none"
          role="navigation"
        >
          <div
            class="navbar-header d-flex w-100 justify-content-between"
          >
            <a
              class="navbar-brand"
              href="${CODE_CLIMBER_URL}"
              rel="noreferrer"
              target="_blank"
            >
              <img
                src="graphics/codeclimbers-38.png"
              />
              <div>
                Code Climbers
              </div>
            </a>
            <button
              aria-controls="userInfoCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation"
              class="navbar-toggler"
              data-bs-target="#userInfoCollapse"
              data-bs-toggle="collapse"
              type="button"
            >
              <span
                class="sr-only"
              >
                Toggle navigation
              </span>
              <i
                class="fa fa-fw fa-cogs"
              />
            </button>
          </div>
          <div
            class="collapse navbar-collapse mt-4"
            id="userInfoCollapse"
          >
            <div />
            <ul
              class="nav navbar-nav border-bottom pb-2"
            >
              <div />
              <div />
              <li
                class="dropdown"
              >
                <a
                  aria-expanded="false"
                  class="dropdown-toggle text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
                  data-bs-toggle="dropdown"
                  href="#"
                  role="button"
                >
                  <i
                    class="fa fa-fw fa-info me-2"
                  />
                  About
                  <span
                    class="caret"
                  />
                </a>
                <ul
                  class="dropdown-menu shadow-none ms-4"
                  role="menu"
                >
                  <li
                    class="mb-2"
                  >
                    <a
                      class="text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
                      href="${GITHUB_EXTENSION_URL}/issues"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <i
                        class="fa fa-fw fa-bug me-2"
                      />
                      Report an Issue
                    </a>
                  </li>
                  <li
                    class="mb-2"
                  >
                    <a
                      class="text-body-secondary link-underline link-underline-opacity-0 d-flex w-100 align-items-center"
                      href="${GITHUB_EXTENSION_URL}"
                      rel="noreferrer"
                      target="_blank"
                    >
                      <i
                        class="fa fa-fw fa-github me-2"
                      />
                      View on GitHub
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    `);
  });
});
