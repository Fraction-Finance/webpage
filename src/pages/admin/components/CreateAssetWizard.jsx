import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Wallet, ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2, Hammer, Rocket, ShieldCheck } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { ethers } from 'ethers';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const assetClasses = [
    { id: 'equity', title: 'Equity / Fund (Regulated)', description: "Ideal for investment funds. Creates an ERC20 token with whitelisting and mint/burn controls for KYC/AML compliance.", contractType: 'RegulatedFund' },
    { id: 'rwa', title: 'Simple RWA Token', description: "A basic ERC20 token for Real-World Assets. Perfect for items without complex compliance needs. Mints the total supply to the admin.", contractType: 'RWAAsset' },
];

const getSafeContractName = (name, fallback) => {
    if (!name) return fallback;
    const safeName = name.replace(/[^a-zA-Z0-9_]/g, '');
    return safeName || fallback;
};

const generateRegulatedFundContract = (name, symbol) => {
    const safeName = getSafeContractName(name, 'RegulatedToken');
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ${safeName} is ERC20, ERC20Capped, ERC20Burnable, ERC20Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant WHITELIST_ADMIN_ROLE = keccak256("WHITELIST_ADMIN_ROLE");

    mapping(address => bool) private _whitelist;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap,
        address admin
    ) ERC20(name_, symbol_) ERC20Capped(cap) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
        _grantRole(WHITELIST_ADMIN_ROLE, admin);
        _whitelist[admin] = true;
    }

    function isWhitelisted(address account) public view returns (bool) {
        return _whitelist[account];
    }
    
    function addToWhitelist(address account) public onlyRole(WHITELIST_ADMIN_ROLE) {
        _whitelist[account] = true;
    }

    function removeFromWhitelist(address account) public onlyRole(WHITELIST_ADMIN_ROLE) {
        _whitelist[account] = false;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(isWhitelisted(to), "Recipient is not whitelisted");
        _mint(to, amount);
    }
    
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _update(address from, address to, uint256 value) internal override(ERC20, ERC20Pausable) {
        super._update(from, to, value);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Capped) {
        super._mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Pausable) {
        super._beforeTokenTransfer(from, to, amount);
        if (from != address(0) && to != address(0)) {
            require(isWhitelisted(from), "Sender is not whitelisted");
            require(isWhitelisted(to), "Recipient is not whitelisted");
        }
    }
}
`;
};

const generateRWAAssetContract = (name, symbol) => {
    const safeName = getSafeContractName(name, 'RWAAsset');
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ${safeName} is ERC20, Ownable {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name_, symbol_) Ownable(initialOwner) {
        _mint(initialOwner, initialSupply);
    }
}
`;
};

const generateContractCode = (assetClass, name, symbol) => {
  const selectedClass = assetClasses.find(ac => ac.id === assetClass);
  if (!selectedClass) return "// Invalid Asset Class";

  if (selectedClass.contractType === 'RegulatedFund') {
      return generateRegulatedFundContract(name, symbol);
  } else if (selectedClass.contractType === 'RWAAsset') {
      return generateRWAAssetContract(name, symbol);
  }
  return "// Contract type not found";
};

const CreateAssetWizard = ({ onAssetCreated }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        assetClass: 'equity',
        network: '',
        assetName: '',
        assetSymbol: '',
        companyWallet: '',
        maxSupply: '',
    });
    const { toast } = useToast();
    const { wallet, isConnected, connectWallet, disconnectWallet, switchNetwork, provider, supportedChains, alchemyProvider } = useWallet();
    const { user } = useAuth();
    const [contractCode, setContractCode] = useState('');
    const [compilationResult, setCompilationResult] = useState(null);
    const [isCompiling, setIsCompiling] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployedContractAddress, setDeployedContractAddress] = useState('');
    const [assetId, setAssetId] = useState(null);
    const MAX_STEPS = 7;

    useEffect(() => {
        if (isConnected) {
            setFormData(prev => ({ 
                ...prev, 
                companyWallet: wallet.address,
                network: wallet.network?.chainId || ''
            }));
        } else {
             setFormData(prev => ({ ...prev, companyWallet: '', network: '' }));
        }
    }, [isConnected, wallet.address, wallet.network]);

    const handleNext = async () => {
        if (step === 2 && !formData.network) {
            toast({ title: "Red Requerida", description: "Por favor, selecciona una red blockchain.", variant: "destructive" });
            return;
        }
        if (step === 3 && !isConnected) {
            toast({ title: "Billetera Requerida", description: "Por favor, conecta tu billetera para continuar.", variant: "destructive" });
            return;
        }
        if (step === 4) {
             if (!formData.assetName || !formData.assetSymbol || !formData.companyWallet || !formData.maxSupply) {
                toast({ title: "Información Incompleta", description: "Por favor, rellena todos los campos.", variant: "destructive" });
                return;
            }
            const code = generateContractCode(formData.assetClass, formData.assetName, formData.assetSymbol);
            setContractCode(code);
        }
        setStep(prev => Math.min(prev + 1, MAX_STEPS));
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNetworkChange = async (chainId) => {
        setFormData(prev => ({ ...prev, network: chainId }));
        if (isConnected && wallet.network?.chainId !== chainId) {
            toast({ title: "Cambiando de Red...", description: "Por favor, aprueba el cambio de red en tu billetera." });
            await switchNetwork(chainId);
        }
    };

    const handleCompile = useCallback(async () => {
        setIsCompiling(true);
        setCompilationResult(null);
        toast({ title: "Compilando Contrato...", description: "Por favor espera, esto puede tardar un momento." });

        const worker = new Worker(new URL('../../../workers/solc.worker.js', import.meta.url), { type: 'module' });

        worker.onmessage = (e) => {
            const { output, error } = e.data;
            if (error) {
                console.error("Compilation error:", error);
                toast({ title: "Falló la Compilación", description: error, variant: "destructive", duration: 9000 });
                setCompilationResult(null);
            } else {
                setCompilationResult({ abi: output.abi, bytecode: `0x${output.evm.bytecode.object}` });
                toast({ title: "¡Compilación Exitosa!", description: "El contrato está listo para ser desplegado.", variant: "success" });
                handleNext();
            }
            setIsCompiling(false);
            worker.terminate();
        };

        worker.onerror = (e) => {
            console.error('Worker error:', e);
            toast({ title: "Error del Compilador", description: "Ocurrió un error inesperado.", variant: "destructive" });
            setIsCompiling(false);
            worker.terminate();
        };
        
        const selectedClass = assetClasses.find(ac => ac.id === formData.assetClass);
        let contractName;
        if (selectedClass.contractType === 'RegulatedFund') {
            contractName = getSafeContractName(formData.assetName, 'RegulatedToken');
        } else {
            contractName = getSafeContractName(formData.assetName, 'RWAAsset');
        }
        
        const finalContractCode = generateContractCode(formData.assetClass, formData.assetName, formData.assetSymbol);
        setContractCode(finalContractCode);

        worker.postMessage({ contractCode: finalContractCode, contractName });
    }, [formData.assetClass, formData.assetName, formData.assetSymbol, toast]);

    const handleDeploy = async () => {
        if (!compilationResult || !isConnected || !user || !alchemyProvider) {
            toast({ title: "Error de Despliegue", description: "No se cumplen los prerrequisitos. Verifica la conexión de la billetera, la compilación del contrato o el estado del proveedor.", variant: "destructive" });
            return;
        }

        setIsDeploying(true);
        toast({ title: "Desplegando Contrato...", description: "Por favor, confirma la transacción en tu billetera." });

        try {
            if (wallet.network?.chainId !== formData.network) {
                await switchNetwork(formData.network);
                // Darle un momento a la billetera para cambiar
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
            
            const signer = await provider.getSigner();
            const signerWithAlchemy = signer.connect(alchemyProvider);
            
            const factory = new ethers.ContractFactory(compilationResult.abi, compilationResult.bytecode, signerWithAlchemy);

            const selectedClass = assetClasses.find(ac => ac.id === formData.assetClass);
            let contract;
            const supplyAmount = ethers.parseUnits(formData.maxSupply || '0', 18);

            if (selectedClass.contractType === 'RegulatedFund') {
                contract = await factory.deploy(formData.assetName, formData.assetSymbol, supplyAmount, formData.companyWallet);
            } else if (selectedClass.contractType === 'RWAAsset') {
                 contract = await factory.deploy(formData.assetName, formData.assetSymbol, supplyAmount, formData.companyWallet);
            }

            await contract.waitForDeployment();
            const deployedAddress = await contract.getAddress();
            setDeployedContractAddress(deployedAddress);

            toast({ title: "¡Despliegue Exitoso!", description: `Contrato desplegado en: ${deployedAddress}`, variant: "success" });
            
            const { data, error } = await supabase.from('digital_assets').insert([{
                name: formData.assetName,
                symbol: formData.assetSymbol,
                category: formData.assetClass,
                description: `Un activo en cadena en ${wallet.network?.chainName || formData.network}`,
                issuer: user.id, 
                total_supply: formData.maxSupply,
                contract_address: deployedAddress,
                owner_id: user.id
            }]).select().single();

            if (error) {
                console.error("Supabase insert error:", error);
                toast({ title: "Error de BD", description: `Falló al guardar el activo: ${error.message}`, variant: "destructive" });
            } else {
                setAssetId(data.id);
                setStep(7);
            }

        } catch (error) {
            console.error(error);
            const errorMessage = error.message.length > 100 ? error.message.substring(0, 100) + '...' : error.message;
            toast({ title: "Falló el Despliegue", description: errorMessage, variant: "destructive" });
        } finally {
            setIsDeploying(false);
        }
    };

    const finishWizard = () => {
        if (onAssetCreated && assetId) {
            onAssetCreated({ id: assetId, name: formData.assetName, contract_address: deployedContractAddress, ...formData });
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 />;
            case 2: return <Step2 />;
            case 3: return <Step3 />;
            case 4: return <Step4 />;
            case 5: return <Step5 />;
            case 6: return <Step6 />;
            case 7: return <Step7 />;
            default: return <Step1 />;
        }
    };

    const Step1 = () => (
        <div>
            <h3 className="text-lg font-semibold mb-1">Seleccionar Clase de Activo</h3>
            <p className="text-sm text-muted-foreground mb-6">Esto determina la plantilla del contrato inteligente y características como la lista blanca y los permisos.</p>
            <RadioGroup value={formData.assetClass} onValueChange={(value) => handleRadioChange('assetClass', value)} className="grid grid-cols-1 md:grid-cols-1 gap-4">
                {assetClasses.map(ac => (
                    <Label key={ac.id} htmlFor={ac.id} className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${formData.assetClass === ac.id ? 'border-primary bg-primary/5' : 'border-input'}`}>
                        <div className="flex items-center">
                            <RadioGroupItem value={ac.id} id={ac.id} />
                            <span className="ml-3 font-semibold">{ac.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 ml-7">{ac.description}</p>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    );

    const Step2 = () => (
        <div>
            <h3 className="text-lg font-semibold mb-1">Seleccionar Red Blockchain</h3>
            <p className="text-sm text-muted-foreground mb-6">Elige la red donde se emitirá tu activo. Esto no se puede cambiar más tarde.</p>
            <RadioGroup value={formData.network} onValueChange={handleNetworkChange} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supportedChains.map(net => (
                    <Label key={net.chainId} htmlFor={net.chainId} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${formData.network === net.chainId ? 'border-primary bg-primary/5' : 'border-input'}`}>
                        <RadioGroupItem value={net.chainId} id={net.chainId} className="mt-1"/>
                        <div className="ml-4">
                            <span className="font-semibold">{net.chainName}</span>
                            <div className="text-xs text-muted-foreground space-x-3">
                                <span>Velocidad: <span className="font-medium text-foreground">{net.speed}</span></span>
                                <span>Costo: <span className="font-medium text-foreground">{net.cost}</span></span>
                                <span>Seguridad: <span className="font-medium text-foreground">{net.security}</span></span>
                            </div>
                        </div>
                    </Label>
                ))}
            </RadioGroup>
        </div>
    );

    const Step3 = () => (
        <div className="text-center py-10 flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold mb-2">Conectar Billetera de Administrador</h3>
            <p className="text-sm text-muted-foreground mb-6">Conecta la billetera que poseerá y gestionará el contrato inteligente.</p>
            {isConnected ? (
                <div className="flex flex-col items-center gap-4">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                    <div className="text-center">
                        <p className="font-semibold">Billetera Conectada</p>
                        <p className="text-sm text-muted-foreground break-all">{formData.companyWallet}</p>
                        <p className="text-sm font-medium text-primary">{wallet.network?.chainName || "Red Desconocida"}</p>
                    </div>
                    <Button onClick={disconnectWallet} variant="outline" size="sm">
                        <XCircle className="mr-2 h-4 w-4" />
                        Desconectar
                    </Button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                    <Button onClick={connectWallet} size="lg" className="w-full">
                        <Wallet className="mr-2 h-5 w-5" />
                        Conectar Billetera
                    </Button>
                     <p className="text-xs text-muted-foreground mt-2">Te conectarás a la red seleccionada en el paso anterior.</p>
                </div>
            )}
        </div>
    );

    const Step4 = () => {
        const selectedAssetClass = assetClasses.find(ac => ac.id === formData.assetClass);
        const isRegulatedFund = selectedAssetClass?.contractType === 'RegulatedFund';

        return (
            <div>
                <h3 className="text-lg font-semibold mb-4">Detalles del Token</h3>
                <p className="text-sm text-muted-foreground mb-6">Define las propiedades en cadena de tu token.</p>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="assetName">Nombre del Token</Label>
                            <Input id="assetName" name="assetName" value={formData.assetName} onChange={handleInputChange} placeholder="ej., Fraction Real Estate Fund" />
                        </div>
                        <div>
                            <Label htmlFor="assetSymbol">Símbolo del Token</Label>
                            <Input id="assetSymbol" name="assetSymbol" value={formData.assetSymbol} onChange={handleInputChange} placeholder="ej., FREF"/>
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="companyWallet">Dirección de Billetera del Administrador</Label>
                        <Input id="companyWallet" name="companyWallet" value={formData.companyWallet} readOnly />
                        <p className="text-xs text-muted-foreground mt-1">Esta billetera tendrá control administrativo sobre el contrato.</p>
                    </div>
                    <div>
                        <Label htmlFor="maxSupply">
                            {isRegulatedFund ? "Suministro Máximo (Cap)" : "Suministro Inicial Total"}
                        </Label>
                        <Input id="maxSupply" name="maxSupply" type="number" value={formData.maxSupply} onChange={handleInputChange} placeholder="ej., 1000000" />
                        <p className="text-xs text-muted-foreground mt-1">
                            {isRegulatedFund 
                                ? "Esto establece el número máximo de tokens que pueden existir."
                                : "Esta cantidad se creará y enviará a la billetera del administrador en el despliegue."}
                        </p>
                    </div>
                </div>
            </div>
        );
    };

    const Step5 = () => (
        <div>
            <h3 className="text-lg font-semibold mb-2">Revisar Contrato Inteligente</h3>
            <p className="text-sm text-muted-foreground mb-4">Este es el código Solidity autogenerado. Será compilado y desplegado en la blockchain.</p>
            <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-xs overflow-x-auto max-h-96 border border-gray-700">
                <pre><code>{`// Red: ${supportedChains.find(n => n.chainId === formData.network)?.chainName}
// Nombre del Token: "${formData.assetName}"
// Símbolo del Token: "${formData.assetSymbol}"
// Suministro/Cap: ${Number(formData.maxSupply).toLocaleString()}
// Admin: ${formData.companyWallet}

${contractCode}`}</code></pre>
            </div>
        </div>
    );

    const Step6 = () => (
        <div className="text-center py-6 flex flex-col items-center justify-center">
             <ShieldCheck className="h-12 w-12 text-primary mb-3" />
            <h3 className="text-lg font-semibold mb-2">Confirmación Final</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Revisa los detalles a continuación. El despliegue creará un contrato inteligente permanente en la blockchain y requiere una tarifa de transacción (gas).
            </p>
            
            <Card className="w-full max-w-lg text-left">
                <CardHeader>
                    <CardTitle>Resumen del Despliegue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Nombre del Token:</span>
                        <span className="font-medium">{formData.assetName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Símbolo:</span>
                        <span className="font-mono bg-muted px-2 py-1 rounded">{formData.assetSymbol}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Red:</span>
                        <span className="font-medium">{supportedChains.find(n => n.chainId === formData.network)?.chainName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Suministro Total/Cap:</span>
                        <span className="font-medium">{Number(formData.maxSupply).toLocaleString()}</span>
                    </div>
                     <div className="flex flex-col pt-2">
                        <span className="text-muted-foreground">Billetera de Admin y Propietario:</span>
                        <span className="font-mono text-xs break-all text-primary">{formData.companyWallet}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const Step7 = () => {
        const network = supportedChains.find(n => n.chainId === formData.network);
        const explorerUrl = network && deployedContractAddress ? `${network.explorer}/address/${deployedContractAddress}` : '#';

        return (
            <div className="text-center py-10 flex flex-col items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">¡Activo Desplegado Exitosamente!</h3>
                <p className="text-sm text-muted-foreground mb-6">Tu nuevo activo digital ahora está en vivo en la blockchain.</p>
                <Card className="w-full max-w-md text-left">
                    <CardHeader>
                        <CardTitle>{formData.assetName} ({formData.assetSymbol})</CardTitle>
                        <CardDescription>Detalles en Cadena</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Label>Dirección del Contrato</Label>
                        <div className="font-mono text-xs break-all bg-muted p-2 rounded-md">{deployedContractAddress}</div>
                        <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                            Ver en el Explorador de {network?.chainName.replace(' Mainnet', '').replace(' Testnet', '')} &rarr;
                        </a>
                    </CardContent>
                </Card>
            </div>
        );
    };

    return (
        <div className="p-1">
             <div className="mb-8 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Paso {step} de {MAX_STEPS}</span>
                <div className="w-full mx-6 bg-gray-200 rounded-full h-1.5">
                    <motion.div 
                        className="bg-primary h-1.5 rounded-full" 
                        initial={{ width: '0%' }}
                        animate={{ width: `${(step - 1) / (MAX_STEPS - 1) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-[420px]"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>

            <div className="mt-8 pt-5 border-t flex justify-between items-center">
                <Button variant="outline" onClick={handleBack} disabled={step === 1 || isDeploying || isCompiling} className={step === 1 ? 'invisible' : ''}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
                </Button>
                {step < 5 && (
                    <Button onClick={handleNext} disabled={isDeploying || isCompiling}>
                        Siguiente <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                )}
                {step === 5 && (
                    <Button onClick={handleCompile} disabled={isCompiling || isDeploying}>
                        {isCompiling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Hammer className="mr-2 h-4 w-4" />}
                        Compilar y Continuar
                    </Button>
                )}
                 {step === 6 && compilationResult && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button disabled={isDeploying || !isConnected || !user}>
                                {isDeploying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
                                Firmar y Desplegar
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>¿Listo para Desplegar?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción creará un contrato inteligente en la blockchain. Es irreversible y costará tarifas de gas. Por favor, verifica los detalles en tu billetera antes de confirmar.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeploy}>Sí, Desplegar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                {step === 7 && (
                    <Button onClick={finishWizard} className="bg-green-600 hover:bg-green-700">
                        Finalizar y Cerrar
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CreateAssetWizard;