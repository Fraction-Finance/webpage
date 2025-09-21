import React, { useState, useEffect } from 'react';
        import { Link, useLocation } from 'react-router-dom';
        import { motion } from 'framer-motion';
        import { Menu, X, User as UserIcon, LogOut, Info, LayoutDashboard, Wallet, Network, Package, Users, Target, Rss, MailQuestion, Briefcase, Check, BookOpen, GraduationCap } from 'lucide-react';
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
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || user?.email} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">{getInitials(profile?.full_name)}</AvatarFallback>
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
                  <Link to="/portafolio">
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
        
        const ListItem = React.forwardRef(({ className, title, children, href, icon: Icon, isExternal = false, ...props }, ref) => {
          const LinkComponent = isExternal ? 'a' : Link;
          const linkProps = isExternal ? { href, target: "_blank", rel: "noopener noreferrer" } : { to: href };
        
          return (
            <li>
              <NavigationMenuLink asChild>
                <LinkComponent
                  ref={ref}
                  className={cn(
                    "flex select-none space-x-4 items-center rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                    className
                  )}
                  {...linkProps}
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
                </LinkComponent>
              </NavigationMenuLink>
            </li>
          );
        });
        ListItem.displayName = "ListItem";
        
        const NavLinkItem = ({ to, children, isDropdown, isExternal = false }) => {
          const location = useLocation();
          const isActive = location.pathname.startsWith(to) && to !== '/';
          const isHomeActive = location.pathname === '/' && to === '/';
          const LinkComponent = isExternal ? 'a' : Link;
          const linkProps = isExternal ? { href: to, target: "_blank", rel: "noopener noreferrer" } : { to };
          
          return (
            <div
              className={cn(
                "relative px-4 py-2 text-base font-medium transition-all duration-300 rounded-md cursor-pointer",
                (isActive || isHomeActive) && !isExternal
                  ? 'text-primary'
                  : 'text-foreground/60 hover:text-foreground'
              )}
            >
              {isDropdown ? <span>{children}</span> : <LinkComponent {...linkProps}>{children}</LinkComponent>}
              {(isActive || isHomeActive) && !isExternal && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
            </div>
          );
        };
        
        const Navbar = () => {
          const [isOpen, setIsOpen] = useState(false);
          const [scrolled, setScrolled] = useState(false);
          const { user, loading } = useAuth();
          const location = useLocation();
        
          useEffect(() => {
            const handleScroll = () => {
              setScrolled(window.scrollY > 20);
            };
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
          }, []);
        
          const navItems = [
            { name: "Mercados", path: '/mercados', icon: Package },
            { name: "Ecosistema", path: '/ecosistema', icon: Network },
            { name: "Nosotros", path: '/nosotros', 
              icon: Info,
              children: [
                { title: "Nuestra Empresa", href: "/nosotros", description: "Conoce nuestra misión y equipo.", icon: Users },
                { title: "Modelo de Negocio", href: "/nosotros/modelo-de-negocio", description: "Descubre cómo creamos valor.", icon: Target },
                { title: "Educación Financiera", href: "/nosotros/educacion-financiera", description: "Aprende a invertir con nuestros artículos.", icon: GraduationCap },
                { title: "Blog", href: "/nosotros/blog", description: "Mantente actualizado con nuestras últimas ideas.", icon: Rss },
                { title: "Trabaja con Nosotros", href: "/nosotros/empleos", description: "Únete a nuestro equipo.", icon: Briefcase },
                { title: "Contáctanos", href: "/nosotros/contacto", description: "Ponte en contacto para soporte o consultas.", icon: MailQuestion },
                { title: "Documentación", href: "https://docs.fractionfinance.cl/", description: "Explora nuestra documentación técnica.", icon: BookOpen, isExternal: true },
              ]
            },
          ];
        
          return (
            <motion.nav
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'glass-effect-custom' : 'bg-transparent'
              )}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  <div className="flex-1 flex justify-start">
                    <Link to="/">
                      <Logo className="h-12 w-auto" />
                    </Link>
                  </div>
        
                  <div className="hidden md:flex flex-2 justify-center">
                    <NavigationMenu>
                      <NavigationMenuList className="flex space-x-1">
                        {navItems.map((item) => (
                          <NavigationMenuItem key={item.name}>
                            {item.children ? (
                              <>
                                <NavigationMenuTrigger className="!bg-transparent hover:!bg-accent p-0">
                                  <NavLinkItem to={item.path} isDropdown>{item.name}</NavLinkItem>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                  <ul className="grid gap-3 p-4 w-[300px] md:w-[400px] lg:w-[500px] lg:grid-cols-1">
                                    {item.children.map((component) => (
                                      <ListItem
                                        key={component.title}
                                        title={component.title}
                                        href={component.href}
                                        icon={component.icon}
                                        isExternal={component.isExternal}
                                      >
                                        {component.description}
                                      </ListItem>
                                    ))}
                                  </ul>
                                </NavigationMenuContent>
                              </>
                            ) : (
                               <NavigationMenuLink asChild>
                                 <NavLinkItem to={item.path}>{item.name}</NavLinkItem>
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
                       <div className="flex items-center">
                          {user && <UserMenu />}
                          <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setIsOpen(!isOpen)}
                              className="text-foreground ml-2"
                          >
                              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                          </Button>
                       </div>
                    </div>
                </div>
              </div>
          
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden absolute top-full left-0 right-0 glass-effect-custom shadow-lg"
                >
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    {navItems.map((item) => (
                      <div key={item.name}>
                          <Link
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-3 py-2 rounded-md text-base font-medium ${
                              location.pathname.startsWith(item.path)
                                ? 'text-primary bg-primary/10'
                                : 'text-foreground/80 hover:bg-accent'
                            }`}
                          >
                            {item.name}
                          </Link>
                      </div>
                    ))}
                    {!user && (
                      <div className="pt-4 border-t border-border">
                        <AuthModal />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.nav>
          );
        };
              
        export default Navbar;