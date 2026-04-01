import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
  title?: string;
  description?: string;
  actionText?: string;
}

const DeleteConfirmDialog = ({ 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  itemName,
  title = "¿Estás completamente seguro?",
  description = "Esta acción no se puede deshacer. Se eliminará permanentemente de tu perfil.",
  actionText = "Eliminar"
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm">
            {description} {itemName && <span className="font-bold text-foreground">"{itemName}"</span>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="rounded-xl font-bold border-border">Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
