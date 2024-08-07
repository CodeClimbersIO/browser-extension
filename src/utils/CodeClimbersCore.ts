/* eslint-disable no-fallthrough */
/* eslint-disable default-case */
import type { IDBPDatabase } from "idb";
import { openDB } from "idb";
import type { Tabs } from "webextension-polyfill";
import browser from "webextension-polyfill";
import { DEFAULT_CONFIG, IDLE_DETECTION_INTERVAL, SITES } from "./constants";
import type { SendHeartbeat } from "@src/types/heartbeats";
import {
  IS_FIREFOX,
  IS_EDGE,
  generateProjectFromDevSites,
  getCategoryFromUrl,
} from "@src/utils";
import contains from "@src/utils/contains";
import getDomainFromUrl, { getDomain } from "@src/utils/getDomainFromUrl";
import { getEnv } from "@src/utils/getEnv";

class CodeClimbersCore {
  tabsWithDevtoolsOpen: Tabs.Tab[];
  db: IDBPDatabase | undefined;
  state: string;

  constructor() {
    this.tabsWithDevtoolsOpen = [];
    this.state = "idle";
  }

  /**
   * Creates a IndexDB using idb https://github.com/jakearchibald/idb
   * a library that adds promises to IndexedDB and makes it easy to use
   */
  async createDB() {
    const dbConnection = await openDB("codeclimbers", 1, {
      upgrade(db, oldVersion) {
        // Create a store of objects
        const store = db.createObjectStore("cacheHeartbeats", {
          // The `time` property of the object will be the key, and be incremented automatically
          keyPath: "time",
        });
        // Switch over the oldVersion, *without breaks*, to allow the database to be incrementally upgraded.
        switch (oldVersion) {
          case 0:
          // Placeholder to execute when database is created (oldVersion is 0)
          case 1:
            // Create an index called `type` based on the `type` property of objects in the store
            store.createIndex("time", "time");
        }
      },
    });
    this.db = dbConnection;
  }

  setTabsWithDevtoolsOpen(tabs: Tabs.Tab[]): void {
    this.tabsWithDevtoolsOpen = tabs;
  }

  /**
   * Depending on various factors detects the current active tab URL or domain,
   * and sends it to Code Climbers for logging.
   */
  async recordHeartbeat(payload = {}): Promise<void> {
    const items = await browser.storage.sync.get({
      blacklist: "",
      loggingEnabled: DEFAULT_CONFIG.loggingEnabled,
      loggingStyle: DEFAULT_CONFIG.loggingStyle,
      socialMediaSites: DEFAULT_CONFIG.socialMediaSites,
      trackSocialMedia: DEFAULT_CONFIG.trackSocialMedia,
      whitelist: "",
    });

    if (items.loggingEnabled === true) {
      this.state = "allGood";

      let newState = "";
      // Detects we are running this code in the extension scope
      if (browser.idle as browser.Idle.Static | undefined) {
        newState = await browser.idle.queryState(IDLE_DETECTION_INTERVAL);
        if (newState !== "active") {
          this.state = "notLogging";
        }
      }

      // Get current tab URL.
      let url = "";
      if (browser.tabs as browser.Tabs.Static | undefined) {
        const tabs = await browser.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (tabs.length == 0) return;
        const currentActiveTab = tabs[0];
        url = currentActiveTab.url as string;
      } else {
        url = document.URL;
      }

      if (!url) {
        console.error("Invalid Permissions");
      }

      for (const site of SITES.NON_TRACKABLE) {
        if (url.startsWith(site)) {
          // Don't send a heartbeat on sites like 'chrome://newtab/' or 'about:newtab'
          return;
        }
      }

      const hostname = getDomain(url);
      if (!items.trackSocialMedia) {
        if ((items.socialMediaSites as string[]).includes(hostname)) {
          this.state = "blacklisted";
        }
      }

      // Checks dev websites
      const project = generateProjectFromDevSites(url);

      if (items.loggingStyle == "blacklist") {
        if (!contains(url, items.blacklist || ("" as string))) {
          await this.sendHeartbeat(
            {
              hostname: items.hostname as string,
              project,
              branch: "",
              url,
            },
            payload,
          );
        } else {
          this.state = "blacklisted";
          console.log(`${url} is on a blacklist.`);
        }
      }

      if (items.loggingStyle == "whitelist") {
        const heartbeat = this.getHeartbeat(
          url,
          items.whitelist || ("" as string),
        );
        if (heartbeat.url) {
          await this.sendHeartbeat(
            {
              branch: "",
              ...heartbeat,
              hostname: items.hostname as string,
              project: heartbeat.project ?? project,
            },
            payload,
          );
        } else {
          this.state = "whitelisted";
          console.log(`${url} is not on a whitelist.`);
        }
      }
    }
  }

  /**
   * Creates an array from list using \n as delimiter
   * and checks if any element in list is contained in the url.
   * Also checks if element is assigned to a project using @@ as delimiter
   */
  getHeartbeat(url: string, list: string = "") {
    const projectIndicatorCharacters = "@@";

    const lines = list.split("\n");
    for (let i = 0; i < lines.length; i++) {
      // strip (http:// or https://) and trailing (`/` or `@@`)
      const cleanLine = lines[i]
        .trim()
        .replace(/(\/|@@)$/, "")
        .replace(/^(?:https?:\/\/)?/i, "");
      if (cleanLine === "") continue;

      const projectIndicatorIndex = cleanLine.lastIndexOf(
        projectIndicatorCharacters,
      );
      const projectIndicatorExists = projectIndicatorIndex > -1;
      let projectName = null;
      let urlFromLine = cleanLine;
      if (projectIndicatorExists) {
        const start = projectIndicatorIndex + projectIndicatorCharacters.length;
        projectName = cleanLine.substring(start);
        urlFromLine = cleanLine
          .replace(cleanLine.substring(projectIndicatorIndex), "")
          .replace(/\/$/, "");
      }
      const schemaHttpExists = url.match(/^http:\/\//i);
      const schemaHttpsExists = url.match(/^https:\/\//i);
      let schema = "";
      if (schemaHttpExists) {
        schema = "http://";
      }
      if (schemaHttpsExists) {
        schema = "https://";
      }
      const cleanUrl = url
        .trim()
        .replace(/(\/|@@)$/, "")
        .replace(/^(?:https?:\/\/)?/i, "");
      const startsWithUrl = cleanUrl
        .toLowerCase()
        .includes(urlFromLine.toLowerCase());
      if (startsWithUrl) {
        return {
          project: projectName,
          url: schema + urlFromLine,
        };
      }

      const lineRe = new RegExp(cleanLine.replace(".", ".").replace("*", ".*"));

      // If url matches the current line return true
      if (lineRe.test(url)) {
        return {
          project: null,
          url: schema + urlFromLine,
        };
      }
    }

    return {
      project: null,
      url: null,
    };
  }

  /**
   * Given the heartbeat and logging type it creates a payload and
   * sends an ajax post request to the API.
   */
  async sendHeartbeat(
    heartbeat: SendHeartbeat,
    navigationPayload: Record<string, unknown>,
  ): Promise<void> {
    const category = getCategoryFromUrl(heartbeat.url);
    const loggingType = await this.getLoggingType();
    // Get only the domain from the entity.
    // And send that in heartbeat

    if (loggingType == "domain") {
      heartbeat.url = getDomainFromUrl(heartbeat.url);
      const payload = await this.preparePayload(heartbeat, "domain");
      console.log({ payload, navigationPayload });
      await this.sendPostRequestToApi(
        { category, ...payload, ...navigationPayload },
        heartbeat.hostname,
      );
    }
    // Send entity in heartbeat
    else if (loggingType == "url") {
      const payload = await this.preparePayload(heartbeat, "url");
      await this.sendPostRequestToApi(
        { category, ...payload, ...navigationPayload },
        heartbeat.hostname,
      );
    }
  }

  /**
   * Returns a promise with logging type variable.
   */
  async getLoggingType(): Promise<string> {
    const items = await browser.storage.sync.get({
      loggingType: DEFAULT_CONFIG.loggingType,
    });

    return items.loggingType;
  }

  /**
   * Creates payload for the heartbeat and returns it as JSON.
   */
  async preparePayload(
    heartbeat: SendHeartbeat,
    type: string,
  ): Promise<Record<string, unknown>> {
    const os = await this.getOperatingSystem();
    let browserName = "chrome";
    let userAgent;
    if (IS_FIREFOX) {
      browserName = "firefox";
      userAgent = navigator.userAgent.match(/Firefox\/\S+/g)![0];
    } else if (IS_EDGE) {
      browserName = "edge";
      userAgent = navigator.userAgent;
    } else {
      userAgent = navigator.userAgent.match(/Chrome\/\S+/g)![0];
    }
    const payload: Record<string, unknown> = {
      entity: heartbeat.url,
      time: Math.floor(new Date().getTime() / 1000), // UNIX TIMESTAMP
      type: type,
      user_agent: `${userAgent} ${os} ${browserName}-code_climbers/${getEnv().version}`,
    };

    payload.project = heartbeat.project ?? "<<LAST_PROJECT>>";
    payload.branch = heartbeat.branch ?? "<<LAST_BRANCH>>";

    return payload;
  }

  getOperatingSystem(): Promise<string> {
    return new Promise((resolve) => {
      chrome.runtime.getPlatformInfo(function (info) {
        resolve(`${info.os}_${info.arch}`);
      });
    });
  }

  /**
   * Sends AJAX request with payload to the heartbeat API as JSON.
   */
  async sendPostRequestToApi(
    payload: Record<string, unknown>,
    hostname = "",
  ): Promise<void> {
    try {
      const items = await browser.storage.sync.get({
        apiUrl: getEnv().apiUrl,
        heartbeatApiEndPoint: getEnv().heartbeatApiEndPoint,
      });

      const request: RequestInit = {
        body: JSON.stringify(payload),
        credentials: "omit",
        method: "POST",
      };
      if (hostname) {
        request.headers = {
          "X-Machine-Name": hostname,
        };
      }
      request.headers = {
        ...request.headers,
        "Content-Type": "application/json",
      };
      const response = await fetch(
        `${items.apiUrl}${items.heartbeatApiEndPoint}`,
        request,
      );
      const res = await response.json();

      if (!response.ok) {
        throw new Error(res.message);
      }
    } catch (err: unknown) {
      console.error(`Error sending request`, err);
      if (this.db) {
        await this.db.add("cacheHeartbeats", payload);
      }
    }
  }

  /**
   * Sends cached heartbeats request to code climbers api
   */
  async sendCachedHeartbeatsRequest(): Promise<void> {
    if (this.db) {
      const requests = await this.db.getAll("cacheHeartbeats");
      await this.db.clear("cacheHeartbeats");
      const chunkSize = 50; // Create batches of max 50 request
      for (let i = 0; i < requests.length; i += chunkSize) {
        const chunk = requests.slice(i, i + chunkSize);
        const requestsPromises: Promise<void>[] = [];
        chunk.forEach((request: Record<string, unknown>) =>
          requestsPromises.push(this.sendPostRequestToApi(request)),
        );
        try {
          await Promise.all(requestsPromises);
        } catch (error: unknown) {
          console.log("Error sending heartbeats");
        }
      }
    }
  }
}

export default new CodeClimbersCore();
