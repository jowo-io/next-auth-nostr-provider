import { randomBytes } from "crypto";

import { LightningAuthSession } from "../config/types.js";
import { HandlerArguments, HandlerReturn } from "../utils/handlers.js";

type Check = {
  state: "success" | "failed";
  method: "get" | "set" | "update" | "delete" | null;
  message: string;
};

export function testField(
  expected: Record<string, any>,
  received: Record<string, any>,
  field: "k1" | "state" | "pubkey" | "sig" | "success",
  method: "update" | "set"
): Check {
  const state = received[field] !== expected[field] ? "failed" : "success";
  return {
    state,
    method,
    message: `Expected 'session.${field}' to be '${expected[field]}', found '${received[field]}'.`,
  };
}

export async function testSet(
  setMethod: () => Promise<undefined>
): Promise<Check[]> {
  const checks: Check[] = [];
  try {
    await setMethod();

    checks.push({
      state: "success",
      method: "set",
      message: "Successfully ran to completion.",
    });
    return checks;
  } catch (e: any) {
    console.error(e);
    checks.push({
      state: "failed",
      method: "set",
      message: e.message || "An unexpected error occurred.",
    });
    return checks;
  }
}

export async function testGet(
  expectedSession: { k1: string; state: string },
  getMethod: () => Promise<LightningAuthSession | null | undefined>
): Promise<Check[]> {
  const checks: Check[] = [];

  try {
    const receivedSession = await getMethod();

    if (!receivedSession) {
      checks.push({
        state: "failed",
        method: "set",
        message: "Session data not found.",
      });
      return checks;
    }
    checks.push(testField(receivedSession, expectedSession, "k1", "set"));
    checks.push(testField(receivedSession, expectedSession, "state", "set"));

    checks.push({
      state: "success",
      method: "get",
      message:
        "Successfully ran to completion and returned the expected session data.",
    });
    return checks;
  } catch (e: any) {
    console.error(e);
    checks.push({
      state: "failed",
      method: "get",
      message: e.message || "An unexpected error occurred.",
    });
    return checks;
  }
}

export async function testUpdate(
  expectedSession: { k1: string; state: string },
  updateMethod: () => Promise<undefined>,
  getMethod: () => Promise<LightningAuthSession | null | undefined>
): Promise<Check[]> {
  const checks: Check[] = [];
  try {
    await updateMethod();

    let receivedSession;
    try {
      receivedSession = await getMethod();
    } catch (e: any) {
      console.error(e);
      checks.push({
        state: "failed",
        method: "get",
        message: e.message || "An unexpected error occurred.",
      });
      return checks;
    }

    if (!receivedSession) {
      checks.push({
        state: "failed",
        method: "update",
        message: "Session data not found.",
      });
      return checks;
    }
    checks.push(testField(receivedSession, expectedSession, "k1", "update"));
    checks.push(testField(receivedSession, expectedSession, "state", "update"));
    checks.push(
      testField(receivedSession, expectedSession, "pubkey", "update")
    );
    checks.push(testField(receivedSession, expectedSession, "sig", "update"));
    checks.push(
      testField(receivedSession, expectedSession, "success", "update")
    );

    checks.push({
      state: "success",
      method: "update",
      message:
        "Successfully ran to completion and returned the updated session data.",
    });
    return checks;
  } catch (e: any) {
    console.error(e);
    checks.push({
      state: "failed",
      method: "update",
      message: e.message || "An unexpected error occurred.",
    });
    return checks;
  }
}

export async function testDelete(
  deleteMethod: () => Promise<undefined>,
  getMethod: () => Promise<LightningAuthSession | null | undefined>
): Promise<Check[]> {
  const checks: Check[] = [];

  try {
    await deleteMethod();

    let receivedSession;
    try {
      receivedSession = await getMethod();
    } catch (e: any) {
      console.error(e);
      checks.push({
        state: "failed",
        method: "get",
        message: e.message || "An unexpected error occurred.",
      });
      return checks;
    }

    if (receivedSession) {
      checks.push({
        state: "failed",
        method: "delete",
        message: "Session data was not deleted.",
      });
      return checks;
    }

    checks.push({
      state: "success",
      method: "delete",
      message: "Successfully ran to completion.",
    });
    return checks;
  } catch (e: any) {
    console.error(e);
    checks.push({
      state: "failed",
      method: "update",
      message: e.message || "An unexpected error occurred.",
    });
    return checks;
  }
}

export default async function handler({
  query,
  cookies,
  path,
  url,
  config,
}: HandlerArguments): Promise<HandlerReturn> {
  const checks: Check[] = [];

  try {
    const k1 =
      typeof query?.k1 === "string" ? query.k1 : randomBytes(6).toString("hex");
    const state =
      typeof query?.state === "string"
        ? query.state
        : randomBytes(6).toString("hex");
    const pubkey =
      typeof query?.pubkey === "string"
        ? query.pubkey
        : randomBytes(6).toString("hex");
    const sig =
      typeof query?.sig === "string"
        ? query.sig
        : randomBytes(6).toString("hex");

    const setSession = { k1, state };
    const updateSession = { k1, state, pubkey, sig, success: true };

    const setMethod = async () =>
      await config.storage.set({ k1, session: setSession }, path, config);
    const getMethod = async () =>
      await config.storage.get({ k1 }, path, config);
    const updateMethod = async () =>
      await config.storage.update({ k1, session: updateSession }, path, config);
    const deleteMethod = async () =>
      await config.storage.delete({ k1 }, path, config);

    // set
    checks.push(...(await testSet(setMethod)));

    // get
    checks.push(...(await testGet(setSession, getMethod)));

    // update
    checks.push(...(await testUpdate(updateSession, updateMethod, getMethod)));

    // delete
    checks.push(...(await testDelete(deleteMethod, getMethod)));

    // generic throw
  } catch (e: any) {
    console.error(e);
    checks.push({
      state: "failed",
      method: null,
      message: "Something went wrong running diagnostics.",
    });
  }

  return {
    status: 200,
    headers: {
      "content-type": "text/html",
    },
    response: `<!DOCTYPE html><html lang="en">
  <head>
    <meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diagnostics</title>
    <style>
      body {
        display: flex;
        justify-content: center;
        font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
      }
      .check {
        display: flex;
        margin: 10px 0;
        min-width: 900px;
      }
      .state {
        min-width:110px
      }
      .state-failed {
        color: red;
      }
      .state-success {
        color: green;
      }
      .method {
        font-weight: bold;
        min-width:150px
      }
      .message {
      }
    </style>
  </head>
  <body>
    <div>
    <div class="check">
      <span class="state"><b>Status</b></span>
      <span class="method"><b>Method</b></span>
      <span class="message"><b>Message</b></span>
    </div>
    <hr/>
    ${checks
      .map(
        ({ state, method, message }) =>
          `<div class="check">
            <span class="state state-${state}">${state.toUpperCase()}</span>
            <span class="method">${
              method ? `storage.${method}` : "unknown"
            }</span>
            <span class="message">${message}</span>
          </div>`
      )
      .join("")}
    </div>
  </body>
  </html>`,
  };
}
