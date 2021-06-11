import { makeStyles, Paper } from '@material-ui/core';
import React from 'react'

function TrelloCard({ card }) {
    const classes = useStyle();
    return (
        <Paper className={classes.trelloCard}>
            {card.title}
        </Paper>
    )
}

const useStyle = makeStyles(theme => ({
    trelloCard: {
        padding: theme.spacing(1, 1, 1, 2),
        margin: theme.spacing(1)
    },
    titleText: {
        flexGrow: 1,
        fontSize: "1.2rem",
        fontWeight: "bold",
    }
}));

export default TrelloCard
