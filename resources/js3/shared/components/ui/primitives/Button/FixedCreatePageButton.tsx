import {Link} from "react-router-dom";
import {Button} from '@mui/material'
import PlusIcon from '@/shared/icons/Menu'
import {ButtonProps} from "@mui/material";

interface FixedCreatePageButtonProps extends ButtonProps {
    to:string | Promise<string>
}
export default function FixedCreatePageButton(props:FixedCreatePageButtonProps) {
    const {sx,component,startIcon,...otherProps}=props

    const styled = {
        position: 'fixed',
        bottom:'20px',
        right:'20px',
        ...sx
    }
    return <Button component={Link} sx={styled} startIcon={<PlusIcon/>} {...otherProps}/>
};
