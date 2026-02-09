import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function ErrorPage({ title="Access Denied",message = "You do not have access to this page." }) {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            px={2}
            my={10}
        >
            <LockOutlinedIcon sx={{ fontSize: 100, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
               {title}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
                {message}
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/')}>
                Go to Home
            </Button>
        </Box>
    );
}