import {  useMatch } from "react-router";

import TemplateList from "@/features/task/pages/TemplateList";

export default function TasksPage(){

    const templateListMatch = useMatch("/tasks/template")

    if(templateListMatch) return <TemplateList/>
}