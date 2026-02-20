/**
 * ResourceList - Generic table component for Refine
 * 
 * Displays a list of resources with columns, sorting, and actions.
 */

import { 
  useNavigation,
  useDelete,
} from "@refinedev/core";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Pencil, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  Plus
} from "lucide-react";
import { useState } from "react";

// Column definition
export interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

// Component props
interface ResourceListProps<T> {
  resource: string;
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  onCreate?: () => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  onDelete?: (id: string) => void;
  // Refine props
  filters?: any[];
  sorters?: any[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
  };
}

/**
 * Generic ResourceList component
 */
export function ResourceList<T extends { _id: string | number }>({
  resource,
  columns,
  data,
  isLoading,
  onCreate,
  pagination,
}: ResourceListProps<T>) {
  const { edit, show } = useNavigation();
  const { mutate: deleteMutate } = useDelete();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = pagination?.pageSize || 10;

  // Handle pagination
  const totalPages = pagination ? Math.ceil(pagination.total / pageSize) : 1;

  // Handle delete
  const handleDelete = (id: string | number) => {
    if (confirm("¿Estás seguro de eliminar este registro?")) {
      deleteMutate({
        resource,
        id: String(id),
      });
    }
  };

  // Get cell value
  const getCellValue = (row: T, column: ColumnDef<T>) => {
    if (column.cell) {
      return column.cell(row);
    }
    if (typeof column.accessorKey === "function") {
      return column.accessorKey(row);
    }
    return row[column.accessorKey as keyof T];
  };

  return (
    <div className="space-y-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold capitalize">{resource}</h2>
        {onCreate && (
          <Button onClick={onCreate} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Crear
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="font-semibold">
                  {column.header}
                </TableHead>
              ))}
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2">Cargando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center py-8 text-gray-500">
                  No hay registros
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row._id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {getCellValue(row, column)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {show && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => show(resource, String(row._id))}
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      )}
                      {edit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => edit(resource, String(row._id))}
                          title="Editar"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(row._id)}
                        title="Eliminar"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, pagination.total)} de {pagination.total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
