import React from "react";
import { createRoot } from "react-dom/client";
import { Options } from "@src/components/Options/Options";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const container = document.getElementById("#__root");
const root = createRoot(container!);
const client = new QueryClient();

root.render(
  <QueryClientProvider client={client}>
    <Options />
  </QueryClientProvider>,
);
