import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockAuth, mockUserProfiles, isMockMode } from '@/lib/mock-auth';

export async function signIn(email: string, password: string) {
  // Modo DEMO - usar autenticación local
  if (isMockMode() || !isSupabaseConfigured()) {
    return await mockAuth.signIn(email, password);
  }
  
  // Modo PRODUCCIÓN - usar Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (isMockMode() || !isSupabaseConfigured()) {
    await mockAuth.signOut();
    return;
  }
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (isMockMode() || !isSupabaseConfigured()) {
    const { user } = await mockAuth.getUser();
    return user;
  }
  
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getUserProfile(userId: string) {
  if (isMockMode() || !isSupabaseConfigured()) {
    return await mockUserProfiles.getUserProfile(userId);
  }
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

export async function recoverPassword(email: string) {
  if (isMockMode() || !isSupabaseConfigured()) {
    await mockAuth.resetPasswordForEmail(email);
    return;
  }
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });
  
  if (error) throw error;
}

export async function resetPassword(newPassword: string) {
  if (isMockMode() || !isSupabaseConfigured()) {
    await mockAuth.updateUser({ password: newPassword });
    return;
  }
  
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
}
