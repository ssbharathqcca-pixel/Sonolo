/**
 * Tests for the SN-017 Axios offline-resilience layer: network-error
 * classification and the offline/online handler transitions wired into
 * the response interceptor. The axios adapter is stubbed, so no real
 * sockets are opened.
 */

import {
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  api,
  isNetworkError,
  resetConnectivityState,
  setConnectivityHandlers,
} from "../api/client";

const originalAdapter = api.defaults.adapter;

function stubConfig(): InternalAxiosRequestConfig {
  return { headers: new AxiosHeaders() };
}

function networkError(): AxiosError {
  // No `response` + a truthy `request` = the failure happened before the
  // server could answer (DNS, refused socket, timeout).
  return new AxiosError("Network Error", AxiosError.ERR_NETWORK, stubConfig(), {});
}

function httpError(status: number): AxiosError {
  const response = {
    data: {},
    status,
    statusText: "Error",
    headers: {},
    config: stubConfig(),
  } as unknown as AxiosResponse;
  return new AxiosError(
    `Request failed with status code ${status}`,
    AxiosError.ERR_BAD_RESPONSE,
    stubConfig(),
    {},
    response,
  );
}

beforeEach(() => {
  resetConnectivityState();
});

afterEach(() => {
  setConnectivityHandlers({});
  api.defaults.adapter = originalAdapter;
});

describe("isNetworkError", () => {
  it("classifies missing-response failures as network errors", () => {
    expect(isNetworkError(networkError())).toBe(true);
  });

  it("does not classify HTTP responses as network errors", () => {
    expect(isNetworkError(httpError(500))).toBe(false);
  });

  it("does not classify cancellations or non-axios errors as network errors", () => {
    expect(isNetworkError(new Error("boom"))).toBe(false);
  });
});

describe("response interceptor offline handling", () => {
  it("fires offline once per outage and online once per recovery", async () => {
    const onOffline = jest.fn();
    const onOnline = jest.fn();
    setConnectivityHandlers({ onOffline, onOnline });

    let failNext = true;
    api.defaults.adapter = async (config) => {
      if (failNext) {
        throw networkError();
      }
      return {
        data: {},
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      } as AxiosResponse;
    };

    await expect(api.get("/scenarios")).rejects.toBeInstanceOf(AxiosError);
    expect(onOffline).toHaveBeenCalledTimes(1);

    // A second failure during the same outage must not re-fire.
    await expect(api.get("/scenarios")).rejects.toBeInstanceOf(AxiosError);
    expect(onOffline).toHaveBeenCalledTimes(1);

    failNext = false;
    await api.get("/scenarios");
    expect(onOnline).toHaveBeenCalledTimes(1);

    // Steady-state successes stay silent.
    await api.get("/scenarios");
    expect(onOnline).toHaveBeenCalledTimes(1);
    expect(onOffline).toHaveBeenCalledTimes(1);
  });

  it("treats a real HTTP error response as proof of connectivity", async () => {
    const onOffline = jest.fn();
    const onOnline = jest.fn();
    setConnectivityHandlers({ onOffline, onOnline });
    resetConnectivityState();

    api.defaults.adapter = async () => {
      throw networkError();
    };
    await expect(api.get("/scenarios")).rejects.toBeInstanceOf(AxiosError);
    expect(onOffline).toHaveBeenCalledTimes(1);

    api.defaults.adapter = async () => {
      throw httpError(500);
    };
    await expect(api.get("/scenarios")).rejects.toMatchObject({
      response: { status: 500 },
    });
    expect(onOffline).toHaveBeenCalledTimes(1);
    expect(onOnline).toHaveBeenCalledTimes(1);
  });
});
