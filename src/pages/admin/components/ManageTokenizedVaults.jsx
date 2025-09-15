import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlusCircle, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import CreateVaultWizard from '@/pages/admin/components/CreateVaultWizard';

const ManageTokenizedVaults = () => {
  const [vaults, setVaults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchVaults = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('tokenized_vaults')
      .select(`
        id,
        name,
        manager,
        asset_type,
        created_at,
        digital_assets ( symbol )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Error fetching vaults', description: error.message, variant: 'destructive' });
    } else {
      setVaults(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchVaults();
  }, [user]);

  const handleVaultCreated = () => {
    setIsDialogOpen(false);
    fetchVaults();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Manage Tokenized Vaults</CardTitle>
            <CardDescription>Create and manage tokenized investment vaults.</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Create New Vault</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl">
              <DialogHeader>
                <DialogTitle>Tokenized Vault Creation Wizard</DialogTitle>
                <DialogDescription>A step-by-step guide to create and tokenize a new investment vault.</DialogDescription>
              </DialogHeader>
              <CreateVaultWizard onVaultCreated={handleVaultCreated} />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vault Name</TableHead>
              <TableHead>Token Symbol</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Asset Type</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan="6" className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto"/></TableCell></TableRow>
            ) : vaults.length > 0 ? (
              vaults.map(vault => (
                <TableRow key={vault.id}>
                  <TableCell className="font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4 text-primary" /> {vault.name}
                  </TableCell>
                  <TableCell>{vault.digital_assets?.symbol || 'N/A'}</TableCell>
                  <TableCell>{vault.manager}</TableCell>
                  <TableCell>{vault.asset_type}</TableCell>
                  <TableCell>{new Date(vault.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/administracion/fondos/${vault.id}`}>
                        View Details <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow><TableCell colSpan="6" className="text-center h-24">No vaults found. Create one to get started!</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManageTokenizedVaults;