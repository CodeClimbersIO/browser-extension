import React from "react";
import { createRoot } from "react-dom/client";
import { Popup } from "@src/components/Popup/Popup";

import { ThemeProvider } from "@src/stores/ThemeProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const container = document.getElementById("#__root");
const root = createRoot(container!);

const client = new QueryClient();

root.render(
  <QueryClientProvider client={client}>
    <ThemeProvider>
      <Popup />
    </ThemeProvider>
  </QueryClientProvider>,
);
