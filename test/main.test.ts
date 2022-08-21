import { RouteObject } from 'react-router'
import { describe, test, expect, it } from 'vitest'

import { filterRoutes } from '../src/index'

const userEditRoute: RouteObject = {
  path: 'edit',
}
const userProfileRoute: RouteObject = {
  path: ':id',
  children: [userEditRoute],
}
const usersRoute: RouteObject = {
  path: '/users',
  children: [{ index: true }, userProfileRoute],
}
const indexWithPathRoute: RouteObject = {
  path: '/withpath',
  index: true,
}
const layoutRouteIndex: RouteObject = {
  path: '/layout',
  index: true,
}
const layoutRoute: RouteObject = {
  path: '/layout',
  children: [{ path: 'item' }, { path: ':id' }, { path: '*' }],
}

const routes = [
  { path: '/' },
  {
    path: '/home',
    children: [{ index: true }, { path: '*' }],
  },
  indexWithPathRoute,
  layoutRoute,
  layoutRouteIndex,
  usersRoute,
  { path: '*' },
]

describe('filter routes', () => {
  test('path /', () => {
    const result = filterRoutes(routes, '/')
    expect(result).toMatchObject([
      { path: '/', absolutePath: '/' },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /not-found', () => {
    const result = filterRoutes(routes, '/not-found')
    expect(result).toMatchObject([{ path: '*', absolutePath: '/*' }])
  })

  test('path /home', () => {
    const result = filterRoutes(routes, '/home')
    expect(result).toMatchObject([
      {
        path: '/home',
        absolutePath: '/home',
        children: [
          { index: true, absolutePath: '/home/' },
          { path: '*', absolutePath: '/home/*' },
        ],
      },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /layout', () => {
    const result = filterRoutes(routes, '/layout')
    expect(result).toMatchObject([
      {
        path: '/layout',
        children: [{ path: '*', absolutePath: '/layout/*' }],
        absolutePath: '/layout',
      },
      { path: '/layout', index: true, absolutePath: '/layout' },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /layout/item', () => {
    const result = filterRoutes(routes, '/layout/item')
    expect(result).toMatchObject([
      {
        path: '/layout',
        children: [
          { path: 'item', absolutePath: '/layout/item' },
          { path: ':id', absolutePath: '/layout/:id' },
          { path: '*', absolutePath: '/layout/*' },
        ],
        absolutePath: '/layout',
      },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /layout/1', () => {
    const result = filterRoutes(routes, '/layout/1')
    expect(result).toMatchObject([
      {
        path: '/layout',
        children: [
          { path: ':id', absolutePath: '/layout/:id' },
          { path: '*', absolutePath: '/layout/*' },
        ],
        absolutePath: '/layout',
      },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /users', () => {
    const result = filterRoutes(routes, '/users')
    expect(result).toMatchObject([
      {
        path: '/users',
        children: [{ index: true, absolutePath: '/users/' }],
        absolutePath: '/users',
      },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /users/1', () => {
    const result = filterRoutes(routes, '/users/1')
    expect(result).toMatchObject([
      {
        path: '/users',
        children: [
          {
            path: ':id',
            absolutePath: '/users/:id',
            children: [],
          },
        ],
        absolutePath: '/users',
      },
      { path: '*', absolutePath: '/*' },
    ])
  })

  test('path /users/1/edit', () => {
    const result = filterRoutes(routes, '/users/1/edit')
    expect(result).toMatchObject([
      {
        path: '/users',
        children: [
          {
            path: ':id',
            absolutePath: '/users/:id',
            children: [
              {
                absolutePath: '/users/:id/edit',
                path: 'edit',
              },
            ],
          },
        ],
        absolutePath: '/users',
      },
      { path: '*', absolutePath: '/*' },
    ])
  })
})

describe('filter routes with mutiple pathnames', () => {
  it('mutiple pathnames', () => {
    const result = filterRoutes(routes, ['/home', '/'])
    expect(result).toMatchObject([
      { path: '/', absolutePath: '/' },
      {
        path: '/home',
        absolutePath: '/home',
        children: [
          { index: true, absolutePath: '/home/' },
          { path: '*', absolutePath: '/home/*' },
        ],
      },
      { path: '*', absolutePath: '/*' },
    ])
  })
})
