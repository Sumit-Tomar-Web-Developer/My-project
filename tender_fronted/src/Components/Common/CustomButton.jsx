import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

export default function CustomButton(props) {

    return (
        <Button
            loadingPosition={props.position ? props.position : 'start'}
            variant="contained"
            {...props}
           
        >
            <span>{props.children}</span>
        </Button>
    )
}

CustomButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    position: PropTypes.string,
    children: PropTypes.string
}