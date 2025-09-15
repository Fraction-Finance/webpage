import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2, Shield, Settings, PackagePlus, Database, Plus, Trash2, PlusCircle } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateAssetWizard from '@/pages/admin/components/CreateAssetWizard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';

const CreateVaultWizard = ({ onVaultCreated }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        manager: '',
        asset_type: 'Mercado de Capitales',
        investment_rules: {},
        token_id: '',
        holdings: [],
    });
    const [digitalAssets, setDigitalAssets] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAssetWizardOpen, setIsAssetWizardOpen] = useState(false);
    const { toast } = useToast();
    const { user } = useAuth();
    const MAX_STEPS = 4;

    useEffect(() => {
        fetchDigitalAssets();
    }, []);

    const fetchDigitalAssets = async () => {
        const { data, error } = await supabase.from('digital_assets').select('*');
        if (error) {
            toast({ title: "Error", description: "Could not load digital assets.", variant: "destructive" });
        } else {
            setDigitalAssets(data);
        }
    };
    
    const handleNext = () => setStep(prev => Math.min(prev + 1, MAX_STEPS));
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));

    const handleHoldingsChange = (index, field, value) => {
        const newHoldings = [...formData.holdings];
        newHoldings[index][field] = value;
        setFormData(prev => ({ ...prev, holdings: newHoldings }));
    };

    const addHolding = () => {
        setFormData(prev => ({ ...prev, holdings: [...prev.holdings, { asset_id: '', quantity: '' }] }));
    };

    const removeHolding = (index) => {
        const newHoldings = formData.holdings.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, holdings: newHoldings }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        if (!formData.name || !formData.token_id || !user?.id) {
            toast({ title: "Incomplete Data", description: "Vault name and participation token are required.", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        const { data: vaultData, error: vaultError } = await supabase
            .from('tokenized_vaults')
            .insert({
                name: formData.name,
                manager: formData.manager,
                asset_type: formData.asset_type,
                investment_rules: formData.investment_rules,
                token_id: formData.token_id,
                owner_id: user.id
            })
            .select()
            .single();

        if (vaultError) {
            toast({ title: "Error creating vault", description: vaultError.message, variant: "destructive" });
            setIsSubmitting(false);
            return;
        }

        if (formData.holdings.length > 0) {
            const holdingsToInsert = formData.holdings
              .filter(h => h.asset_id && h.quantity)
              .map(h => ({
                vault_id: vaultData.id,
                asset_id: h.asset_id,
                quantity: h.quantity
            }));
            
            if (holdingsToInsert.length > 0) {
                const { error: holdingsError } = await supabase.from('vault_holdings').insert(holdingsToInsert);
                if (holdingsError) {
                    toast({ title: "Error adding assets to vault", description: holdingsError.message, variant: "destructive" });
                }
            }
        }
        
        setIsSubmitting(false);
        setStep(MAX_STEPS + 1);
    };
    
    const handleAssetCreatedInWizard = (newAsset) => {
        fetchDigitalAssets(); 
        setFormData(prev => ({...prev, token_id: newAsset.id}));
        setIsAssetWizardOpen(false);
        toast({title: "Participation Asset Created", description: `${newAsset.name} has been selected as the vault's token.`});
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 />;
            case 2: return <Step2 />;
            case 3: return <Step3 />;
            case 4: return <Step4 />;
            case MAX_STEPS + 1: return <StepSuccess />;
            default: return <Step1 />;
        }
    };

    const Step1 = () => (
        <div>
            <h3 className="text-lg font-semibold mb-2">Vault Details</h3>
            <p className="text-sm text-muted-foreground mb-6">Define the basic details of your investment vault.</p>
            <div className="space-y-4">
                <div><Label htmlFor="name">Vault Name</Label><Input id="name" name="name" value={formData.name} onChange={handleInputChange} /></div>
                <div><Label htmlFor="manager">Vault Manager</Label><Input id="manager" name="manager" value={formData.manager} onChange={handleInputChange} /></div>
                <div>
                    <Label htmlFor="asset_type">Primary Asset Type</Label>
                    <Select value={formData.asset_type} onValueChange={(value) => handleSelectChange('asset_type', value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Mercado de Capitales">Capital Markets (Stocks, Bonds, ETFs)</SelectItem>
                            <SelectItem value="Activos Reales">Real Assets (Real Estate, Energy, etc.)</SelectItem>
                            <SelectItem value="Mixto">Mixed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    const Step2 = () => (
        <div>
            <h3 className="text-lg font-semibold mb-2">Vault Tokenization</h3>
            <p className="text-sm text-muted-foreground mb-6">Select or create the ERC-20 token that will represent shares in this vault.</p>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="token_id">Participation Token (Share)</Label>
                    <Select value={formData.token_id} onValueChange={(value) => handleSelectChange('token_id', value)}>
                        <SelectTrigger><SelectValue placeholder="Select an existing digital asset" /></SelectTrigger>
                        <SelectContent>
                            {digitalAssets.map(asset => <SelectItem key={asset.id} value={asset.id}>{asset.name} ({asset.symbol})</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="text-center my-4">OR</div>
                <Dialog open={isAssetWizardOpen} onOpenChange={setIsAssetWizardOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full"><PlusCircle className="mr-2 h-4 w-4" />Create New Participation Asset</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>Create New Digital Asset (Vault Token)</DialogTitle>
                            <DialogDescription>This asset will represent ownership in the vault.</DialogDescription>
                        </DialogHeader>
                        <CreateAssetWizard onAssetCreated={handleAssetCreatedInWizard} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );

    const Step3 = () => (
        <div>
            <h3 className="text-lg font-semibold mb-2">Initial Portfolio</h3>
            <p className="text-sm text-muted-foreground mb-6">Define the initial portfolio of assets the vault will hold. This is optional and can be modified later.</p>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {formData.holdings.map((holding, index) => (
                    <div key={index} className="flex items-end gap-2 p-3 border rounded-lg">
                        <div className="flex-1">
                            <Label>Asset</Label>
                            <Select value={holding.asset_id} onValueChange={(value) => handleHoldingsChange(index, 'asset_id', value)}>
                                <SelectTrigger><SelectValue placeholder="Select asset" /></SelectTrigger>
                                <SelectContent>
                                    {digitalAssets.filter(a => a.id !== formData.token_id).map(asset => <SelectItem key={asset.id} value={asset.id}>{asset.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-32">
                            <Label>Quantity</Label>
                            <Input type="number" value={holding.quantity} onChange={(e) => handleHoldingsChange(index, 'quantity', e.target.value)} />
                        </div>
                        <Button variant="destructive" size="icon" onClick={() => removeHolding(index)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="mt-4 w-full" onClick={addHolding}><Plus className="mr-2 h-4 w-4" />Add Asset to Portfolio</Button>
        </div>
    );

    const Step4 = () => {
        const token = digitalAssets.find(a => a.id === formData.token_id);
        return (
            <div>
                <h3 className="text-lg font-semibold mb-2">Summary & Confirmation</h3>
                <p className="text-sm text-muted-foreground mb-6">Review the vault details before creating it on the platform.</p>
                <div className="space-y-3 rounded-lg border p-4">
                    <p><strong>Name:</strong> {formData.name}</p>
                    <p><strong>Manager:</strong> {formData.manager}</p>
                    <p><strong>Asset Type:</strong> {formData.asset_type}</p>
                    <p><strong>Participation Token:</strong> {token?.name || 'N/A'} ({token?.symbol || 'N/A'})</p>
                    <p><strong>Initial Portfolio Assets:</strong> {formData.holdings.length}</p>
                    <ul className="pl-5 list-disc text-sm">
                        {formData.holdings.map((h, i) => <li key={i}>{h.quantity} of {digitalAssets.find(a => a.id === h.asset_id)?.name || 'Asset not found'}</li>)}
                    </ul>
                </div>
            </div>
        );
    };

    const StepSuccess = () => (
        <div className="text-center py-10 flex flex-col items-center justify-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vault Created Successfully!</h3>
            <p className="text-sm text-muted-foreground mb-6">{formData.name} is now available on the platform.</p>
        </div>
    );

    return (
        <div className="p-2">
            {step <= MAX_STEPS && (
                 <div className="mb-6 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Step {step} of {MAX_STEPS}</span>
                    <div className="w-full mx-8 bg-gray-200 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${(step / MAX_STEPS) * 100}%` }}></div>
                    </div>
                </div>
            )}
           
            <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="min-h-[400px]">
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex justify-between">
                {step > 1 && step <= MAX_STEPS ? (<Button variant="outline" onClick={handleBack} disabled={isSubmitting}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>) : <div></div>}
                {step < MAX_STEPS && (<Button onClick={handleNext}>Next <ArrowRight className="ml-2 h-4 w-4" /></Button>)}
                {step === MAX_STEPS && (<Button onClick={handleSubmit} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />} Create Vault</Button>)}
                {step > MAX_STEPS && (<Button onClick={onVaultCreated}>Finish</Button>)}
            </div>
        </div>
    );
};

export default CreateVaultWizard;