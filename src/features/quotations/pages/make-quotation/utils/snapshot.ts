import type { MakeQuotationSnapshot } from "../types/make-quotation.types";

function normalizeSnapshot(snapshot: MakeQuotationSnapshot) {
  return {
    ...snapshot,
    signatory: snapshot.signatory
      ? {
          complementary_close: snapshot.signatory.complementary_close,
          is_authorized_signatory: snapshot.signatory.is_authorized_signatory,
          authorized_signatory_name:
            snapshot.signatory.authorized_signatory_name,
          position_title: snapshot.signatory.position_title,
          signature_file_url: snapshot.signatory.signature_file_url ?? null,
          signature_file: snapshot.signatory.signature_file
            ? {
                name: snapshot.signatory.signature_file.name,
                size: snapshot.signatory.signature_file.size,
                type: snapshot.signatory.signature_file.type,
              }
            : null,
        }
      : null,
    documentValues: snapshot.documentValues
      ? {
          checklistFiles: Object.fromEntries(
            Object.entries(snapshot.documentValues.checklistFiles).map(
              ([key, file]) => [key, { name: file.name, size: file.size }],
            ),
          ),
          otherFiles: snapshot.documentValues.otherFiles.map((file) => ({
            name: file.name,
            size: file.size,
          })),
        }
      : null,
  };
}

export function snapshotsEqual(
  a: MakeQuotationSnapshot,
  b: MakeQuotationSnapshot,
) {
  return (
    JSON.stringify(normalizeSnapshot(a)) ===
    JSON.stringify(normalizeSnapshot(b))
  );
}
