/**
 * Process Steps List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "page_slug", label: "Página" },
  { key: "title", label: "Título" },
  { key: "number", label: "Número" },
];

export function ProcessStepsList() {
  return <GenericList resource="process_steps" columns={columns} title="Pasos del Proceso" />;
}
