import {
  ActionIcon,
  Combobox,
  Group,
  InputBase,
  Text,
  TextInput,
  useCombobox,
} from "@mantine/core";
import {
  Check,
  Close,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useState } from "react";
import classes from "../BillingDetailsForm.module.css";

interface ReceiptChargeFieldProps {
  value?: string;
  availableCharges: string[];
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  readOnly?: boolean;
}

export function ReceiptChargeField({
  value,
  availableCharges,
  onChange,
  onBlur,
  error,
  readOnly,
}: ReceiptChargeFieldProps) {
  const [isCustomEditing, setIsCustomEditing] = useState(false);
  const [customDraft, setCustomDraft] = useState("");

  const combobox = useCombobox({
    onDropdownClose: () => {
      setIsCustomEditing(false);
    },
  });

  const currentValue = value ?? "";
  const hasPresetValue = currentValue
    ? availableCharges.includes(currentValue)
    : false;

  function openCustomEditor() {
    setCustomDraft(hasPresetValue ? "" : currentValue);
    setIsCustomEditing(true);
    combobox.openDropdown();
  }

  function confirmCustomValue() {
    const nextValue = customDraft.trim();
    if (!nextValue) {
      return;
    }
    onChange(nextValue);
    setIsCustomEditing(false);
    setCustomDraft("");
    combobox.closeDropdown();
  }

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      offset={0}
      position="bottom-start"
      onOptionSubmit={(selectedValue) => {
        if (readOnly) {
          combobox.closeDropdown();
          return;
        }
        onChange(selectedValue);
        setIsCustomEditing(false);
        setCustomDraft("");
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          onClick={() => combobox.toggleDropdown()}
          onBlur={onBlur}
          rightSection={<Combobox.Chevron size="0.875rem" />}
          error={error}
          styles={{
            input: {
              width: "100%",
              border: 0,
              borderRadius: 0,
              background: "transparent",
              minHeight: "2.875rem",
              height: "2.875rem",
              color: "var(--mantine-color-jltBlue-8)",
              fontWeight: 500,
              fontSize: "0.8125rem",
              textAlign: "left",
              padding: "0 2rem 0 0.75rem",
            },
            section: {
              color: "#9aa0a8",
            },
          }}
        >
          {currentValue ? (
            <Text className={classes.receiptFieldValue}>{currentValue}</Text>
          ) : (
            <Text className={classes.receiptFieldPlaceholder}>
              SELECT RECEIPT CHARGES
            </Text>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown className={classes.receiptDropdown}>
        <Combobox.Options className={classes.receiptOptions}>
          {availableCharges.map((charge) => (
            <Combobox.Option
              key={charge}
              value={charge}
              className={classes.receiptComboboxOption}
              disabled={readOnly}
            >
              <Text
                className={`${classes.receiptOptionLabel} ${classes.receiptOptionRow}`}
              >
                {charge}
              </Text>
            </Combobox.Option>
          ))}
        </Combobox.Options>

        {!isCustomEditing ? (
          <button
            type="button"
            className={`${classes.customOptionLabel} ${classes.customOptionRow} ${classes.customOptionTrigger}`}
            onClick={readOnly ? undefined : openCustomEditor}
            disabled={readOnly}
          >
            Input other charges
          </button>
        ) : (
          <div
            className={`${classes.customOptionEditor} ${classes.customOptionRow}`}
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <TextInput
              value={customDraft}
              onChange={(event) => setCustomDraft(event.currentTarget.value)}
              placeholder="Input other charges"
              className={classes.customOptionInput}
              autoFocus
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  confirmCustomValue();
                }
              }}
            />
            <Group gap={2}>
              <ActionIcon
                variant="subtle"
                color="green"
                size="sm"
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  confirmCustomValue();
                }}
                aria-label="Confirm custom charge"
              >
                <Check width="1rem" height="1rem" />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                size="sm"
                onMouseDown={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setCustomDraft("");
                }}
                aria-label="Clear custom charge input"
              >
                <Close width="1rem" height="1rem" />
              </ActionIcon>
            </Group>
          </div>
        )}
      </Combobox.Dropdown>
    </Combobox>
  );
}
