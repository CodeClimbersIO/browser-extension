export namespace CodeClimbers {
  export interface Core {
    version: `${number}.${number}.${number}`;
    supportedBrowser: "edge" | "firefox" | "chrome";
    category: "design" | "development" | "unknown" | "socialMedia";
  }

  export interface Logging {
    style: "whitelist" | "blacklist";
    type: "domain" | "url";
  }

  export interface Style {
    theme: "light" | "dark";
  }
}
