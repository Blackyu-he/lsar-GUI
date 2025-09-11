import { lazy } from "solid-js";

export const LazyFlex = lazy(() => import("~/components/Flex/Flex"));

// --- fluentui ---

export const LazyButton = lazy(
  () => import("fluent-solid/lib/components/button")
);

export const LazyInput = lazy(
  () => import("fluent-solid/lib/components/input")
);

export const LazyBadge = lazy(
  () => import("fluent-solid/lib/components/badge")
);

export const LazyTooltip = lazy(
  () => import("fluent-solid/lib/components/tooltip")
);

export const LazyLabel = lazy(
  () => import("fluent-solid/lib/components/label")
);

export const LazyCard = lazy(
  () => import("fluent-solid/lib/components/card/Card")
);

export const LazyCardHeader = lazy(
  () => import("fluent-solid/lib/components/card/CardHeader")
);

export const LazyCardPreview = lazy(
  () => import("fluent-solid/lib/components/card/CardPreview")
);

export const LazyCardFooter = lazy(
  () => import("fluent-solid/lib/components/card/CardFooter")
);

export const LazySpinner = lazy(
  () => import("fluent-solid/lib/components/spinner")
);

export const LazyText = lazy(
  () => import("fluent-solid/lib/components/text/Text")
);

export const LazyCaption1 = lazy(
  () => import("fluent-solid/lib/components/text/Caption1")
);

export const LazyTextArea = lazy(
  () => import("fluent-solid/lib/components/textarea")
);

export const LazyField = lazy(
  () => import("fluent-solid/lib/components/field")
);

export const LazyLink = lazy(() => import("fluent-solid/lib/components/link"));
