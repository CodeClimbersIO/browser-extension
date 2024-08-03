import React from 'react';
import { renderWithProviders } from '../utils/test-utils';
import { CODE_CLIMBER_URL } from '../constants';
import MainList from './MainList';

jest.mock('webextension-polyfill', () => {
  return {
    runtime: {
      getManifest: () => {
        return { version: 'test-version' };
      },
    },
  };
});

describe('MainList', () => {
  let loggingEnabled: boolean;
  let totalTimeLoggedToday: string;
  beforeEach(() => {
    loggingEnabled = false;
    totalTimeLoggedToday = '1/1/1999';
  });
  it('should render properly', () => {
    const { container } = renderWithProviders(
      <MainList loggingEnabled={loggingEnabled} totalTimeLoggedToday={totalTimeLoggedToday} />,
    );
    // eslint-disable-next-line
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div>
          <div
            class="list-group"
          >
            <a
              class="list-group-item text-body-secondary"
              href="#"
            >
              <i
                class="fa fa-fw fa-cogs me-2"
              />
              Options
            </a>
            <a
              class="list-group-item text-body-secondary"
              href="${CODE_CLIMBER_URL}/login"
              rel="noreferrer"
              target="_blank"
            >
              <i
                class="fa fa-fw fa-sign-in me-2"
              />
              Login
            </a>
          </div>
        </div>
      </div>
    `);
  });
});
