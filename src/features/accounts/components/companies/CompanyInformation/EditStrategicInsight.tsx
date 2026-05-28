// src/features/accounts/components/companies/CompanyInformation/EditStrategicInsight.tsx
import {
  Paper,
  Text,
  TextInput,
  Group,
  Combobox,
  InputBase,
  useCombobox,
} from "@mantine/core";
import { Check, CloseSmall } from "@nine-thirty-five/material-symbols-react/outlined";
import { useState, useEffect } from "react";
import type {
  CompanyFullDetails,
  CompanyStrategicInsight,
} from "@/features/accounts/types/company.types";

interface EditStrategicInsightProps {
  company: CompanyFullDetails | null;
  onChange?: (strategicInsight: CompanyStrategicInsight) => void;
}

interface FormData {
  growthOptions: string[];
  selectedGrowth: string;
  expansionPlan: string;
  competitorsUsed: string;
  upsellingOpportunities: string;
  notes: string;
}

const toStrategicInsight = (
  data: FormData
): CompanyStrategicInsight => ({
  growthOptions: data.growthOptions,
  keyInsights: data.notes || null,
  expansionPlan: data.expansionPlan || null,
  competitorsUsed: data.competitorsUsed || null,
  upsellingOpportunities: data.upsellingOpportunities || null,
  notes: data.notes || null,
});

export function EditStrategicInsight({ company, onChange }: EditStrategicInsightProps) {
  const [growthOptions, setGrowthOptions] = useState(["LOW", "MEDIUM", "HIGH"]);
  const [selectedGrowth, setSelectedGrowth] = useState<string>("");
  const [expansionPlan, setExpansionPlan] = useState("");
  const [competitorsUsed, setCompetitorsUsed] = useState("");
  const [upsellingOpportunities, setUpsellingOpportunities] = useState("");
  const [notes, setNotes] = useState("");
  const [customInput, setCustomInput] = useState("");
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  useEffect(() => {
    if (company?.strategicInsight) {
      const initialGrowth =
        company.strategicInsight.growthOptions?.[0] || "";
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGrowthOptions(company.strategicInsight.growthOptions || ["LOW", "MEDIUM", "HIGH"]);
      setSelectedGrowth(company.strategicInsight.growthOptions?.[0] || "");
      setExpansionPlan(company.strategicInsight.expansionPlan || "");
      setCompetitorsUsed(company.strategicInsight.competitorsUsed || "");
      setUpsellingOpportunities(company.strategicInsight.upsellingOpportunities || "");
      setNotes(company.strategicInsight.notes || "");
    }
  }, [company]);

  const emitChange = (next: FormData) => {
    onChange?.(toStrategicInsight(next));
  };

  const handleAddOption = () => {
    if (customInput.trim() && !growthOptions.includes(customInput.trim())) {
      const nextGrowthOptions = [...growthOptions, customInput.trim()];
      setGrowthOptions(nextGrowthOptions);
      setCustomInput("");
      emitChange({
        growthOptions: nextGrowthOptions,
        selectedGrowth,
        expansionPlan,
        competitorsUsed,
        upsellingOpportunities,
        notes,
      });
    }
  };

  const handleCancelInput = () => {
    setCustomInput("");
  };

  const options = growthOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  const handleFieldUpdate = (field: keyof FormData, value: string) => {
    if (field === "selectedGrowth") {
      setSelectedGrowth(value);
    }
    if (field === "expansionPlan") {
      setExpansionPlan(value);
    }
    if (field === "competitorsUsed") {
      setCompetitorsUsed(value);
    }
    if (field === "upsellingOpportunities") {
      setUpsellingOpportunities(value);
    }
    if (field === "notes") {
      setNotes(value);
    }

    emitChange({
      growthOptions,
      selectedGrowth: field === "selectedGrowth" ? value : selectedGrowth,
      expansionPlan: field === "expansionPlan" ? value : expansionPlan,
      competitorsUsed: field === "competitorsUsed" ? value : competitorsUsed,
      upsellingOpportunities:
        field === "upsellingOpportunities" ? value : upsellingOpportunities,
      notes: field === "notes" ? value : notes,
    });
  };

  return (
    <Paper p="lg">
      <Group grow mb="sm">
        <div>
          <Text size="sm" fw={500}>Growth</Text>
          <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
              setSelectedGrowth(val);
              combobox.closeDropdown();
              emitChange({
                growthOptions,
                selectedGrowth: val,
                expansionPlan,
                competitorsUsed,
                upsellingOpportunities,
                notes,
              });
            }}
          >
            <Combobox.Target>
              <InputBase
                component="button"
                type="button"
                pointer
                rightSection={<Combobox.Chevron />}
                onClick={() => combobox.toggleDropdown()}
                rightSectionPointerEvents="none"
              >
                {selectedGrowth || "Select growth level"}
              </InputBase>
            </Combobox.Target>
            <Combobox.Dropdown>
              <Combobox.Options>
                {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
              </Combobox.Options>
              <Combobox.Footer>
                <Group gap="xs" p="xs" align="center">
                  <TextInput
                    placeholder="TYPE IF OTHERS"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.currentTarget.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddOption();
                      }
                    }}
                    style={{ flex: 1 }}
                    size="xs"
                  />
                  <Check
                    width={24}
                    height={24}
                    style={{ color: "#00960A", cursor: "pointer" }}
                    onClick={handleAddOption}
                  />
                  <CloseSmall
                    width={24}
                    height={24}
                    style={{ color: "#FF0000", cursor: "pointer" }}
                    onClick={handleCancelInput}
                  />
                </Group>
              </Combobox.Footer>
            </Combobox.Dropdown>
          </Combobox>
        </div>
        <div>
          <Text size="sm" fw={500}>Expansion Plan</Text>
          <TextInput
            placeholder="Enter expansion plan"
            value={expansionPlan}
            onChange={(e) => handleFieldUpdate("expansionPlan", e.currentTarget.value)}
          />
        </div>
      </Group>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Competitors They Used</Text>
        <TextInput
          placeholder="Enter competitors"
          value={competitorsUsed}
          onChange={(e) => handleFieldUpdate("competitorsUsed", e.currentTarget.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Opportunities For Upselling</Text>
        <TextInput
          placeholder="Enter upselling opportunities"
          value={upsellingOpportunities}
          onChange={(e) => handleFieldUpdate("upsellingOpportunities", e.currentTarget.value)}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <Text size="sm" fw={500}>Notes / Remarks / Reports</Text>
        <TextInput
          placeholder="Enter notes, remarks, or reports"
          value={notes}
          onChange={(e) => handleFieldUpdate("notes", e.currentTarget.value)}
          styles={{
            input: {
              minHeight: "6rem",
            },
          }}
        />
      </div>
    </Paper>
  );
}
