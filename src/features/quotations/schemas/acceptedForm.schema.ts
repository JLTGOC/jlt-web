import { z } from "zod";

const fileSchema = z.custom<File>((value) => {
  if (typeof File === "undefined") {
    return true;
  }
  return value instanceof File;
});

export type RequestBody = z.infer<typeof requestSchema>;

export const requestSchema = z.object({
  subject: z.object({
    date: z.string().min(8, "Date is Required").max(10, "Date invalid"),

    subject: z.string().min(1, "Subject is required"),

    email_body: z.string().min(1, "Message is required"),
  }),

  client: z.object({
    // consignee: z.string(),

    client_type: z.string().min(1, "Client Type is required"),

    accredited: z.string().min(1, "Accredited is required"),

    // shipper: z.string(),

    remarks: z.string(),
  }),

  service: z.object({
    service_level: z.string().min(1, "Service Level is required"),

    bl_no: z.string().min(1, "BL Number is required"),

    eta: z.string().min(1, "ETA is required"),

    etd: z.string().min(1, "ETD is required"),
  }),

  shipment: z.object({
    // commodity: z.string(),

    // volume_dimension: z.string(),

    hs_code: z.string(),

    rod: z.string(),

    permits: z.string(),

    if_coordinated: z.string(),

    special_remarks: z.string(),
  }),

  target: z.object({
    delivery_date: z.string(),

    completion_date: z.string(),

    special_remarks: z.string(),
  }),

  billing: z.object({
    terms_of_payment: z.string(),

    billing_date: z.string(),

    shall_be_billed: z.string().min(1, "This field is Required"),

    listed_docs: z.string(),

    attached_docs: z.array(fileSchema),
  }),
});
