import { Paper, CssBaseline, makeStyles } from '@material-ui/core';
import React from 'react'
import AddCardorList from './AddCardorList';
import ListTitle from './ListTitle';
import TrelloCard from './TrelloCard';

const TrelloList = ({ list }) => {
    const classes = useStyle();
    return (
        <Paper className={classes.root}>
            <CssBaseline />
            <ListTitle title={list.title} listId={list.id} />
            {
                list.cards.map(card =>
                    <TrelloCard
                        card={card}
                        key={card.id}
                    />
                )
            }
            <AddCardorList
                type="card" listId={list.id}
            />
        </Paper>
    )
}

const useStyle = makeStyles(theme => ({
    root: {
        width: "300px",
        background: "#ebecf0",
        margin: theme.spacing(1)
    }
}));

export default TrelloList