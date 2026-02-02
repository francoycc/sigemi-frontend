import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0', // Azul Corporativo (Deep Blue)
      light: '#E3F2FD', // Azul muy suave para fondos de selección
      dark: '#0D47A1',
    },
    secondary: {
      main: '#ED6C02', // Naranja Industrial (Alertas)
    },
    background: {
      default: '#F5F5F5', // Gris industrial claro
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1A2027',
      secondary: '#616161',
    },
    success: {
        main: '#2E7D32',
    },
    warning: {
        main: '#ED6C02',
    },
    error: {
        main: '#D32F2F',
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600, letterSpacing: 0.5 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
    body2: { fontSize: '0.875rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.05)', // Sombra técnica sutil
          border: '1px solid #E0E0E0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;