import PropTypes from 'prop-types';
import { TextField } from '@mui/material';

export default function CustomTextField(props) {
    const isEdit = props.isedit;

    let textProps = { ...props };
    delete textProps.isedit;


    if (isEdit) {
        return (
            <TextField
                {...textProps}
                size="small"
            >
                {props.children}
            </TextField>
        )
    }
    else {
        textProps = {
            ...textProps,
            required: false,
            slotProps: {
            inputLabel: {
                shrink: true,
            },
            input: {
                color: 'inherit',
            },
            }
        }

        return (
            <TextField disabled variant="standard" {...textProps} size="small"
            sx={(theme) => ({
                "& .Mui-disabled": {
                WebkitTextFillColor: theme.palette.text.disabled,
                },
                "& .MuiInput-input.Mui-disabled": {
                WebkitTextFillColor: theme.palette.text.primary,
                }
            })}
            />
        )
    }
}

CustomTextField.propTypes = {
    isedit: PropTypes.bool.isRequired,
    children: PropTypes.any
}