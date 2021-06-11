import { useContext, useState } from 'react'
import { InputBase, makeStyles, Typography } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import contextAPI from '../ContextAPI';

const ListTitle = ({ title, listId }) => {
    const classes = useStyle();
    const [open, setOpen] = useState(true);
    const [newTitle, setNewTitle] = useState(title);
    const { updateListTitle } = useContext(contextAPI);

    const handleBlur = () => {
        // update title to newTitle
        updateListTitle(newTitle, listId);
        setOpen(false);
    };
    return (
        <>
            { open ? (
                <InputBase
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                    fullWidth
                    inputProps={{ className: classes.input }}
                />
            ) : (
                <div className={classes.title}>
                    <Typography className={classes.titleText} onClick={() => setOpen(true)}>
                        {title}
                    </Typography>
                    <MoreHorizIcon />
                </div>
            )}
        </>
    )
}

const useStyle = makeStyles(theme => ({
    title: {
        display: 'flex',
        margin: theme.spacing(1),
    },
    titleText: {
        flexGrow: 1,
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    input: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        margin: theme.spacing(1),
        "&:focus": {
            background: "#ddd"
        }
    }
}));

export default ListTitle
