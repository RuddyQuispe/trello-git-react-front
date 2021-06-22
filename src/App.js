import { Button, makeStyles } from '@material-ui/core';
import { Refresh } from '@material-ui/icons';
import TrelloList from './components/TrelloList';
import AddCardorList from './components/AddCardorList';
import mockData from './mockData'
import React, { useState } from 'react';
import ContextAPI from './ContextAPI';
import uuid from 'react-uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';

let flag = false;

function start() {
  if (!flag) {
    console.log("objert");
    flag = true;
  }
}

function App() {
  start();
  const classes = useStyle();
  const [data, setData] = useState(mockData);
  const updateListTitle = (updatedTitle, listId) => {
    const list = data.lists[listId];
    list.title = updatedTitle;
    setData({
      ...data,
      lists: {
        ...data.lists,
        [listId]: list
      }
    });
  };

  const addCard = async (title, listId) => {
    // new uuid this card
    let newCardID = uuid();
    // create new card
    const newCard = {
      listId,
      id: newCardID,
      title,
    };
    let result = await axios.post('http://localhost:5000/api/card/create', {
      listId,
      id: newCardID,
      title
    });
    if (result.status === 200) {
      alert("success");
    } else {
      alert("error to create card")
    }
    // assign new card to list
    const list = data.lists[listId];
    list.cards = [...list.cards, newCard];
    setData({
      ...data,
      lists: {
        ...data.lists,
        [listId]: list
      }
    });
  };
  const addList = async (title) => {
    const newListId = uuid();
    console.log({
      listIds: [...data.listIds, newListId],
      lists: {
        ...data.lists,
        [newListId]: {
          id: newListId,
          title,
          cards: []
        }
      }
    });
    setData({
      listIds: [...data.listIds, newListId],
      lists: {
        ...data.lists,
        [newListId]: {
          id: newListId,
          title,
          cards: []
        }
      }
    });
    let result = await axios.post('http://localhost:5000/api/list/create', {
      listId: newListId,
      title,
      cards: []
    });
    alert(result.data.status);
  };

  const onDragEnd = (result) => {
    // console.table([result]);
    let { destination, destination: { droppableId: destdorppableId, index: destIndex }, source: { droppableId: sourcedroppableId, index: sourceIndex }, draggableId, type } = result;
    if (!destination) {
      return;
    }
    if (type === "list") {
      let newListIds = data.listIds;
      // newListIds.splice(data.listIds.indexOf(sourceIndex), 1);
      // newListIds.splice(data.listIds.indexOf(destIndex), 0, draggableId);
      newListIds.splice(sourceIndex, 1);
      newListIds.splice(destIndex, 0, draggableId);
      return;
    }
    let sourceList = data.lists[sourcedroppableId];
    let destinationList = data.lists[destdorppableId];
    let draggingCard = sourceList.cards.filter((card) => card.id === draggableId)[0];
    // si va a intercambiar solamente el orden, no de lista
    if (sourcedroppableId === destdorppableId) {
      // utilizaremos splice para intercmbia los indices
      sourceList.cards.splice(sourceIndex, 1);
      destinationList.cards.splice(destIndex, 0, draggingCard)
      // actualizaremos setData con los nuevos indices
      setData({
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: destinationList
        }
      })
    } else {
      // estamos intercambiando entre una a otra lista
      sourceList.cards.splice(sourceIndex, 1);
      destinationList.cards.splice(destIndex, 0, draggingCard);
      setData({
        ...data,
        lists: {
          ...data.lists,
          [sourceList.id]: sourceList,
          [destinationList.id]: destinationList,
        }
      })
    }
  };

  const initializeTrello = async () => {
    let response = await axios.get('http://localhost:5000/api/list/all');
    setData(response.data);
  };

  return (
    <div className={classes.root}>
      <ContextAPI.Provider value={{ updateListTitle, addCard, addList }}>
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="123456" type="list" direction="horizontal">
              {
                (provided) => (
                  <div className={classes.container} ref={provided.innerRef} {...provided.droppableProps}>
                    {
                      data.listIds.map((listId, index) => {
                        // js
                        const list = data.lists[listId]
                        return <TrelloList
                          list={list}
                          key={listId}
                          index={index}
                        />
                      })
                    }
                    <div>
                      <AddCardorList
                        type="list"
                      />
                    </div>
                    {provided.placeholder}
                  </div>
                )
              }
            </Droppable>
          </DragDropContext>
        </div>
      </ContextAPI.Provider>
      <div className={classes.left}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.button}
          startIcon={<Refresh />}
          onClick={initializeTrello}
        >
          Refresh Lists
        </Button>
      </div>
    </div>
  );
}

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  container: {
    display: 'flex',    // horizontal
  },
  left: {
    position: 'absolute',
    right: '10%',
    bottom: '10%'
  }
}));

export default App;
