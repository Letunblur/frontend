import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';  // Stelle sicher, dass du den richtigen Button importierst
import DeleteAccountDialog from '@/components/components/DeleteAccountDialog';  // Den Dialog korrekt importieren
import { useAuth } from '@/contexts/AuthContext';  // AuthContext für die Benutzerinformation

const AccountPage = () => {
  const { user } = useAuth();  // Zugriff auf den aktuell angemeldeten Benutzer
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Steuert das Öffnen des Dialogs
  
  useEffect(() => {
    if (!user) {
      // Hier kannst du noch eine benutzerfreundliche Nachricht anzeigen, falls der User nicht eingeloggt ist
    }
  }, [user]);

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Account-Daten und Einstellungen */}
        <div className="w-full md:w-64">
          <div className="space-y-1">
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)} 
              className="w-full justify-start"
            >
              Konto löschen
            </Button>
          </div>
        </div>

        {/* DeleteAccountDialog */}
        <DeleteAccountDialog 
          isOpen={isDeleteDialogOpen} 
          onOpenChange={setIsDeleteDialogOpen}
        />
      </div>
    </div>
  );
};

export default AccountPage;
