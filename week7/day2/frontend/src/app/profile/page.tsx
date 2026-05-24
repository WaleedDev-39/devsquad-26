'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/services/store';
import { restoreSession, setCredentials } from '@/services/authSlice';
import { useGetCurrentUserQuery, useUpdateProfileMutation } from '@/services/api/authApi';
import {
  Box, Typography, Container, Card, CardContent, Avatar,
  TextField, Button, CircularProgress, Snackbar, Alert,
  Divider, Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const { data: profileData, isLoading: profileLoading } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('circlechain_token');
      if (!token) router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (profileData) {
      setDisplayName(profileData.displayName || profileData.name || '');
    } else if (user) {
      setDisplayName(user.displayName || user.name || '');
    }
  }, [profileData, user]);

  const handleSave = async () => {
    try {
      await updateProfile({ displayName }).unwrap();
      setEditing(false);
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update profile. Please try again.', severity: 'error' });
    }
  };

  const activeUser = profileData || user;

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070B0E' }}>
        <CircularProgress sx={{ color: '#00E676' }} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#070B0E', pt: 12, pb: 8 }}>
        <Container maxWidth="sm">
          {/* Profile Card */}
          <Card sx={{ background: 'linear-gradient(135deg, #0D1117, #111827)', border: '1px solid #1a2332', borderRadius: '20px', overflow: 'visible' }}>
            {/* Top Banner */}
            <Box sx={{ height: 100, background: 'linear-gradient(135deg, #0a1628, #0d2040)', borderRadius: '20px 20px 0 0', position: 'relative' }}>
              <Box
                sx={{
                  position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
                  border: '4px solid #0D1117', borderRadius: '50%', backgroundColor: '#0D1117',
                }}
              >
                <Avatar
                  src={activeUser?.avatar}
                  alt={activeUser?.name}
                  sx={{ width: 80, height: 80, border: '3px solid #00E676' }}
                />
              </Box>
            </Box>

            <CardContent sx={{ pt: 7, pb: 4, px: 4, textAlign: 'center' }}>
              <Chip
                label="Google Account"
                size="small"
                sx={{ backgroundColor: 'rgba(0,230,118,0.1)', color: '#00E676', fontSize: '11px', mb: 2 }}
              />
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, mb: 0.5 }}>
                {activeUser?.displayName || activeUser?.name}
              </Typography>
              <Typography sx={{ color: '#9CA3AF', fontSize: '13px', mb: 3 }}>{activeUser?.email}</Typography>

              <Divider sx={{ borderColor: '#1a2332', mb: 3 }} />

              {/* Info Fields */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
                {/* Display Name */}
                <Box>
                  <Typography sx={{ color: '#9CA3AF', fontSize: '12px', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 14 }} /> Display Name
                  </Typography>
                  {editing ? (
                    <TextField
                      fullWidth
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      size="small"
                      autoFocus
                      sx={{ '& .MuiInputBase-input': { color: '#fff' } }}
                    />
                  ) : (
                    <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>
                      {activeUser?.displayName || activeUser?.name}
                    </Typography>
                  )}
                </Box>

                {/* Email */}
                <Box>
                  <Typography sx={{ color: '#9CA3AF', fontSize: '12px', mb: 0.5, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <EmailIcon sx={{ fontSize: 14 }} /> Email Address
                  </Typography>
                  <Typography sx={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>{activeUser?.email}</Typography>
                </Box>

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                  {editing ? (
                    <>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={updating ? <CircularProgress size={16} sx={{ color: '#000' }} /> : <CheckIcon />}
                        onClick={handleSave}
                        disabled={updating}
                        sx={{ backgroundColor: '#00E676', color: '#000', fontWeight: 700 }}
                      >
                        Save Changes
                      </Button>
                      <Button fullWidth variant="outlined" onClick={() => setEditing(false)} sx={{ borderColor: '#1a2332', color: '#9CA3AF' }}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => setEditing(true)}
                        sx={{ borderColor: '#00E676', color: '#00E676' }}
                      >
                        Edit Profile
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        component={Link}
                        href="/dashboard"
                        sx={{ borderColor: '#1a2332', color: '#9CA3AF' }}
                      >
                        Dashboard
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
      <Footer />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
