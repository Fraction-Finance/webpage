import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, Briefcase, FileText, AlertCircle, TrendingUp, DollarSign, Users } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({ assets: 0, stos: 0, posts: 0 });
  const [chartData, setChartData] = useState([]);
  const [recentAssets, setRecentAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [assetsData, stosCount, postsCount] = await Promise.all([
          supabase.from('digital_assets').select('*').order('created_at', { ascending: false }),
          supabase.from('stos').select('*', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('*', { count: 'exact', head: true })
        ]);

        if (assetsData.error) throw assetsData.error;
        if (stosCount.error) throw stosCount.error;
        if (postsCount.error) throw postsCount.error;

        const allAssets = assetsData.data || [];

        setStats({
          assets: allAssets.length,
          stos: stosCount.count,
          posts: postsCount.count,
        });

        setRecentAssets(allAssets.slice(0, 5));

        const categoryCounts = allAssets.reduce((acc, asset) => {
          const category = asset.category || 'Sin categoría';
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});

        const formattedChartData = Object.keys(categoryCounts).map(key => ({
          name: key,
          value: categoryCounts[key],
        }));
        setChartData(formattedChartData);

      } catch (err) {
        setError('Error al cargar los datos del panel. ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      },
    }),
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{}}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={cardVariants} custom={0}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Activos Digitales Totales</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.assets}</div>
              <p className="text-xs text-muted-foreground">Número de activos tokenizados</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} custom={1}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">STOs Activos</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.stos}</div>
              <p className="text-xs text-muted-foreground">Ofertas de tokens de valor actuales</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants} custom={2}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Publicaciones del Blog</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? '...' : stats.posts}</div>
              <p className="text-xs text-muted-foreground">Total de artículos publicados</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid gap-6 lg:grid-cols-5"
      >
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Distribución de Activos</CardTitle>
            <CardDescription>Desglose de activos digitales por categoría.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            {loading ? <div className="flex items-center justify-center h-full">Cargando gráfico...</div> : 
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            }
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Activos Recientemente Añadidos</CardTitle>
            <CardDescription>Los últimos 5 activos añadidos a la plataforma.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activo</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan="2" className="text-center">Cargando activos...</TableCell></TableRow>
                ) : recentAssets.length > 0 ? (
                  recentAssets.map(asset => (
                    <TableRow key={asset.id}>
                      <TableCell>
                        <div className="font-medium">{asset.name}</div>
                        <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.category}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan="2" className="text-center">No se encontraron activos.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;