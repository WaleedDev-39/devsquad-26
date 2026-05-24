import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Visibility,
  VisibilityOff,
  RocketLaunch as RocketIcon,
} from '@mui/icons-material';
import gsap from 'gsap';
import { authAPI } from '../services/api';

export default function Login() {
  const [tab, setTab] = useState(0); // 0 = login, 1 = register
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const formRef = useRef(null);
  const fieldsRef = useRef([]);
  const btnRef = useRef(null);
  const bgOrbs = useRef([]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
      return;
    }

    const tl = gsap.timeline();

    // Animate background orbs
    bgOrbs.current.forEach((orb, i) => {
      gsap.to(orb, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: 4 + i,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Logo animation
    tl.fromTo(logoRef.current, { opacity: 0, scale: 0.5, rotate: -180 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.8, ease: 'back.out(1.7)' });

    // Form card slide up
    tl.fromTo(formRef.current, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out' }, '-=0.3');

    // Stagger fields
    tl.fromTo(
      fieldsRef.current.filter(Boolean),
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' },
      '-=0.3'
    );

    // Button pop
    tl.fromTo(btnRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');

    return () => tl.kill();
  }, []);

  // Re-animate fields on tab switch
  useEffect(() => {
    gsap.fromTo(
      fieldsRef.current.filter(Boolean),
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power3.out' }
    );
  }, [tab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = tab === 0
        ? await authAPI.login({ email: form.email, password: form.password })
        : await authAPI.register(form);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Transition out
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => navigate('/'),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
      // Shake animation on error
      gsap.fromTo(formRef.current, { x: -10 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at 20% 50%, rgba(124,77,255,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.1) 0%, transparent 50%), #0a0e1a'
            : 'radial-gradient(ellipse at 20% 50%, rgba(108,60,224,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(8,145,178,0.08) 0%, transparent 50%), #f0f4f8',
      }}
    >
      {/* Floating background orbs */}
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          ref={(el) => (bgOrbs.current[i] = el)}
          sx={{
            position: 'absolute',
            width: [200, 300, 250][i],
            height: [200, 300, 250][i],
            borderRadius: '50%',
            background: [
              'radial-gradient(circle, rgba(124,77,255,0.15), transparent)',
              'radial-gradient(circle, rgba(0,229,255,0.1), transparent)',
              'radial-gradient(circle, rgba(255,64,129,0.08), transparent)',
            ][i],
            top: ['10%', '60%', '30%'][i],
            left: ['10%', '70%', '50%'][i],
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
      ))}

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box ref={logoRef} sx={{ textAlign: 'center', mb: 4 }}>
          <RocketIcon
            sx={{
              fontSize: 56,
              color: 'primary.main',
              filter: 'drop-shadow(0 0 20px rgba(124, 77, 255, 0.5))',
              mb: 1,
            }}
          />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #7c4dff, #00e5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TeamForge
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage teams. Ship projects. Build amazing things.
          </Typography>
        </Box>

        {/* Form Card */}
        <Paper
          ref={formRef}
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, rgba(17,24,39,0.95), rgba(30,41,59,0.8))'
                : 'rgba(255,255,255,0.95)',
            border: (theme) =>
              theme.palette.mode === 'dark'
                ? '1px solid rgba(124,77,255,0.2)'
                : '1px solid rgba(0,0,0,0.06)',
            backdropFilter: 'blur(20px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? '0 20px 60px rgba(0,0,0,0.5)'
                : '0 20px 60px rgba(0,0,0,0.08)',
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(''); }}
            variant="fullWidth"
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 3,
              },
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #7c4dff, #00e5ff)',
              },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField
                ref={(el) => (fieldsRef.current[0] = el)}
                fullWidth
                label="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            <TextField
              ref={(el) => (fieldsRef.current[tab === 1 ? 1 : 0] = el)}
              fullWidth
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              sx={{ mb: 2.5 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              ref={(el) => (fieldsRef.current[tab === 1 ? 2 : 1] = el)}
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              ref={btnRef}
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: '1.05rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #7c4dff 0%, #448aff 50%, #00e5ff 100%)',
                backgroundSize: '200% 100%',
                transition: 'background-position 0.5s ease',
                '&:hover': {
                  backgroundPosition: '100% 0',
                  background: 'linear-gradient(135deg, #7c4dff 0%, #448aff 50%, #00e5ff 100%)',
                  backgroundSize: '200% 100%',
                  backgroundPositionX: '100%',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : tab === 0 ? 'Sign In' : 'Create Account'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
