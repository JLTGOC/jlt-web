import {  useMatch } from "react-router";

import TemplateList from "@/features/task/pages/TemplateList";
import TemplateDetails from "@/features/task/pages/TemplateDetails";

export default function TasksPage(){

    const templateListMatch = useMatch("/tasks/template")
    const templateDetailsMatch = useMatch("/tasks/template/:id/details")

    if(templateListMatch) return <TemplateList/>
    if(templateDetailsMatch) return <TemplateDetails/>
}