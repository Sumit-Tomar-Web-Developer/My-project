import PropTypes from 'prop-types';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Typography } from '@mui/material';
import { TENDER_FORM_STEPS } from '../../Utils/Constants';
import CustomButton from './CustomButton';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useState } from 'react';
import { ExpandMore } from '@mui/icons-material';


export default function CustomAccordion(props) {
    const panel = TENDER_FORM_STEPS[props.panelIndex];
    const [expanded, setExpanded] = useState(true)

    const handleOnChange = (e) => {
        e.preventDefault();
        if (props.isedit === false) {
            setExpanded(!expanded);
        }
    }

    return (
        <Accordion expanded={expanded} onChange={handleOnChange} disableGutters={true}>
            <AccordionSummary
                expandIcon={props.isedit ? "" : <ExpandMore />}
                aria-controls={panel.name + "-content"}
                id={panel.name + "-header"}
                sx={(theme) => ({ bgcolor: theme.palette.secondary.main })}
            >
                <Typography sx={{ fontSize: "0.9rem", fontWeight: 550 }} >
                    {panel.title}
                </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ marginTop: 1 }}>
                {props.children}
            </AccordionDetails>
            {props.isedit && (
                <AccordionActions sx={{ paddingBottom: 2 }}>
                    {props.panelIndex > 0 &&
                        <CustomButton onClick={(e) => props.handleBackClick(e, props.panelIndex)}
                            variant='contained' color='primary'
                            position="end"
                            startIcon={<ArrowBackIosNewIcon small="size" color="white" />}
                        >
                            Back
                        </CustomButton>
                    }
                    <CustomButton onClick={(e) => props.handleSaveLater(e, props.panelIndex)}
                        variant='contained' color='success'
                        position="end"
                        loading={props.isLoading}
                        endIcon={<SaveAsIcon small="size" color="white" />}
                    >
                        Save & Next
                    </CustomButton>
                </AccordionActions>
            )}
        </Accordion>
    )
}

CustomAccordion.propTypes = {
    isedit: PropTypes.bool.isRequired,
    isLoading: PropTypes.bool.isRequired,
    panelIndex: PropTypes.number.isRequired,
    handleBackClick: PropTypes.func.isRequired,
    handleSaveLater: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired
}