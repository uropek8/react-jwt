import Api from "./index";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let client, mock, api;

beforeEach(() => {
  client = axios.create();
  mock = new MockAdapter(client);
  api = new Api({ client });
});

test("Shoud take login information", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const LOGIN_RESPONSE = {
    token: "access_token",
    refreshToken: "refresh_token",
  };

  mock.onPost("/login", LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
  mock.onGet("/users").reply(200, []);

  await api.login(LOGIN_REQUEST);
  await api.getUsers();

  expect(mock.history.get.length).toBe(1);
  expect(mock.history.get[0].headers.Authorization).toBe(`Bearer ${LOGIN_RESPONSE.token}`);
  expect(api).toBeTruthy();
});

test("Shoud remove logout information", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const LOGIN_RESPONSE = {
    token: "access_token",
    refreshToken: "refresh_token",
  };

  mock.onPost("/login", LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
  mock.onGet("/users").reply(200, []);

  await api.login(LOGIN_REQUEST);
  await api.logout();
  await api.getUsers();

  expect(mock.history.get.length).toBe(1);
  expect(mock.history.get[0].headers.Authorization).toBeFalsy();
});

test("Correctly request of 401 with new token", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const LOGIN_RESPONSE = {
    token: "access_token",
    refreshToken: "refresh_token",
  };
  const REFRESH_REQUEST = {
    refreshToken: LOGIN_RESPONSE.refreshToken,
  };
  const REFRESH_RESPONSE = {
    token: "access_token_2",
    refreshToken: "refresh_token_2",
  };

  mock.onPost("/login", LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
  mock.onPost("/refresh", REFRESH_REQUEST).replyOnce(200, REFRESH_RESPONSE);
  mock.onGet("/users").reply((config) => {
    const { Authorization: auth } = config.headers;

    if (auth === `Bearer ${LOGIN_RESPONSE.token}`) {
      return [401];
    }

    if (auth === `Bearer ${REFRESH_RESPONSE.token}`) {
      return [200, []];
    }

    return [404];
  });

  await api.login(LOGIN_REQUEST);
  await api.getUsers();

  expect(mock.history.get.length).toBe(2);
  expect(mock.history.get[1].headers.Authorization).toBe(`Bearer ${REFRESH_RESPONSE.token}`);
});

test("Correctly fail request of non-401", async () => {
  mock.onGet("/users").reply(404);

  await expect(async () => await api.getUsers()).rejects.toThrow();
});

test("Does not contain more then one refresh token", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const LOGIN_RESPONSE = {
    token: "access_token",
    refreshToken: "refresh_token",
  };
  const REFRESH_REQUEST = {
    refreshToken: LOGIN_RESPONSE.refreshToken,
  };
  const REFRESH_RESPONSE = {
    token: "access_token_2",
    refreshToken: "refresh_token_2",
  };

  mock.onPost("/login", LOGIN_REQUEST).reply(200, LOGIN_RESPONSE);
  mock.onPost("/refresh", REFRESH_REQUEST).replyOnce(200, REFRESH_RESPONSE);
  mock.onGet("/users").reply((config) => {
    const { Authorization: auth } = config.headers;

    if (auth === `Bearer ${LOGIN_RESPONSE.token}`) {
      return [401];
    }

    if (auth === `Bearer ${REFRESH_RESPONSE.token}`) {
      return [200, []];
    }

    return [404];
  });

  await api.login(LOGIN_REQUEST);
  await Promise.all([api.getUsers(), api.getUsers()]);

  
  expect(mock.history.post.filter(({url}) => url === '/refresh').length).toBe(1);
});
