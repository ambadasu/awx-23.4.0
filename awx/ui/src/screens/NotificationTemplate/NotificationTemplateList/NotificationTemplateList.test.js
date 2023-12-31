import React from 'react';
import { act } from 'react-dom/test-utils';
import {
  NotificationsAPI,
  NotificationTemplatesAPI,
  OrganizationsAPI,
} from 'api';
import { mountWithContexts } from '../../../../testUtils/enzymeHelpers';
import NotificationTemplateList from './NotificationTemplateList';

jest.mock('../../../api');

const mockTemplates = {
  data: {
    count: 3,
    results: [
      {
        name: 'Boston',
        id: 1,
        url: '/notification_templates/1',
        type: 'slack',
        summary_fields: {
          organization: {
            id: 1,
            name: 'Foo',
          },
          recent_notifications: [
            {
              status: 'success',
            },
          ],
          user_capabilities: {
            delete: true,
            edit: true,
          },
        },
      },
      {
        name: 'Minneapolis',
        id: 2,
        url: '/notification_templates/2',
        summary_fields: {
          organization: {
            id: 2,
            name: 'Bar',
          },
          recent_notifications: [],
          user_capabilities: {
            delete: true,
            edit: true,
          },
        },
      },
      {
        name: 'Philidelphia',
        id: 3,
        url: '/notification_templates/3',
        summary_fields: {
          organization: {
            id: 3,
            name: 'Test',
          },
          recent_notifications: [
            {
              status: 'failed',
            },
            {
              status: 'success',
            },
          ],
          user_capabilities: {
            delete: true,
            edit: true,
          },
        },
      },
    ],
  },
};

describe('<NotificationTemplateList />', () => {
  let wrapper;
  beforeEach(() => {
    OrganizationsAPI.read.mockResolvedValue(mockTemplates);
    OrganizationsAPI.readOptions.mockResolvedValue({
      data: {
        actions: {
          GET: {},
          POST: {},
        },
      },
    });
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should load notifications', async () => {
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    expect(OrganizationsAPI.read).toHaveBeenCalledTimes(1);
    expect(wrapper.find('NotificationTemplateListItem').length).toBe(3);
  });

  test('should select item', async () => {
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    expect(
      wrapper.find('.pf-c-table__check').first().find('input').prop('checked')
    ).toEqual(false);
    await act(async () => {
      wrapper
        .find('.pf-c-table__check')
        .first()
        .find('input')
        .props()
        .onChange();
    });
    wrapper.update();
    expect(
      wrapper.find('.pf-c-table__check').first().find('input').prop('checked')
    ).toEqual(true);
  });

  test('should delete notifications', async () => {
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    expect(OrganizationsAPI.read).toHaveBeenCalledTimes(1);
    await act(async () => {
      wrapper.find('Checkbox#select-all').props().onChange(true);
    });
    wrapper.update();
    await act(async () => {
      wrapper.find('button[aria-label="Delete"]').simulate('click');
      wrapper.update();
    });
    const deleteButton = global.document.querySelector(
      'body div[role="dialog"] button[aria-label="confirm delete"]'
    );
    expect(deleteButton).not.toEqual(null);
    await act(async () => {
      deleteButton.click();
    });
    expect(OrganizationsAPI.destroy).toHaveBeenCalledTimes(3);
    expect(OrganizationsAPI.read).toHaveBeenCalledTimes(2);
  });

  test('should show error dialog shown for failed deletion', async () => {
    OrganizationsAPI.destroy.mockRejectedValue(
      new Error({
        response: {
          config: {
            method: 'delete',
            url: '/api/v2/organizations/1',
          },
          data: 'An error occurred',
        },
      })
    );
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    await act(async () => {
      wrapper
        .find('.pf-c-table__check')
        .first()
        .find('input')
        .props()
        .onChange();
    });
    wrapper.update();
    await act(async () => {
      wrapper.find('button[aria-label="Delete"]').simulate('click');
      wrapper.update();
    });
    const deleteButton = global.document.querySelector(
      'body div[role="dialog"] button[aria-label="confirm delete"]'
    );
    expect(deleteButton).not.toEqual(null);
    await act(async () => {
      deleteButton.click();
    });
    wrapper.update();

    const modal = wrapper.find('Modal');
    expect(modal.prop('isOpen')).toEqual(true);
    expect(modal.prop('title')).toEqual('Error!');
  });

  test('should show add button', async () => {
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    expect(wrapper.find('ToolbarAddButton').length).toBe(1);
  });

  test('should show toast after test resolves', async () => {
    jest.useFakeTimers();
    NotificationTemplatesAPI.test.mockResolvedValue({
      data: {
        notification: 9182,
      },
    });
    NotificationsAPI.readDetail.mockResolvedValue({
      data: {
        id: 9182,
        status: 'failed',
        error: 'There was an error with the notification',
        summary_fields: {
          notification_template: {
            name: 'foobar',
          },
        },
      },
    });
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    expect(wrapper.find('Alert').length).toBe(0);
    await act(async () => {
      wrapper
        .find('button[aria-label="Test Notification"]')
        .at(0)
        .simulate('click');
    });
    wrapper.update();

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();
    expect(wrapper.find('Alert').length).toBe(1);
  });

  test('should hide add button (rbac)', async () => {
    OrganizationsAPI.readOptions.mockResolvedValue({
      data: {
        actions: {
          GET: {},
        },
      },
    });
    await act(async () => {
      wrapper = mountWithContexts(<NotificationTemplateList />);
    });
    wrapper.update();
    expect(wrapper.find('ToolbarAddButton').length).toBe(0);
  });
});
