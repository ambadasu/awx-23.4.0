import React from 'react';
import { act } from 'react-dom/test-utils';
import { mountWithContexts } from '../../../testUtils/enzymeHelpers';
import AdvancedSearch from './AdvancedSearch';

describe('<AdvancedSearch />', () => {
  let wrapper;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Remove duplicates from searchableKeys/relatedSearchableKeys list', () => {
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={jest.fn}
        searchableKeys={[
          { key: 'foo', type: 'string' },
          { key: 'bar', type: 'string' },
        ]}
        relatedSearchableKeys={['bar', 'baz']}
      />
    );
    wrapper
      .find('Select[aria-label="Key select"] SelectToggle')
      .simulate('click');
    expect(
      wrapper.find('Select[aria-label="Key select"] SelectOption')
    ).toHaveLength(3);
  });

  test("Don't call onSearch unless a search value is set", () => {
    const advancedSearchMock = jest.fn();
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={advancedSearchMock}
        searchableKeys={[
          { key: 'foo', type: 'string' },
          { key: 'bar', type: 'string' },
        ]}
        relatedSearchableKeys={['bar', 'baz']}
      />
    );
    wrapper
      .find('Select[aria-label="Key select"] SelectToggle')
      .simulate('click');
    wrapper
      .find('Select[aria-label="Key select"] SelectOption')
      .at(1)
      .simulate('click');
    wrapper
      .find('TextInputBase[aria-label="Advanced search value input"]')
      .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    expect(advancedSearchMock).toBeCalledTimes(0);
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('foo');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledTimes(1);
  });

  test('Disable searchValue input until a key is set', () => {
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={jest.fn}
        searchableKeys={[]}
        relatedSearchableKeys={[]}
      />
    );
    expect(
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('isDisabled')
    ).toBe(true);
    act(() => {
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'foo'
      );
    });
    wrapper.update();
    expect(
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('isDisabled')
    ).toBe(false);
  });

  test('Strip and__ set type from key', () => {
    const advancedSearchMock = jest.fn();
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={advancedSearchMock}
        searchableKeys={[]}
        relatedSearchableKeys={[]}
      />
    );
    act(() => {
      wrapper.find('Select[aria-label="Set type select"]').invoke('onSelect')(
        {},
        'and'
      );
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'foo'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('foo', 'bar');
    jest.clearAllMocks();
    act(() => {
      wrapper.find('Select[aria-label="Set type select"]').invoke('onSelect')(
        {},
        'or'
      );
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'foo'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('or__foo', 'bar');
  });

  test('Add __search lookup to key when applicable', () => {
    const advancedSearchMock = jest.fn();
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={advancedSearchMock}
        searchableKeys={[
          { key: 'foo', type: 'string' },
          { key: 'bar', type: 'string' },
        ]}
        relatedSearchableKeys={['bar', 'baz']}
      />
    );
    act(() => {
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'foo'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('foo', 'bar');
    jest.clearAllMocks();
    act(() => {
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'bar'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('bar', 'bar');
    jest.clearAllMocks();
    act(() => {
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'baz'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('baz__name__icontains', 'bar');
    jest.clearAllMocks();
    act(() => {
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'baz'
      );
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('Select[aria-label="Related search type"]')
        .invoke('onSelect')({}, 'search');
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('baz__search', 'bar');
  });

  test('Key should be properly constructed from three typeaheads', () => {
    const advancedSearchMock = jest.fn();
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={advancedSearchMock}
        searchableKeys={[{ key: 'foo', type: 'string' }]}
        relatedSearchableKeys={[]}
      />
    );
    act(() => {
      wrapper.find('Select[aria-label="Set type select"]').invoke('onSelect')(
        {},
        'or'
      );
      wrapper.find('Select[aria-label="Key select"]').invoke('onSelect')(
        {},
        'foo'
      );
    });
    wrapper.update();
    act(() => {
      wrapper.find('Select[aria-label="Lookup select"]').invoke('onSelect')(
        {},
        'exact'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('or__foo__exact', 'bar');
  });

  test('searchValue should clear after onSearch is called', () => {
    const advancedSearchMock = jest.fn();
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={advancedSearchMock}
        searchableKeys={[{ key: 'foo', type: 'string' }]}
        relatedSearchableKeys={[]}
      />
    );
    act(() => {
      wrapper.find('Select[aria-label="Set type select"]').invoke('onSelect')(
        {},
        'or'
      );
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'foo'
      );
    });
    wrapper.update();
    act(() => {
      wrapper.find('Select[aria-label="Lookup select"]').invoke('onSelect')(
        {},
        'exact'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('or__foo__exact', 'bar');
    expect(
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('value')
    ).toBe('');
  });

  test('typeahead onClear should remove key components', () => {
    const advancedSearchMock = jest.fn();
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={advancedSearchMock}
        searchableKeys={[]}
        relatedSearchableKeys={[]}
      />
    );
    act(() => {
      wrapper.find('Select[aria-label="Set type select"]').invoke('onSelect')(
        {},
        'or'
      );
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'foo'
      );
    });
    wrapper.update();
    act(() => {
      wrapper.find('Select[aria-label="Lookup select"]').invoke('onSelect')(
        {},
        'exact'
      );
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('bar');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('or__foo__exact', 'bar');
    jest.clearAllMocks();
    act(() => {
      wrapper.find('Select[aria-label="Set type select"]').invoke('onClear')();
      wrapper.find('Select[aria-label="Key select"]').invoke('onClear')();
      wrapper.find('Select[aria-label="Lookup select"]').invoke('onClear')();
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .invoke('onChange')('baz');
    });
    wrapper.update();
    act(() => {
      wrapper
        .find('TextInputBase[aria-label="Advanced search value input"]')
        .prop('onKeyDown')({ key: 'Enter', preventDefault: jest.fn });
    });
    wrapper.update();
    expect(advancedSearchMock).toBeCalledWith('', 'baz');
  });

  test('Remove not operator from set type', () => {
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={jest.fn}
        searchableKeys={[
          { key: 'foo', type: 'string' },
          { key: 'bar', type: 'string' },
        ]}
        relatedSearchableKeys={['bar', 'baz']}
        enableNegativeFiltering={false}
      />
    );
    wrapper
      .find('Select[aria-label="Set type select"] SelectToggle')
      .simulate('click');
    const selectOptions = wrapper.find(
      'Select[aria-label="Set type select"] SelectOption'
    );
    expect(selectOptions).toHaveLength(2);
    expect(
      selectOptions.find('SelectOption[id="or-option-select"]').prop('value')
    ).toBe('or');
    expect(
      selectOptions.find('SelectOption[id="and-option-select"]').prop('value')
    ).toBe('and');
  });

  test('Remove search option from related search type', () => {
    wrapper = mountWithContexts(
      <AdvancedSearch
        onSearch={jest.fn}
        searchableKeys={[
          { key: 'foo', type: 'string' },
          { key: 'bar', type: 'string' },
        ]}
        relatedSearchableKeys={['bar', 'baz']}
        enableRelatedFuzzyFiltering={false}
      />
    );
    act(() => {
      wrapper.find('Select[aria-label="Key select"]').invoke('onCreateOption')(
        'baz'
      );
    });
    wrapper.update();
    wrapper
      .find('Select[aria-label="Related search type"] SelectToggle')
      .simulate('click');
    const selectOptions = wrapper.find(
      'Select[aria-label="Related search type"] SelectOption'
    );
    expect(selectOptions).toHaveLength(3);
    expect(
      selectOptions.find('SelectOption[id="name-option-select"]').prop('value')
    ).toBe('name__icontains');
    expect(
      selectOptions.find('SelectOption[id="id-option-select"]').prop('value')
    ).toBe('id');
  });
});
