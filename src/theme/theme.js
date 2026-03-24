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
      primary: '#1F2937',   // Equivalente a text-gray-800
      secondary: '#374151', // Equivalente a text-gray-700
    },
    // Grises utilizados frecuentemente en la interfaz (labels, bordes, disables)
    grey: {
      100: '#F3F4F6', // bg-gray-100
      400: '#9CA3AF', // border-gray-400
      700: '#374151', // text-gray-700
      800: '#1F2937', // text-gray-800
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
    h4: { fontWeight: 700, color: '#1F2937', fontSize: '1.5rem', marginBottom: '1.5rem' }, // text-2xl font-bold text-gray-800 mb-6
    h5: { fontWeight: 600, letterSpacing: 0.5, color: '#1F2937' },
    h6: { fontWeight: 600, color: '#1F2937' },
    subtitle1: { fontWeight: 600, color: '#374151' },
    subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
    body2: { fontSize: '0.875rem' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)', // Equivalente a shadow-md
          border: '1px solid #E5E7EB',
          padding: '24px 32px', // px-8 pt-6 pb-8
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 24px', // py-2 px-6
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)', // shadow
          transition: 'all 0.2s ease-in-out',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#0D47A1', // hover:bg-blue-700
          }
        },
        outlined: {
          borderColor: '#9CA3AF', // border border-gray-400
          color: '#1F2937', // text-gray-800
          backgroundColor: '#FFFFFF', // bg-white
          '&:hover': {
            backgroundColor: '#F3F4F6', // hover:bg-gray-100
            borderColor: '#9CA3AF',
          }
        }
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#374151', // text-gray-700
          fontWeight: 700,  // font-bold
          fontSize: '0.875rem', // text-sm
          marginBottom: '8px', // mb-2
          position: 'relative',
          transform: 'none', // Quita la animación flotante por defecto de MUI si prefieres estilo estático
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // bg-white
          borderRadius: '0.375rem', // rounded
          '&.Mui-disabled': {
            backgroundColor: '#F3F4F6', // isEditMode ? 'bg-gray-100' : ''
          }
        },
        input: {
          padding: '8px 12px', // py-2 px-3
          color: '#374151', // text-gray-700
          height: 'auto',
        }
      }
    },
  },
});

export default theme;