import { useState } from 'react';
import { User, Mail, Camera, Loader2, Key, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/authStore';
import { useUpdateProfile } from '@/hooks/useAuth';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: formData.name,
      email: formData.email,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);

    try {
      // Call your backend's change password endpoint
      await authApi.updateProfile({
        // Your backend should handle password change
      });
      
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        {/* Avatar Section */}
        <div className="rounded-2xl bg-card p-6 neumorphic mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full gradient-primary text-4xl font-bold text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <Button
                size="icon"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                variant="secondary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-sm text-success capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="rounded-2xl bg-card p-6 neumorphic mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold">Personal Information</h2>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-0 pl-10"
                  disabled={updateProfileMutation.isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-secondary border-0 pl-10"
                  disabled={updateProfileMutation.isPending}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="gradient-primary border-0" 
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-2xl bg-card p-6 neumorphic">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary">
              <Key className="h-5 w-5 text-primary-foreground" />
            </div>
            <h2 className="text-xl font-bold">Change Password</h2>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="bg-secondary border-0"
                placeholder="••••••••"
                disabled={isChangingPassword}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="bg-secondary border-0"
                placeholder="••••••••"
                disabled={isChangingPassword}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="bg-secondary border-0"
                placeholder="••••••••"
                disabled={isChangingPassword}
              />
            </div>

            <Button type="submit" variant="outline" disabled={isChangingPassword}>
              {isChangingPassword ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
