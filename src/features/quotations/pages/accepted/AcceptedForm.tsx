import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mantine/core";

import {
  requestSchema,
  type RequestBody,
} from "../../schemas/acceptedForm.schema";
import {
  fetchAcceptedFormEnums,
  registerJobOrder,
} from "../../api/quotations.api";

import BillingInformation from "./components/BillingInformtation";
import ClientInformation from "./components/ClientInformation";
import CommitmentInformation from "./components/CommitmentInformation";
import Header from "./components/Header";
import JOInformation from "./components/JOInformation";
import ServiceInformation from "./components/ServiceInformation";
import ShipmentInformation from "./components/ShipmentInformation";
import ConfirmFormModal from "./components/ConfirmFormModal";
import SuccessFormModal from "./components/SuccessFormModal";

type AcceptedFormProps = {
  quotation_reference_number: string;
  job_type: string
};

export default function AcceptedForm({
  quotation_reference_number = "RQ-LOG-05262026-017",
  job_type = "LOGISTICS"
}: AcceptedFormProps) {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<RequestBody | null>(
    null,
  );

  const registerJobOrderMutation = useMutation({
    mutationFn: ({ requestBody }: { requestBody: RequestBody }) =>
      registerJobOrder(requestBody, job_type, quotation_reference_number),
    onSuccess: () => {
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true)
      setPendingFormData(null);
    },
    onError: () => {},
  });

  const { data: acceptedEnumsData } = useQuery({
    queryKey: ["accepted-form-enums", quotation_reference_number],
    queryFn: () => fetchAcceptedFormEnums(quotation_reference_number),
    enabled: Boolean(quotation_reference_number),
  });

  const methods = useForm<RequestBody>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      subject: {
        date: "",
        subject: "",
        email_body: "",
      },
      client: {
        client_type: "",
        accredited: "",
        remarks: "",
      },

      service: {
        service_level: "",
        bl_no: "",
        eta: "",
        etd: "",
      },

      shipment: {
        hs_code: "",
        rod: "",
        permits: "",
        if_coordinated: "",
        special_remarks: "",
      },

      target: {
        delivery_date: "",
        completion_date: "",
        special_remarks: "",
      },

      billing: {
        terms_of_payment: "",
        billing_date: "",
        shall_be_billed: "",
        listed_docs: "",
        attached_docs: [],
      },
    },
  });

  const onSubmit = (data: RequestBody) => {
    setPendingFormData(data);
    setIsConfirmModalOpen(true);
  };

  return (
    <>
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(onSubmit)}>
        <Header>
          <JOInformation />
          <ClientInformation enums={acceptedEnumsData} />
          <ServiceInformation enums={acceptedEnumsData} />
          <ShipmentInformation
            autofill_data={acceptedEnumsData?.autofill_details}
          />
          <CommitmentInformation />
          <BillingInformation enums={acceptedEnumsData} />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button type="submit" radius="md">
              Submit
            </Button>
          </div>
        </Header>
      </form>
    </FormProvider>
    <ConfirmFormModal
      opened={isConfirmModalOpen}
      onClose={() => setIsConfirmModalOpen(false)}
      onConfirm={() => {
        if (!pendingFormData) {
          return;
        }
        registerJobOrderMutation.mutate({ requestBody: pendingFormData });
      }}
      isLoading={registerJobOrderMutation.isPending}
    />
      <SuccessFormModal
      opened={isSuccessModalOpen}
      onClose={() => setIsSuccessModalOpen(false)}
    />
    </>
  );
}
