/**
 * Team Members List Page
 */
import { GenericList } from "@/components/GenericList";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "role", label: "Rol" },
  { key: "order", label: "Orden" },
  { 
    key: "is_active", 
    label: "Activo",
    render: (row: any) => row.is_active ? "Sí" : "No"
  },
];

export function TeamMembersList() {
  return <GenericList resource="team_members" columns={columns} title="Equipo" />;
}
