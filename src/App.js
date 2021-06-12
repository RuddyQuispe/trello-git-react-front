import { makeStyles } from '@material-ui/core';
import TrelloList from './components/TrelloList';
import AddCardorList from './components/AddCardorList';
import mockData from './mockData'
import { useState } from 'react';
import ContextAPI from './ContextAPI';
import uuid from 'react-uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

function App() {
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

  const addCard = (title, listId) => {
    // new uuid this card
    let newCardID = uuid();
    // create new card
    const newCard = {
      id: newCardID,
      title,
    };
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
  const addList = (title) => {
    const newListId = uuid();
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
  };

  const onDragEnd = (result) => {
    // console.table([result]);
    let { destination, destination: { droppableId: destdorppableId, index: destIndex }, source: { droppableId: sourcedroppableId, index: sourceIndex }, draggableId, type } = result;
    console.table([
      {
        sourcedroppableId,
        destdorppableId,
        draggableId
      }
    ]);
    console.table([
      {
        type,
        sourceIndex,
        destIndex
      }
    ]);
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
    </div>
  );
}

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  container: {
    display: 'flex',    // horizontal
  }
}));

export default App;
