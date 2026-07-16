"use client";

import { useEffect, useRef } from "react";
import { Stack, Text } from "@sanity/ui";
import {
  type NumberInputProps,
  useClient,
  useFormValue,
} from "sanity";

/** Sets populationAsOf when the population value changes (on blur). */
export function PopulationInput(props: NumberInputProps) {
  const { elementProps, value, renderDefault } = props;
  const documentId = useFormValue(["_id"]) as string | undefined;
  const populationAsOf = useFormValue(["populationAsOf"]) as string | undefined;
  const client = useClient({ apiVersion: "2025-01-01" });
  const valueOnFocus = useRef(value);
  const didBackfill = useRef(false);

  // Existing listings: if population is set but as-of is empty, stamp today once.
  useEffect(() => {
    if (didBackfill.current || !documentId) return;
    if (value == null || populationAsOf) return;
    didBackfill.current = true;
    void client
      .patch(documentId)
      .set({ populationAsOf: new Date().toISOString() })
      .commit();
  }, [client, documentId, populationAsOf, value]);

  return (
    <Stack space={2}>
      {renderDefault({
        ...props,
        elementProps: {
          ...elementProps,
          onFocus: (event) => {
            elementProps.onFocus?.(event);
            valueOnFocus.current = value;
          },
          onBlur: (event) => {
            elementProps.onBlur?.(event);
            if (!documentId || value === valueOnFocus.current) return;
            valueOnFocus.current = value;
            if (value == null) {
              void client.patch(documentId).unset(["populationAsOf"]).commit();
            } else {
              void client
                .patch(documentId)
                .set({ populationAsOf: new Date().toISOString() })
                .commit();
            }
          },
        },
      })}
      <Text size={1} muted>
        Changing population sets “Population as of” to today automatically.
      </Text>
    </Stack>
  );
}
