/**
 * Stats List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "page_slug", label: "Página" },
  { key: "value", label: "Valor" },
  { key: "label", label: "Etiqueta" },
];

export function StatsList() {
  return <GenericList resource="stats" columns={columns} title="Estadísticas" />;
}
