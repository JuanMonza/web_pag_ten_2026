import { createClient } from '@/lib/supabase-server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  let tenderoInfo = null;
  if (profile.role === 'tendero') {
    const { data } = await supabase
      .from('tenderos')
      .select('*')
      .eq('user_id', user.id)
      .single();
    tenderoInfo = data;
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre</label>
              <p className="mt-1 text-lg">{profile.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-lg">{profile.email}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Teléfono</label>
              <p className="mt-1 text-lg">{profile.phone}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Rol</label>
              <p className="mt-1 text-lg capitalize">{profile.role}</p>
            </div>
            
            {tenderoInfo && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Dirección</label>
                <p className="mt-1 text-lg">{tenderoInfo.direccion}</p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  profile.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {profile.active ? 'Activo' : 'Inactivo'}
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
