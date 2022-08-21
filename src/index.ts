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

const isMatchPath = (meta: Parameters<typeof matchPath>[0], pathnames: string | string[]) => {
  const _pathnames = Array.isArray(pathnames) ? pathnames : [pathnames]
  return _pathnames.some((pathname) => matchPath(meta, pathname))
}

export const filterRoutes = (
  routes: RouteObject[],
  pathname: string | string[],
  parentPath = '',
) => {
  const matchedRoutes: RouteObject[] = []
  routes.forEach((route) => {
    const next: ExtendRouteObject = Object.assign({}, route) as ExtendRouteObject
    const absolutePath = joinPaths([parentPath || '/', next.path || ''])
    let matched = false
    if (next.path || next.index) {
      next.absolutePath = absolutePath
      matched = !!isMatchPath(
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
    if (matched || (next.children && next.children?.length > 0)) {
      matchedRoutes.push(next)
    }
  })
  return matchedRoutes
}
