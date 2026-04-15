import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Chip,
  useTheme,
} from '@mui/material';
import {
  FolderCopy as ProjectsIcon,
  People as PeopleIcon,
  CheckCircle as CompletedIcon,
  PlayCircle as ActiveIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import gsap from 'gsap';
import { projectsAPI, membersAPI } from '../services/api';

const StatCard = ({ icon, label, value, color, gradient, delay, index }) => {
  const cardRef = useRef(null);
  const valueRef = useRef(null);

  useEffect(() => {
    // Card entrance
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, delay: 0.3 + index * 0.15, ease: 'power3.out' }
    );

    // Count-up
    const obj = { val: 0 };
    gsap.to(obj, {
      val: value,
      duration: 2,
      delay: 0.6 + index * 0.15,
      ease: 'power2.out',
      onUpdate: () => {
        if (valueRef.current) valueRef.current.textContent = Math.round(obj.val);
      },
    });
  }, [value, index]);

  return (
    <Paper
      ref={cardRef}
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.02)',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? `0 20px 40px rgba(0,0,0,0.4)`
              : `0 20px 40px rgba(0,0,0,0.1)`,
        },
      }}
    >
      {/* Gradient accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: gradient,
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {label}
          </Typography>
          <Typography ref={valueRef} variant="h2" fontWeight={800} sx={{ color, lineHeight: 1.2, mt: 0.5 }}>
            0
          </Typography>
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: gradient,
            opacity: 0.9,
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 0.5 }}>
        <TrendingIcon sx={{ fontSize: 16, color: 'success.main' }} />
        <Typography variant="caption" color="success.main" fontWeight={600}>
          Live data
        </Typography>
      </Box>
    </Paper>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, teamSize: 0 });
  const navigate = useNavigate();
  const theme = useTheme();

  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const btnGroupRef = useRef(null);
  const svgRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projRes, memRes] = await Promise.all([
          projectsAPI.getStats(),
          membersAPI.getCount(),
        ]);
        setStats({
          total: projRes.data.data.total,
          active: projRes.data.data.active,
          completed: projRes.data.data.completed,
          teamSize: memRes.data.data.count,
        });
      } catch {
        // Use defaults
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    // Hero section animations
    tl.fromTo(titleRef.current, { opacity: 0, y: 80 }, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' });
    tl.fromTo(subtitleRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');
    tl.fromTo(btnGroupRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4');

    // SVG path animation
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path');
      paths.forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(path, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' }, '-=1');
      });
    }

    // Floating buttons animation
    if (btnGroupRef.current) {
      gsap.to(btnGroupRef.current, {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    return () => tl.kill();
  }, []);

  const statCards = [
    {
      icon: <ProjectsIcon sx={{ fontSize: 28, color: '#fff' }} />,
      label: 'Total Projects',
      value: stats.total,
      color: '#7c4dff',
      gradient: 'linear-gradient(135deg, #7c4dff, #448aff)',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 28, color: '#fff' }} />,
      label: 'Team Members',
      value: stats.teamSize,
      color: '#00e5ff',
      gradient: 'linear-gradient(135deg, #00e5ff, #0091ea)',
    },
    {
      icon: <ActiveIcon sx={{ fontSize: 28, color: '#fff' }} />,
      label: 'Active Projects',
      value: stats.active,
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    },
    {
      icon: <CompletedIcon sx={{ fontSize: 28, color: '#fff' }} />,
      label: 'Completed',
      value: stats.completed,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      {/* Hero Section */}
      <Box
        ref={heroRef}
        sx={{
          position: 'relative',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          background: theme.palette.mode === 'dark'
            ? 'radial-gradient(ellipse at 30% 20%, rgba(124,77,255,0.12) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(0,229,255,0.08) 0%, transparent 50%)'
            : 'radial-gradient(ellipse at 30% 20%, rgba(108,60,224,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(8,145,178,0.05) 0%, transparent 50%)',
        }}
      >
        {/* Animated SVG background */}
        <Box
          component="svg"
          ref={svgRef}
          viewBox="0 0 800 300"
          sx={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: 900,
            height: 'auto',
            opacity: theme.palette.mode === 'dark' ? 0.15 : 0.08,
            pointerEvents: 'none',
          }}
        >
          <path d="M 50 150 Q 200 50 400 150 Q 600 250 750 150" fill="none" stroke="#7c4dff" strokeWidth="2" />
          <path d="M 50 180 Q 200 80 400 180 Q 600 280 750 180" fill="none" stroke="#00e5ff" strokeWidth="1.5" />
          <path d="M 100 120 Q 250 220 450 120 Q 650 20 800 120" fill="none" stroke="#ff4081" strokeWidth="1" />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
            <Chip
              label="✨ Team Management Portal"
              sx={{
                mb: 3,
                fontWeight: 600,
                background: theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(124,77,255,0.2), rgba(0,229,255,0.15))'
                  : 'linear-gradient(135deg, rgba(108,60,224,0.1), rgba(8,145,178,0.08))',
                border: '1px solid',
                borderColor: 'primary.main',
                color: 'primary.main',
                fontSize: '0.85rem',
                py: 2.5,
                px: 1,
              }}
            />
            <Typography
              ref={titleRef}
              variant="h2"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem' },
                lineHeight: 1.15,
                mb: 2.5,
                background: 'linear-gradient(135deg, #7c4dff 0%, #448aff 40%, #00e5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Build Better Teams,{' '}
              <Box component="span" sx={{ display: { xs: 'block', sm: 'inline' } }}>
                Ship Faster
              </Box>
            </Typography>
            <Typography
              ref={subtitleRef}
              variant="h6"
              color="text.secondary"
              sx={{ fontWeight: 400, lineHeight: 1.6, mb: 4, maxWidth: 520, mx: 'auto' }}
            >
              Manage projects, collaborate with your team, and deliver amazing products — all in one beautiful portal.
            </Typography>
            <Box ref={btnGroupRef} sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowIcon />}
                onClick={() => navigate('/projects')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #7c4dff, #448aff)',
                  boxShadow: '0 8px 30px rgba(124,77,255,0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #651fff, #2979ff)',
                    boxShadow: '0 12px 40px rgba(124,77,255,0.4)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                View Projects
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/members')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    borderColor: 'primary.light',
                    background: 'rgba(124,77,255,0.08)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Manage Team
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mt: { xs: -4, md: -6 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={3} ref={gridRef}>
          {statCards.map((card, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <StatCard {...card} index={i} />
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            {[
              { title: 'Create Project', desc: 'Start a new project and assign team members', path: '/projects', color: '#7c4dff', icon: <ProjectsIcon /> },
              { title: 'Add Team Member', desc: 'Expand your team with new talent', path: '/members', color: '#00e5ff', icon: <PeopleIcon /> },
            ].map((action, i) => {
              const ref = useRef(null);
              useEffect(() => {
                gsap.fromTo(
                  ref.current,
                  { opacity: 0, x: i === 0 ? -50 : 50 },
                  { opacity: 1, x: 0, duration: 0.8, delay: 1.2 + i * 0.2, ease: 'power3.out' }
                );
              }, []);
              return (
                <Grid item xs={12} md={6} key={i}>
                  <Paper
                    ref={ref}
                    elevation={0}
                    onClick={() => navigate(action.path)}
                    sx={{
                      p: 3,
                      borderRadius: 4,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.palette.mode === 'dark'
                          ? '0 12px 30px rgba(0,0,0,0.3)'
                          : '0 12px 30px rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${action.color}22, ${action.color}11)`,
                        color: action.color,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={700}>{action.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{action.desc}</Typography>
                    </Box>
                    <ArrowIcon sx={{ color: 'text.secondary' }} />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
