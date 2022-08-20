import { matchPath } from 'react-router'
import type { RouteObject } from 'react-router'

type ExtendRouteObject = RouteObject & {
  absolutePath: string
}

const joinPaths = (paths: string[]): string => {
  let pathname = paths.join('/').replace(/\/\/+/g, '/')
  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`
  }
  return pathname
}

export const filterRoutes = (routes: RouteObject[], pathname: string, parentPath = '') => {
  const matchedRoutes: RouteObject[] = []
  routes.forEach((route) => {
    const next: ExtendRouteObject = Object.assign({}, route) as ExtendRouteObject
    const absolutePath = joinPaths([parentPath || '/', next.path || ''])
    let matched = false
    if (next.path) {
      next.absolutePath = absolutePath
      matched = !!matchPath(
        {
          path: next.absolutePath,
          caseSensitive: next.caseSensitive,
          end: !next.children,
        },
        pathname,
      )
    }
    if (route.children) {
      next.children = filterRoutes(route.children, pathname, absolutePath)
    }
    if (matched || next.children) {
      matchedRoutes.push(next)
    }
  })
  return matchedRoutes
}
