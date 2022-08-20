import type { RouteObject } from 'react-router'
import { describe, test, expect, vi } from 'vitest'

let userEditRoute: RouteObject = {
  path: "edit",
};
let userProfileRoute: RouteObject = {
  path: ":id",
  children: [userEditRoute],
};
let usersRoute: RouteObject = {
  path: "/users",
  children: [{ index: true }, userProfileRoute],
};
let indexWithPathRoute: RouteObject = {
  path: "/withpath",
  index: true,
};
let layoutRouteIndex: RouteObject = {
  path: "/layout",
  index: true,
};
let layoutRoute: RouteObject = {
  path: "/layout",
  children: [
    { path: "item", },
    { path: ":id", },
    { path: "*", },
  ],
};

let routes = [
  { path: "/", element },
  {
    path: "/home",
    children: [
      { index: true, },
      { path: "*" },
    ],
  },
  indexWithPathRoute,
  layoutRoute,
  layoutRouteIndex,
  usersRoute,
  { path: "*" },
];

describe('index', () => {
  test('demo part', () => {
    console.log = vi.fn()
    welcome()
    expect(console.log).toHaveBeenCalledWith('hello world')
  })
})
