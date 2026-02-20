/**
 * Company Values List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "title", label: "Título" },
  { key: "description", label: "Descripción" },
  { key: "order", label: "Orden" },
];

export function CompanyValuesList() {
  return <GenericList resource="company_values" columns={columns} title="Valores de la Empresa" />;
}
