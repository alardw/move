import { describe, it, expect } from 'vitest';
import { asyncResource } from './index';

describe('asyncResource constructors', () => {
  it('loading()', () => {
    expect(asyncResource.loading()).toEqual({ status: 'loading' });
  });

  it('success() carries data and optional refreshing flag', () => {
    expect(asyncResource.success([1, 2])).toEqual({
      status: 'success',
      data: [1, 2],
      refreshing: undefined,
    });
    expect(asyncResource.success('x', { refreshing: true })).toEqual({
      status: 'success',
      data: 'x',
      refreshing: true,
    });
  });

  it('error() carries the error and optional retry', () => {
    const retry = () => {};
    const err = new Error('boom');
    expect(asyncResource.error(err, retry)).toEqual({ status: 'error', error: err, retry });
  });
});

describe('asyncResource.from — flat → discriminated union', () => {
  it('maps an error (with retry from refetch) above all else', () => {
    const refetch = () => {};
    const err = new Error('nope');
    // error wins even when data is also present
    expect(asyncResource.from({ data: 'stale', error: err, refetch })).toEqual({
      status: 'error',
      error: err,
      retry: refetch,
    });
  });

  it('maps present data to success, with refreshing from isFetching', () => {
    expect(asyncResource.from({ data: [1], isFetching: true })).toEqual({
      status: 'success',
      data: [1],
      refreshing: true,
    });
    expect(asyncResource.from({ data: [1] })).toEqual({
      status: 'success',
      data: [1],
      refreshing: false,
    });
  });

  it('treats null/empty data as valid success (only undefined is "not loaded")', () => {
    expect(asyncResource.from({ data: null })).toEqual({
      status: 'success',
      data: null,
      refreshing: false,
    });
    expect(asyncResource.from({ data: [] })).toEqual({
      status: 'success',
      data: [],
      refreshing: false,
    });
  });

  it('maps undefined data with no error to loading', () => {
    expect(asyncResource.from({ isLoading: true })).toEqual({ status: 'loading' });
    expect(asyncResource.from({})).toEqual({ status: 'loading' });
  });
});
