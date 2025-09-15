import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Landmark, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const chileanBanks = [
  "Banco de Chile / Edwards Citi",
  "Banco Internacional",
  "Scotiabank Chile",
  "Banco de Crédito e Inversiones (BCI)",
  "Banco Bice",
  "HSBC Bank (Chile)",
  "Banco Santander-Chile",
  "Itaú Corpbanca",
  "Banco Security",
  "Banco Falabella",
  "Banco Ripley",
  "Banco Consorcio",
  "Deutsche Bank (Chile)",
  "BNP Paribas",
  "Banco BTG Pactual Chile",
  "BancoEstado",
];

const BankAccount = () => {
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [bankInfo, setBankInfo] = useState({
    bank_name: '',
    account_holder_name: '',
    bank_account_number: '',
    bank_account_type: '',
    rut: '',
  });
  const [walletInfo, setWalletInfo] = useState({
    wallet_address: '',
    stablecoin: '',
  });

  useEffect(() => {
    if (profile) {
      setWithdrawalMethod(profile.withdrawal_method || 'bank');
      setBankInfo({
        bank_name: profile.bank_name || '',
        account_holder_name: profile.account_holder_name || '',
        bank_account_number: profile.bank_account_number || '',
        bank_account_type: profile.bank_account_type || '',
        rut: profile.rut || '',
      });
      setWalletInfo({
        wallet_address: profile.wallet_address || '',
        stablecoin: profile.stablecoin || '',
      });
      setLoading(false);
    }
  }, [profile]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (withdrawalMethod === 'bank') {
      setBankInfo((prev) => ({ ...prev, [id]: value }));
    } else {
      setWalletInfo((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (id, value) => {
    if (withdrawalMethod === 'bank') {
      setBankInfo((prev) => ({ ...prev, [id]: value }));
    } else {
      setWalletInfo((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    const updates = {
      withdrawal_method: withdrawalMethod,
      ...bankInfo,
      ...walletInfo,
    };

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) {
      console.error('Error al actualizar la información de retiro:', error);
      toast({
        title: 'Error al Guardar',
        description: 'Hubo un problema al actualizar tu información de retiro.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: '¡Éxito!',
        description: 'Tu información de retiro ha sido actualizada.',
      });
      await refreshProfile();
    }
    setSaving(false);
  };

  const BankForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="bank_name">Nombre del Banco</Label>
        <Select value={bankInfo.bank_name} onValueChange={(value) => handleSelectChange('bank_name', value)} disabled={saving}>
          <SelectTrigger id="bank_name">
            <SelectValue placeholder="Selecciona un banco" />
          </SelectTrigger>
          <SelectContent>
            {chileanBanks.map((bank) => (
              <SelectItem key={bank} value={bank}>{bank}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="account_holder_name">Nombre del Titular</Label>
        <Input id="account_holder_name" value={bankInfo.account_holder_name} onChange={handleChange} placeholder="Ej: Juan Pérez" disabled={saving} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rut">RUT</Label>
        <Input id="rut" value={bankInfo.rut} onChange={handleChange} placeholder="Ej: 12.345.678-9" disabled={saving} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bank_account_number">Número de Cuenta</Label>
        <Input id="bank_account_number" value={bankInfo.bank_account_number} onChange={handleChange} placeholder="Ej: 1234567890" disabled={saving} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bank_account_type">Tipo de Cuenta</Label>
        <Select value={bankInfo.bank_account_type} onValueChange={(value) => handleSelectChange('bank_account_type', value)} disabled={saving}>
          <SelectTrigger id="bank_account_type">
            <SelectValue placeholder="Selecciona un tipo de cuenta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="corriente">Cuenta Corriente</SelectItem>
            <SelectItem value="vista">Cuenta Vista</SelectItem>
            <SelectItem value="ahorro">Cuenta de Ahorro</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const WalletForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="wallet_address">Dirección de Billetera (Wallet)</Label>
        <Input id="wallet_address" value={walletInfo.wallet_address} onChange={handleChange} placeholder="0x..." disabled={saving} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="stablecoin">Stablecoin</Label>
        <Select value={walletInfo.stablecoin} onValueChange={(value) => handleSelectChange('stablecoin', value)} disabled={saving}>
          <SelectTrigger id="stablecoin">
            <SelectValue placeholder="Selecciona una stablecoin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USDC">USDC</SelectItem>
            <SelectItem value="USDT">USDT</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <form onSubmit={handleSubmit}>
        <Card className="glass-effect">
          <CardHeader>
            <CardTitle>Cuenta para Retiros</CardTitle>
            <CardDescription>
              Agrega tu método de retiro preferido para poder retirar fondos de la plataforma de forma segura.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <Label>Método de Retiro</Label>
              <RadioGroup value={withdrawalMethod} onValueChange={setWithdrawalMethod} className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Label htmlFor="bank" className={`flex items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${withdrawalMethod === 'bank' ? 'border-primary' : 'border-muted'}`}>
                  <RadioGroupItem value="bank" id="bank" className="sr-only" />
                  <Landmark className="mr-3 h-5 w-5" />
                  Cuenta Bancaria (CL)
                </Label>
                <Label htmlFor="wallet" className={`flex items-center justify-center rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${withdrawalMethod === 'wallet' ? 'border-primary' : 'border-muted'}`}>
                  <RadioGroupItem value="wallet" id="wallet" className="sr-only" />
                  <Wallet className="mr-3 h-5 w-5" />
                  Billetera Digital (Wallet)
                </Label>
              </RadioGroup>
            </div>
            
            <div className="pt-6 border-t">
              {withdrawalMethod === 'bank' ? <BankForm /> : <WalletForm />}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </motion.div>
  );
};

export default BankAccount;