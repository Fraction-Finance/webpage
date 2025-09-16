import React, { useState, useEffect } from 'react';
    import { Link, useLocation, NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Menu, X, User as UserIcon, LogOut, Info, LayoutDashboard, Wallet, Network, Package, BookOpen, TrendingUp, Landmark, Users, Target, Rss, MailQuestion, Check, Briefcase, Zap } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import AuthModal from '@/components/AuthModal';
    import { useAuth } from '@/contexts/SupabaseAuthContext';
    import { useWallet } from '@/contexts/WalletContext';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuSub,
      DropdownMenuSubTrigger,
      DropdownMenuSubContent,
      DropdownMenuPortal,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import {
      NavigationMenu,
      NavigationMenuContent,
      NavigationMenuItem,
      NavigationMenuList,
      NavigationMenuTrigger,
      NavigationMenuLink,
    } from "@/components/ui/navigation-menu";
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { cn } from "@/lib/utils";
    import Logo from '@/components/Logo';

    const UserMenu = () => {
      const { user, profile, signOut } = useAuth();
      const { isConnected, wallet, connectWallet, disconnectWallet, switchNetwork, supportedChains } = useWallet();

      const getInitials = (name) => {
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
          return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
      };

      const formatAddress = (address) => {
        if (!address) return '';
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
      };
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full glow-effect-sm">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.full_name || 'Usuario'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {isConnected ? (
              <>
                <DropdownMenuItem onClick={disconnectWallet}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>{formatAddress(wallet.address)}</span>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Network className="mr-2 h-4 w-4" />
                    <span>{wallet.network?.chainName || 'Red Desconocida'}</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuLabel>Cambiar de Red</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {supportedChains.map((chain) => (
                        <DropdownMenuItem key={chain.chainId} onClick={() => switchNetwork(chain.chainId)}>
                          {wallet.network?.chainId === chain.chainId && <Check className="mr-2 h-4 w-4" />}
                          <span>{chain.chainName}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </>
            ) : (
              <>
                <DropdownMenuItem onClick={connectWallet}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Conectar Billetera</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Network className="mr-2 h-4 w-4" />
                  <span>No Conectado</span>
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem asChild>
              <Link to="/perfil">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/inversiones">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Portafolio</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };

    const ListItem = React.forwardRef(({ className, title, children, href, icon: Icon, ...props }, ref) => {
      return (
        <li>
          <NavigationMenuLink asChild>
            <Link
              to={href}
              ref={ref}
              className={cn(
                "flex select-none space-x-4 items-center rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-primary/5 focus:bg-primary/5",
                className
              )}
              {...props}
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                {Icon && <Icon className="h-6 w-6 text-primary" />}
              </div>
              <div>
                <div className="text-sm font-medium leading-none">{title}</div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
                </p>
              </div>
            </Link>
          </NavigationMenuLink>
        </li>
      );
    });
    ListItem.displayName = "ListItem";


    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [scrolled, setScrolled] = useState(false);
      const { user, loading } = useAuth();
      const location = useLocation();

      useEffect(() => {
        const handleScroll = () => {
          setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

      const navItems = [
        {
          name: "Mercado de Activos Digitales",
          path: "/producto/mercados-globales",
          icon: TrendingUp
        },
        {
          name: "RWA (Activos Reales)",
          path: "/producto/invertir-rwa",
          icon: Landmark
        },
        {
          name: "Mercado de Activos DeFi",
          path: "/producto/mercado-activos-descentralizados",
          icon: Zap
        },
        {
          name: "Tokenizar",
          path: "/tokenizar",
          icon: Package
        },
        {
          name: "Nuestra Empresa",
          path: "/nosotros",
          icon: Users
        },
        {
          name: "Modelo de Negocio",
          path: "/nosotros/modelo-de-negocio",
          icon: Target
        },
        {
          name: "Ecosistema",
          path: "/ecosistema",
          icon: Network
        },
        {
          name: "Blog",
          path: "/blog",
          icon: Rss
        },
        {
          name: "Contacto",
          path: "/contacto",
          icon: MailQuestion
        },
        {
          name: "Documentación",
          path: "https://docs.fractionfinance.cl/",
          icon: BookOpen,
          external: true
        },
        {
          name: "Trabaja con Nosotros",
          path: "/empleos",
          icon: Briefcase
        },
        {
          name: "Política de Privacidad",
          path: "/legal/politica-de-privacidad",
          icon: Shield
        },
        {
          name: "Términos de Servicio",
          path: "/legal/terminos-de-servicio",
          icon: FileText
        },
        {
          name: "Política de Cookies",
          path: "/legal/politica-de-cookies",
          icon: Zap
        },
        {
          name: "Canal de Denuncias",
          path: "/legal/canal-de-denuncias",
          icon: AlertCircle
        },
        {
          name: "Canal de Reclamos",
          path: "/legal/canal-de-reclamos",
          icon: MailQuestion
        }
      ];

      const NavLinkItem = ({ to, children, isDropdown, isExternal = false }) => {
        const isActive = location.pathname.startsWith(to);
        const LinkComponent = isExternal ? 'a' : Link;
        const linkProps = isExternal ? { href: to, target: "_blank", rel: "noopener noreferrer" } : { to };
        return (
          <div
            className={cn(
              "relative px-4 py-2 text-base font-semibold transition-all duration-300 rounded-md cursor-pointer",
              isActive && !isExternal
                ? 'text-primary bg-primary/5 glow-effect-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            )}
          >
            {isDropdown ? <span>{children}</span> : <LinkComponent {...linkProps}>{children}</LinkComponent>}
            {isActive && !isExternal && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
              />
            )}
          </div>
        );
      };

      return (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'glass-effect-custom shadow-lg' : 'bg-transparent'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex-1 flex justify-start">
                <Logo className="h-12 w-auto" />
              </div>

              <div className="hidden md:flex flex-2 justify-center">
                <NavigationMenu>
                  <NavigationMenuList className="flex space-x-1">
                    {navItems.map((item) => (
                      <NavigationMenuItem key={item.name}>
                        {item.external ? (
                          <NavigationMenuLink asChild>
                            <a href={item.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 text-base font-semibold text-gray-600 hover:text-primary hover:bg-gray-100/50 rounded-md">
                              {item.icon && <item.icon className="h-5 w-5" />}
                              {item.name}
                            </a>
                          </NavigationMenuLink>
                        ) : (
                          <NavigationMenuLink asChild>
                            <Link to={item.path} className="flex items-center gap-2 px-4 py-2 text-base font-semibold text-gray-600 hover:text-primary hover:bg-gray-100/50 rounded-md">
                              {item.icon && <item.icon className="h-5 w-5" />}
                              {item.name}
                            </Link>
                          </NavigationMenuLink>
                        )}
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
              </div>

              <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
                {!loading && (user ? <UserMenu /> : <AuthModal />)}
              </div>

              <div className="md:hidden flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-gray-800 ml-4"
                >
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>

            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden glass-effect-custom rounded-lg mt-2 p-4"
              >
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    item.external ? (
                      <a
                        key={item.name}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-100/50 rounded-md"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name}
                      </a>
                    ) : (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-base font-medium transition-colors duration-200 ${
                          location.pathname.startsWith(item.path)
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-600 hover:text-primary hover:bg-gray-100/50'
                        } rounded-md`}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        {item.name}
                      </Link>
                    )
                  ))}
                  {!user && (
                    <div className="pt-4 border-t border-gray-200">
                      <AuthModal />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.nav>
      );
      };
      
      export default Navbar;