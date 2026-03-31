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
  title?: string;
  description?: string;
  itemName?: string;
  actionText?: string;
}

const DeleteConfirmDialog = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "¿Estás seguro?",
  description = "Esta acción no se puede deshacer. Se eliminará permanentemente este elemento.",
  itemName,
  actionText = "Eliminar"
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl w-[90vw] max-w-md border-border font-body">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-left">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            {description}
            {itemName && (
              <>
                {" "}Se eliminará permanentemente <span className="font-bold text-foreground">"{itemName}"</span>.
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogCancel className="rounded-xl font-bold mt-0">
            Cancelar
          </AlertDialogCancel>
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
