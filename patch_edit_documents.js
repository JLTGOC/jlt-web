const fs = require("fs");
const path = "src/features/accounts/components/companies/CompanyInformation/EditDocuments.tsx";
let text = fs.readFileSync(path, "utf8");
const oldImport = `import { useState, useEffect, useRef } from "react";
import { Paper, Text, Box, Button, Group, TextInput } from "@mantine/core";
import { Add, Delete, Save } from "@nine-thirty-five/material-symbols-react/outlined";
import type {
  CompanyFullDetails,
  CompanyDocumentsAttachments,
} from "@/features/accounts/types/company.types";
`;
const newImport = `import { useState, useEffect, useRef } from "react";
import { Paper, Text, Box, Button, Group, TextInput } from "@mantine/core";
import { Add, Delete, Save } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import type {
  CompanyFullDetails,
  CompanyDocumentsAttachments,
} from "@/features/accounts/types/company.types";

type DocumentItem = {
  name: string;
  url?: string | null;
  file?: File;
};
`;
if (!text.includes(oldImport)) throw new Error('Old import block not found');
text = text.replace(oldImport, newImport);
const oldState = 'const [documents, setDocuments] = useState<Array<{ name: string; url?: string | null }>>([]);';
const newState = 'const [documents, setDocuments] = useState<DocumentItem[]>([]);';
if (!text.includes(oldState)) throw new Error('State line not found');
text = text.replace(oldState, newState);
const oldHandle = `  const handleFileSelect = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const nextDocuments = [
      ...documents,
      ...Array.from(files).map((file) => ({ name: file.name })),
    ];
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
  };
`;
const newHandle = `  const handleFileSelect = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const nextDocuments = [
      ...documents,
      ...Array.from(files).map((file) => ({ name: file.name, file })),
    ];
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
    notifications.show({
      title: 'Added ' + files.length + ' file' + (files.length === 1 ? '' : 's'),
      message: files.length + ' document(s) are ready to save',
      color: 'green',
      autoClose: 2500,
    });
  };
`;
if (!text.includes(oldHandle)) throw new Error('handleFileSelect block not found');
text = text.replace(oldHandle, newHandle);
const oldRemove = `  const handleRemove = (index: number) => {
    const nextDocuments = documents.filter((_, idx) => idx !== index);
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
  };
`;
const newRemove = `  const handleRemove = (index: number) => {
    const nextDocuments = documents.filter((_, idx) => idx !== index);
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
    notifications.show({
      title: 'Document removed',
      message: 'The selected document was removed.',
      color: 'yellow',
      autoClose: 2500,
    });
  };
`;
if (!text.includes(oldRemove)) throw new Error('handleRemove block not found');
text = text.replace(oldRemove, newRemove);
fs.writeFileSync(path, text, "utf8");
console.log('Updated EditDocuments.tsx');
