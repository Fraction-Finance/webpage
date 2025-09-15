import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Loader2, Eye, MessageSquare as MessageSquareWarning, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ReportDetailsDialog = ({ report }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalles del Reporte</DialogTitle>
          <DialogDescription>
            Reporte de tipo '{report.report_type === 'complaint' ? 'Reclamo' : 'Denuncia'}' recibido el {new Date(report.created_at).toLocaleString()}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <p className="font-semibold">Nombre:</p>
            <p>{report.is_anonymous ? 'Anónimo' : report.name || 'No proporcionado'}</p>
          </div>
          <div>
            <p className="font-semibold">Email:</p>
            <p>{report.is_anonymous ? 'Anónimo' : report.email || 'No proporcionado'}</p>
          </div>
          <div>
            <p className="font-semibold">Detalles:</p>
            <p className="whitespace-pre-wrap bg-gray-100 p-2 rounded">{report.details}</p>
          </div>
          <div>
            <p className="font-semibold">Estado:</p>
            <Badge>{report.status}</Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ReportsTable = ({ reports, loading }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Tipo</TableHead>
        <TableHead>Fecha</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead>Anónimo</TableHead>
        <TableHead className="text-right">Acciones</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {loading ? (
        <TableRow><TableCell colSpan="5" className="text-center h-24"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
      ) : reports.length > 0 ? (
        reports.map(report => (
          <TableRow key={report.id}>
            <TableCell className="font-medium flex items-center">
              {report.report_type === 'complaint' ? <MessageSquareWarning className="mr-2 h-4 w-4 text-yellow-600" /> : <ShieldAlert className="mr-2 h-4 w-4 text-red-600" />}
              {report.report_type === 'complaint' ? 'Reclamo' : 'Denuncia'}
            </TableCell>
            <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
            <TableCell><Badge>{report.status}</Badge></TableCell>
            <TableCell>{report.is_anonymous ? 'Sí' : 'No'}</TableCell>
            <TableCell className="text-right">
              <ReportDetailsDialog report={report} />
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow><TableCell colSpan="5" className="text-center h-24">No se encontraron reportes.</TableCell></TableRow>
      )}
    </TableBody>
  </Table>
);

const ManageReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      } else {
        setReports(data);
      }
      setLoading(false);
    };
    fetchReports();
  }, [toast]);

  const complaints = reports.filter(r => r.report_type === 'complaint');
  const whistleblowers = reports.filter(r => r.report_type === 'whistleblower');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Denuncias y Reclamos</CardTitle>
        <CardDescription>Visualiza y gestiona los reportes enviados por los usuarios.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Todos ({reports.length})</TabsTrigger>
            <TabsTrigger value="complaints">Reclamos ({complaints.length})</TabsTrigger>
            <TabsTrigger value="whistleblowers">Denuncias ({whistleblowers.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ReportsTable reports={reports} loading={loading} />
          </TabsContent>
          <TabsContent value="complaints">
            <ReportsTable reports={complaints} loading={loading} />
          </TabsContent>
          <TabsContent value="whistleblowers">
            <ReportsTable reports={whistleblowers} loading={loading} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManageReports;