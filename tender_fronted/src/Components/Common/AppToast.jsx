import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useToast } from '../../Providers/ToastProvider';

export default function AppToast() {
  const { toast, toastMessage } = useToast();

  const handleClose = (e) => {
    toastMessage.clear();
  };


  return (toast && toast.open &&
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={toast.open}
      autoHideDuration={3000}
      onClose={handleClose}
    >
      <Alert
        onClose={handleClose}
        severity={toast.severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {toast.message}
      </Alert>
    </Snackbar>
  );
}
