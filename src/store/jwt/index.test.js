import JwtApi from "./index";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

let client, mock, api;

beforeEach(() => {
  client = axios.create();
  mock = new MockAdapter(client);
  api = new JwtApi({ client });
});

test("Shoud take login information", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const searchParams = new URLSearchParams(LOGIN_REQUEST);
  const LOGIN_RESPONSE = {
    body: {
      access_token: "access_token",
      refresh_token: "refresh_token",
    },
  };

  mock.onPost(`/login?${searchParams.toString()}`).reply(200, LOGIN_RESPONSE);
  mock.onGet("/me").reply(200, []);

  await api.login(LOGIN_REQUEST);
  await api.me();

  expect(mock.history.get.length).toBe(1);
  expect(mock.history.get[0].headers.Authorization).toBe(
    `Bearer ${LOGIN_RESPONSE.body.access_token}`
  );
  expect(api).toBeTruthy();
});

test("Shoud remove logout information", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const searchParams = new URLSearchParams(LOGIN_REQUEST);
  const LOGIN_RESPONSE = {
    body: {
      access_token: "access_token",
      refresh_token: "refresh_token",
    },
  };

  mock.onPost(`/login?${searchParams.toString()}`).reply(200, LOGIN_RESPONSE);
  mock.onGet("/me").reply(200, []);

  await api.login(LOGIN_REQUEST);
  await api.logout();
  await api.me();

  expect(mock.history.get.length).toBe(1);
  expect(mock.history.get[0].headers.Authorization).toBeFalsy();
});

test("Correctly request of 401-statusCode with new token", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const searchParams = new URLSearchParams(LOGIN_REQUEST);
  const LOGIN_RESPONSE = {
    body: {
      access_token: "access_token",
      refresh_token: "refresh_token",
    },
  };
  const REFRESH_REQUEST = {
    headers: { Authorization: `Bearer ${LOGIN_RESPONSE.body.refresh_token}` },
  };
  const REFRESH_RESPONSE = {
    body: {
      access_token: "access_token_2",
      refresh_token: "refresh_token_2",
    },
  };
  const STATUS_RESPONSE = {
    statusCode: 401,
  };

  mock.onPost(`/login?${searchParams.toString()}`).reply(200, LOGIN_RESPONSE);
  mock.onPost("/refresh", REFRESH_REQUEST).replyOnce(200, REFRESH_RESPONSE);
  mock.onGet("/me").reply((config) => {
    const { Authorization: auth } = config.headers;

    if (auth === `Bearer ${LOGIN_RESPONSE.body.access_token}`) {
      return [200, STATUS_RESPONSE];
    }

    if (auth === `Bearer ${REFRESH_RESPONSE.body.access_token}`) {
      return [200, []];
    }

    return [404];
  });

  await api.login(LOGIN_REQUEST);
  await api.me();

  expect(mock.history.get.length).toBe(2);
  expect(mock.history.get[1].headers.Authorization).toBe(`Bearer ${REFRESH_RESPONSE.body.access_token}`);
});

test("Correctly fail request of non 401-statusCode", async () => {
  mock.onGet("/me").reply(404);

  await expect(async () => await api.me()).rejects.toThrow();
});

test("Does not contain more then one refresh token", async () => {
  const LOGIN_REQUEST = {
    email: "email",
    password: "password",
  };
  const searchParams = new URLSearchParams(LOGIN_REQUEST);
  const LOGIN_RESPONSE = {
    body: {
      access_token: "access_token",
      refresh_token: "refresh_token",
    },
  };
  const REFRESH_REQUEST = {
    headers: { Authorization: `Bearer ${LOGIN_RESPONSE.body.refresh_token}` },
  };
  const REFRESH_RESPONSE = {
    body: {
      access_token: "access_token_2",
      refresh_token: "refresh_token_2",
    },
  };
  const STATUS_RESPONSE = {
    statusCode: 401,
  };

  mock.onPost(`/login?${searchParams.toString()}`).reply(200, LOGIN_RESPONSE);
  mock.onPost("/refresh", REFRESH_REQUEST).replyOnce(200, REFRESH_RESPONSE);
  mock.onGet("/me").reply((config) => {
    const { Authorization: auth } = config.headers;

    if (auth === `Bearer ${LOGIN_RESPONSE.body.access_token}`) {
      return [200, STATUS_RESPONSE];
    }

    if (auth === `Bearer ${REFRESH_RESPONSE.body.access_token}`) {
      return [200, []];
    }

    return [404];
  });

  await api.login(LOGIN_REQUEST);
  await Promise.all([api.me(), api.me()]);

  expect(mock.history.post.filter(({ url }) => url === "/refresh").length).toBe(1);
});
