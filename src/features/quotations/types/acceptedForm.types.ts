export type AcceptedFormEnumsResponse = {
  autofill_details: {
    company_name: string;
    full_name: string;
    commodity: string;
    cargo_type: string;
    container_size: string;
  };
  job_types: ["LOGISTICS", "REGULATORY"];
  accredited: ["REGULAR","EXPEDITED"];
  client_types:["NEW","RENEWAL"],
  service_levels: [
      "CARGO CONSOLIDATION (CC)",
      "CARGO CONSOLIDATION (CC), DIRECT EXPORT (DE)",
      "DIRECT EXPORT (DE)",
      "INTERNATIONAL FREIGHT FORWARDING (IFF)",
      "INTERNATIONAL FREIGHT FORWARDING (IFF), CARGO CONSOLIDATION (CC)",
      "INTERNATIONAL FREIGHT FORWARDING (IFF), CARGO CONSOLIDATION (CC), DIRECT EXPORT (DE)"
    ],
    shall_be_billed: [
      "AS PER QUOTE",
      "AS PER RECEIPT",
      "CARGO CONSOLIDATION (CC), DIRECT EXPORT (DE)",
      "THIRD-PARTY RECEIPTED CHARGES ADVANCES, DEBIT NOTE, CHARGES UPON DELIVERY",
      "UPON SERVICE RENDERED (COD)"
    ]
};
