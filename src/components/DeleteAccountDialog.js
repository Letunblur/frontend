import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient'; // ⬅️ Hier wird der Supabase-Client importiert
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'; // falls du Dialog-Komponenten verwendest

const DeleteAccountDialog = ({ isOpen, onOpenChange }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth(); // ⬅️ Auth-Context (bleibt wie gehabt)

  const handleDelete = async () => {
    if (!user) {
      toast.error('Du bist nicht eingeloggt.');
      return;
    }

    try {
      setIsDeleting(true);

      const deletionData = {
        userId: user.id,
        email: user.email,
        deletedAt: new Date().toISOString(),
      };

      const { error } = await supabase.functions.invoke("send-user-deletion-notification", {
        body: deletionData,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (error) {
        console.error("❌ Fehler beim Senden der E-Mail:", error);
        toast.error("Fehler beim Versenden der Löschbenachrichtigung.");
        return;
      }

      toast.success("✅ Deine Löschanfrage wurde abgeschickt. Du bekommst bald eine Bestätigungsmail.");
      onOpenChange(false); // Dialog schließen
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      toast.error('❌ Fehler beim Löschen.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konto löschen</DialogTitle>
          <DialogDescription>
            Bist du sicher, dass du dein Konto löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden und alle deine Daten werden dauerhaft entfernt.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>Abbrechen</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-[#e11d48] hover:bg-[#be123c]"
          >
            {isDeleting ? "Wird gelöscht..." : "Konto löschen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
