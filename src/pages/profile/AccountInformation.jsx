
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, User, Building, TrendingUp, Shield, BarChart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { CountryComboBox } from '@/components/CountryComboBox';
import { countries } from '@/data/countries';

const AccountInformation = () => {
  const {
    user,
    profile,
    loading: authLoading,
    refreshProfile
  } = useAuth();
  const {
    toast
  } = useToast();
  const [loading, setLoading] = useState(false);
  const [accountType, setAccountType] = useState('individual');
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [idDocumentNumber, setIdDocumentNumber] = useState('');
  const [residentialAddress, setResidentialAddress] = useState('');
  const [residentialCountry, setResidentialCountry] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [countryOfIncorporation, setCountryOfIncorporation] = useState('');
  const [taxId, setTaxId] = useState('');
  const [dateOfIncorporation, setDateOfIncorporation] = useState('');
  const [legalAddress, setLegalAddress] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [corporatePhone, setCorporatePhone] = useState('');
  const [corporateEmail, setCorporateEmail] = useState('');

  useEffect(() => {
    if (profile) {
      setAccountType(profile.account_type || 'individual');
      setFullName(profile.full_name || '');
      setDateOfBirth(profile.date_of_birth || '');
      setNationality(profile.nationality || '');
      setIdDocumentNumber(profile.id_document_number || '');
      
      const fullAddress = profile.residential_address || '';
      const countryMatch = countries.find(c => fullAddress.toLowerCase().includes(c.label.toLowerCase()));
      if (countryMatch) {
        setResidentialCountry(countryMatch.value);
        setResidentialAddress(fullAddress.replace(new RegExp(`,? ${countryMatch.label}`, 'i'), '').trim());
      } else {
        setResidentialAddress(fullAddress);
        setResidentialCountry('');
      }

      setPhoneNumber(profile.phone_number || '');
      setCompanyName(profile.company_name || '');
      setBusinessName(profile.business_name || '');
      setCountryOfIncorporation(profile.country_of_incorporation || '');
      setTaxId(profile.tax_id || '');
      setDateOfIncorporation(profile.date_of_incorporation || '');
      setLegalAddress(profile.legal_address || '');
      setBusinessAddress(profile.business_address || '');
      setCorporatePhone(profile.corporate_phone || '');
      setCorporateEmail(profile.corporate_email || '');
    }
  }, [profile]);

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setLoading(true);

    const countryLabel = countries.find(c => c.value === residentialCountry)?.label || '';
    const fullResidentialAddress = [residentialAddress.trim(), countryLabel].filter(Boolean).join(', ');

    const updates = {
      id: user.id,
      account_type: accountType,
      updated_at: new Date()
    };
    if (accountType === 'individual') {
      Object.assign(updates, {
        full_name: fullName,
        date_of_birth: dateOfBirth,
        nationality: nationality,
        id_document_number: idDocumentNumber,
        residential_address: fullResidentialAddress,
        phone_number: phoneNumber
      });
    } else {
       const incorporationCountryLabel = countries.find(c => c.value === countryOfIncorporation)?.label || '';
      Object.assign(updates, {
        full_name: fullName,
        company_name: companyName,
        business_name: businessName,
        country_of_incorporation: incorporationCountryLabel,
        tax_id: taxId,
        date_of_incorporation: dateOfIncorporation,
        legal_address: legalAddress,
        business_address: businessAddress,
        corporate_phone: corporatePhone,
        corporate_email: corporateEmail
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

  const getProfileBadge = (profileResult) => {
    switch (profileResult) {
      case 'Conservador':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Shield className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      case 'Moderado':
        return <Badge variant="default" className="bg-green-100 text-green-800"><BarChart className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      case 'Dinámico':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800"><TrendingUp className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      case 'Agresivo':
        return <Badge variant="default" className="bg-red-100 text-red-800"><Zap className="mr-2 h-4 w-4" />{profileResult}</Badge>;
      default:
        return <Badge variant="secondary">No definido</Badge>;
    }
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
        <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1" />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
            <Input id="dateOfBirth" type="date" value={dateOfBirth || ''} onChange={e => setDateOfBirth(e.target.value)} className="mt-1" />
        </div>
        <div>
            <Label htmlFor="nationality">Nacionalidad</Label>
            <CountryComboBox 
              value={nationality}
              onChange={setNationality}
              placeholder="Selecciona una nacionalidad..."
            />
        </div>
      </div>
      <div>
        <Label htmlFor="idDocumentNumber">RUT / Número de Pasaporte</Label>
        <Input id="idDocumentNumber" value={idDocumentNumber} onChange={e => setIdDocumentNumber(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="residentialAddress">Dirección</Label>
        <Input id="residentialAddress" placeholder="Calle, número, ciudad, etc." value={residentialAddress} onChange={e => setResidentialAddress(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="residentialCountry">País de Residencia</Label>
        <CountryComboBox 
            value={residentialCountry}
            onChange={setResidentialCountry}
            placeholder="Selecciona un país..."
        />
      </div>
      <div>
        <Label htmlFor="phoneNumber">Teléfono de Contacto</Label>
        <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="mt-1" />
      </div>
    </div>;

  const InstitutionalForm = () => <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 border-b pb-2">Información de la Empresa</h3>
      <div>
        <Label htmlFor="companyName">Nombre de la Empresa</Label>
        <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="businessName">Razón Social</Label>
        <Input id="businessName" value={businessName} onChange={e => setBusinessName(e.target.value)} className="mt-1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="countryOfIncorporation">País de Constitución</Label>
          <CountryComboBox
             value={countryOfIncorporation}
             onChange={setCountryOfIncorporation}
             placeholder="Selecciona un país..."
          />
        </div>
        <div>
          <Label htmlFor="taxId">RUT</Label>
          <Input id="taxId" value={taxId} onChange={e => setTaxId(e.target.value)} className="mt-1" />
        </div>
      </div>
      <div>
        <Label htmlFor="dateOfIncorporation">Fecha de Constitución</Label>
        <Input id="dateOfIncorporation" type="date" value={dateOfIncorporation || ''} onChange={e => setDateOfIncorporation(e.target.value)} className="mt-1" />
      </div>
      <div>
        <Label htmlFor="legalAddress">Dirección Legal</Label>
        <Input id="legalAddress" value={legalAddress} onChange={e => setLegalAddress(e.target.value)} className="mt-1" />
      </div>
       <div>
        <Label htmlFor="businessAddress">Dirección Comercial</Label>
        <Input id="businessAddress" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} className="mt-1" />
      </div>
      <h3 className="text-lg font-medium text-gray-800 border-b pt-4 pb-2">Información de Contacto</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <Label htmlFor="fullName">Nombre Completo del Contacto</Label>
            <Input id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1" />
        </div>
        <div>
            <Label htmlFor="corporatePhone">Teléfono de Contacto</Label>
            <Input id="corporatePhone" type="tel" value={corporatePhone} onChange={e => setCorporatePhone(e.target.value)} className="mt-1" />
        </div>
      </div>
       <div>
            <Label htmlFor="corporateEmail">Email Corporativo</Label>
            <Input id="corporateEmail" type="email" value={corporateEmail} onChange={e => setCorporateEmail(e.target.value)} className="mt-1" />
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
            <RadioGroup value={accountType} onValueChange={setAccountType} className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Label htmlFor="individual" className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${accountType === 'individual' ? 'border-primary' : 'border-muted'}`}>
                <RadioGroupItem value="individual" id="individual" className="sr-only" />
                <User className="mb-3 h-6 w-6" />
                Individual
              </Label>
              <Label htmlFor="institutional" className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground ${accountType === 'institutional' ? 'border-primary' : 'border-muted'}`}>
                <RadioGroupItem value="institutional" id="institutional" className="sr-only" />
                <Building className="mb-3 h-6 w-6" />
                Institucional
              </Label>
            </RadioGroup>
          </div>
          
          <div className="space-y-6 pt-4 border-t">
            {accountType === 'individual' ? <IndividualForm /> : <InstitutionalForm />}
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
