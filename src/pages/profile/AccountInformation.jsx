import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, User, Building } from 'lucide-react';
import { CountryComboBox } from '@/components/CountryComboBox';
import { countries } from '@/data/countries';

const AccountInformation = () => {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const initialFormState = useMemo(() => ({
    accountType: 'individual',
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    idDocumentNumber: '',
    residentialAddress: '',
    residentialCountry: '',
    phoneNumber: '',
    companyName: '',
    businessName: '',
    countryOfIncorporation: '',
    taxId: '',
    dateOfIncorporation: '',
    legalAddress: '',
    businessAddress: '',
    corporatePhone: '',
    corporateEmail: '',
  }), []);

  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    if (profile) {
      const fullAddress = profile.residential_address || '';
      const countryMatch = countries.find(c => fullAddress.toLowerCase().includes(c.label.toLowerCase()));
      
      let resAddress = fullAddress;
      let resCountry = '';

      if (countryMatch) {
        resCountry = countryMatch.value;
        resAddress = fullAddress.replace(new RegExp(`,? ${countryMatch.label}`, 'i'), '').trim();
      }

      setFormState({
        accountType: profile.account_type || 'individual',
        fullName: profile.full_name || '',
        dateOfBirth: profile.date_of_birth || '',
        nationality: profile.nationality || '',
        idDocumentNumber: profile.id_document_number || '',
        residentialAddress: resAddress,
        residentialCountry: resCountry,
        phoneNumber: profile.phone_number || '',
        companyName: profile.company_name || '',
        businessName: profile.business_name || '',
        countryOfIncorporation: profile.country_of_incorporation || '',
        taxId: profile.tax_id || '',
        dateOfIncorporation: profile.date_of_incorporation || '',
        legalAddress: profile.legal_address || '',
        businessAddress: profile.business_address || '',
        corporatePhone: profile.corporate_phone || '',
        corporateEmail: profile.corporate_email || '',
      });
    } else {
      setFormState(initialFormState);
    }
  }, [profile, initialFormState]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState(prevState => ({ ...prevState, [id]: value }));
  };

  const handleCountryChange = (field, value) => {
    setFormState(prevState => ({ ...prevState, [field]: value }));
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setLoading(true);

    const countryLabel = countries.find(c => c.value === formState.residentialCountry)?.label || '';
    const fullResidentialAddress = [formState.residentialAddress.trim(), countryLabel].filter(Boolean).join(', ');

    const updates = {
      id: user.id,
      account_type: formState.accountType,
      updated_at: new Date()
    };
    if (formState.accountType === 'individual') {
      Object.assign(updates, {
        full_name: formState.fullName,
        date_of_birth: formState.dateOfBirth,
        nationality: formState.nationality,
        id_document_number: formState.idDocumentNumber,
        residential_address: fullResidentialAddress,
        phone_number: formState.phoneNumber
      });
    } else {
       const incorporationCountryLabel = countries.find(c => c.value === formState.countryOfIncorporation)?.label || '';
      Object.assign(updates, {
        full_name: formState.fullName,
        company_name: formState.companyName,
        business_name: formState.businessName,
        country_of_incorporation: incorporationCountryLabel,
        tax_id: formState.taxId,
        date_of_incorporation: formState.dateOfIncorporation,
        legal_address: formState.legalAddress,
        business_address: formState.businessAddress,
        corporate_phone: formState.corporatePhone,
        corporate_email: formState.corporateEmail
      });
    }
    const {
      error
    } = await supabase.from('profiles').upsert(updates);
    if (error) {
      toast({
        variant: "destructive",
        title: 'Error al actualizar el perfil',
        description: error.message
      });
    } else {
      toast({
        title: 'Perfil Actualizado',
        description: 'La información de tu cuenta ha sido actualizada con éxito.'
      });
      await refreshProfile();
    }
    setLoading(false);
  };

  if (authLoading && !profile) {
    return <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }

  const IndividualForm = () => <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Identificación Personal</h3>
      <div>
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input id="fullName" value={formState.fullName} onChange={handleInputChange} className="mt-1" />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
            <Input id="dateOfBirth" type="date" value={formState.dateOfBirth || ''} onChange={handleInputChange} className="mt-1" />
        </div>
        <div>
            <Label htmlFor="nationality">Nacionalidad</Label>
            <CountryComboBox 
              value={formState.nationality}
              onChange={(value) => handleCountryChange('nationality', value)}
              placeholder="Selecciona una nacionalidad..."
            />
        </div>
      </div>
      <div>
        <Label htmlFor="idDocumentNumber">RUT / Número de Pasaporte</Label>
        <Input id="idDocumentNumber" value={formState.idDocumentNumber} onChange={handleInputChange} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="residentialAddress">Dirección</Label>
        <Input id="residentialAddress" placeholder="Calle, número, ciudad, etc." value={formState.residentialAddress} onChange={handleInputChange} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="residentialCountry">País de Residencia</Label>
        <CountryComboBox 
            value={formState.residentialCountry}
            onChange={(value) => handleCountryChange('residentialCountry', value)}
            placeholder="Selecciona un país..."
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Teléfono de Contacto</Label>
        <Input id="phoneNumber" type="tel" value={formState.phoneNumber} onChange={handleInputChange} className="mt-1" />
      </div>
    </div>;

  const InstitutionalForm = () => <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Información de la Empresa</h3>
      <div>
        <Label htmlFor="companyName">Nombre de la Empresa</Label>
        <Input id="companyName" value={formState.companyName} onChange={handleInputChange} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="businessName">Razón Social</Label>
        <Input id="businessName" value={formState.businessName} onChange={handleInputChange} className="mt-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="countryOfIncorporation">País de Constitución</Label>
          <CountryComboBox
             value={formState.countryOfIncorporation}
             onChange={(value) => handleCountryChange('countryOfIncorporation', value)}
             placeholder="Selecciona un país..."
          />
        </div>
        <div>
          <Label htmlFor="taxId">RUT</Label>
          <Input id="taxId" value={formState.taxId} onChange={handleInputChange} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="dateOfIncorporation">Fecha de Constitución</Label>
        <Input id="dateOfIncorporation" type="date" value={formState.dateOfIncorporation || ''} onChange={handleInputChange} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="legalAddress">Dirección Legal</Label>
        <Input id="legalAddress" value={formState.legalAddress} onChange={handleInputChange} className="mt-1" />
      </div>
       <div>
        <Label htmlFor="businessAddress">Dirección Comercial</Label>
        <Input id="businessAddress" value={formState.businessAddress} onChange={handleInputChange} className="mt-1" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 border-b pt-4 pb-2">Información de Contacto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="fullName">Nombre Completo del Contacto</Label>
            <Input id="fullName" value={formState.fullName} onChange={handleInputChange} className="mt-1" />
        </div>
        <div>
            <Label htmlFor="corporatePhone">Teléfono de Contacto</Label>
            <Input id="corporatePhone" type="tel" value={formState.corporatePhone} onChange={handleInputChange} className="mt-1" />
        </div>
      </div>
       <div>
            <Label htmlFor="corporateEmail">Email Corporativo</Label>
            <Input id="corporateEmail" type="email" value={formState.corporateEmail} onChange={handleInputChange} className="mt-1" />
        </div>
    </div>;

  return <Card className="glass-effect">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Información de la Cuenta</CardTitle>
                <CardDescription>Actualiza tus datos personales o institucionales aquí. Esta información es necesaria para la verificación.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpdateProfile} className="space-y-8">
          <div>
            <Label htmlFor="email">Dirección de Email Verificada</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled className="mt-1" />
          </div>

          <div>
            <Label>Tipo de Cuenta</Label>
            <RadioGroup value={formState.accountType} onValueChange={(value) => setFormState(prev => ({...prev, accountType: value}))} className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label htmlFor="individual" className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${formState.accountType === 'individual' ? 'border-primary' : 'border-muted'}`}>
                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                <User className="mb-3 h-6 w-6" />
                Individual
              </Label>
              <Label htmlFor="institutional" className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${formState.accountType === 'institutional' ? 'border-primary' : 'border-muted'}`}>
                <RadioGroupItem value="institutional" id="institutional" className="sr-only" />
                <Building className="mb-3 h-6 w-6" />
                Institucional
              </Label>
            </RadioGroup>
          </div>
          
          <div className="space-y-6 pt-4 border-t">
            {formState.accountType === 'individual' ? <IndividualForm /> : <InstitutionalForm />}
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>;
};
export default AccountInformation;