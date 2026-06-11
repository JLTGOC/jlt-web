import { Modal, TextInput, Select, Button, Group, Text, Flex } from "@mantine/core";
import { useState } from "react";
import { Notes } from "@nine-thirty-five/material-symbols-react/rounded";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Heading {
  id: number;
  name: string;
}

interface AddNewHeadingModalProps {
  opened: boolean;
  onClose: () => void;
  templateName?: string;
  onHeadingsChange?: (headings: Heading[]) => void;
}

// Sortable heading item component
function SortableHeadingItem({ heading }: { heading: Heading }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: heading.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    display: "flex" as const,
    alignItems: "center" as const,
    padding: "0.75rem 1rem",
    borderBottom: "1px solid #dee2e6",
    cursor: "grab" as const,
    backgroundColor: isDragging ? "#f0f0f0" : "#fff",
    userSelect: "none" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <span style={{ marginRight: "1rem", color: "#999" }}>⋮⋮</span>
      <Text size="sm">{heading.name}</Text>
    </div>
  );
}

export default function AddNewHeadingModal({
  opened,
  onClose,
  templateName,
  onHeadingsChange,
}: AddNewHeadingModalProps) {
  const [headings, setHeadings] = useState<Heading[]>([
    { id: 1, name: "PIC" },
    { id: 2, name: "Selling Cost" },
    { id: 3, name: "Forecasted Cost" },
    { id: 4, name: "Actual Cost" },
    { id: 5, name: "Timeline" },
    { id: 6, name: "Target Date and Time" },
    { id: 7, name: "Actual Date and Time" },
    { id: 8, name: "PIC Remarks" },
  ]);
  const [newHeadingName, setNewHeadingName] = useState("");
  const [newHeadingType, setNewHeadingType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = headings.findIndex((h) => h.id === active.id);
      const newIndex = headings.findIndex((h) => h.id === over.id);
      const newHeadings = arrayMove(headings, oldIndex, newIndex);
      setHeadings(newHeadings);
    }
  };

  const handleAddHeading = () => {
    if (!newHeadingName.trim() || !newHeadingType) {
      return;
    }

    const newHeading: Heading = {
      id: Math.max(...headings.map((h) => h.id), 0) + 1,
      name: newHeadingName,
    };

    setHeadings([...headings, newHeading]);
    setNewHeadingName("");
    setNewHeadingType(null);
  };

  const handleSaveChanges = () => {
    if (onHeadingsChange) {
      onHeadingsChange(headings);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Flex gap="xs" align="flex-start">
          <Notes style={{ width: 38, height: 38 }} color="#1D274E" />
          <div>
            <Text fw={700} size="lg" c="#1D274E">
              CUSTOMIZE HEADINGS
            </Text>
            <Text size="xs" c="grey" mt={-6} fw={400}>
              Select and arrange the headings to display in the list
            </Text>
          </div>
        </Flex>
      }
      size="xl"
      overlayProps={{
        color: "#1D274E",
        opacity: 0.7,
        blur: 3,
      }}
      styles={{
        header: { marginBottom: "1rem", backgroundColor: "#dbdbdb", marginLeft: "-1rem", marginRight: "-1rem", marginTop: "-1rem", paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "1rem", paddingBottom: "1rem" },
        title: { color: "#fff" },
        body: { overflow: "hidden" },
        content: { overflow: "hidden" },
      }}
    >
      <div style={{ padding: "1rem", overflow: "hidden" }}>
        <Text fw={600} mb="1rem" size="sm">
          {templateName || "Phase"} - Headings
        </Text>

        <Group mb="1.5rem" gap="sm">
          <TextInput
            placeholder="Heading Name"
            style={{ flex: 1 }}
            value={newHeadingName}
            onChange={(e) => setNewHeadingName(e.currentTarget.value)}
          />
          <Select
            placeholder="Select Input Type"
            data={["Text", "Number", "Date", "Dropdown"]}
            style={{ flex: 1 }}
            value={newHeadingType}
            onChange={setNewHeadingType}
          />
          <Button bg="#4E6174" size="sm" onClick={handleAddHeading}>
            ADD
          </Button>
        </Group>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div style={{ border: "1px solid #dee2e6", borderRadius: "0px", marginBottom: "1.5rem" }}>
            <SortableContext
              items={headings.map((h) => h.id)}
              strategy={verticalListSortingStrategy}
            >
              {headings.map((heading) => (
                <SortableHeadingItem
                  key={heading.id}
                  heading={heading}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>

        <Group justify="flex-end" gap="sm">
          <Button variant="outline" onClick={onClose}>
            CANCEL
          </Button>
          <Button bg="#4E6174" c="white" onClick={handleSaveChanges}>
            SAVE CHANGES
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
