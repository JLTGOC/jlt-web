import { Button } from "@mantine/core";
import { PageCard } from "@/components/PageCard";
import {
  Save
} from "@nine-thirty-five/material-symbols-react/rounded";

export default function Index() {
  return (
    <>
    
    <PageCard
      hideBackButton
      showDivider
      title="planning & timeline"
      action={<Button leftSection={<Save/>} color="#4E6174">Save</Button>}
    ></PageCard></>
  );
}
