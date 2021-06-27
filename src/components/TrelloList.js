import { Paper, CssBaseline, makeStyles } from '@material-ui/core';
import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd';
import AddCardorList from './AddCardorList';
import ListTitle from './ListTitle';
import TrelloCard from './TrelloCard';

const TrelloList = ({ list, index }) => {
    const classes = useStyle();
    // console.table({ table: "TReloList", list, index });
    return (
        <Draggable draggableId={list.id} index={index}>
            {
                (provided) => (
                    <div {...provided.draggableProps} ref={provided.innerRef}>
                        <Paper className={classes.root} {...provided.dragHandleProps}>
                            <CssBaseline />
                            <ListTitle title={list.title} listId={list.id} />
                            <Droppable droppableId={list.id}>
                                {
                                    (provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {
                                                list.cards.map((card, index) => (
                                                    <TrelloCard
                                                        card={card}
                                                        key={card.id}
                                                        index={index}
                                                    />
                                                ))
                                            }
                                            {provided.placeholder}
                                        </div>
                                    )
                                }
                            </Droppable>
                            <AddCardorList
                                type="card" listId={list.id} index={index}
                            />
                        </Paper>
                    </div>
                )
            }
        </Draggable>
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