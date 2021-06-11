import background_image from './images/markus-spiske-unsplash.jpg';
import { makeStyles } from '@material-ui/core';
import TrelloList from './components/TrelloList';
import AddCardorList from './components/AddCardorList';
import mockData from './mockData'
import { useState } from 'react';
import ContextAPI from './ContextAPI';
import uuid from 'react-uuid';

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
    })
    console.log("Auiq yellegue", title, listId, newCardID);
  };
  const addList = (title) => {
    // const newListId = uuid();
    // setData({
    //   listIds: [...data, newListId]
    // })
  };
  return (
    <ContextAPI.Provider value={{ updateListTitle, addCard, addList }}>
      <div className={classes.root}>
        <div className={classes.container}>
          {
            data.listIds.map(listId => {
              // js
              const list = data.lists[listId]
              return <TrelloList
                list={list}
                key={listId}
              />
            })
          }
          <div>
            <AddCardorList
              type="list"
            />
          </div>
        </div>
      </div>
    </ContextAPI.Provider>
  );
}

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    minheight: "100vh",
    overflowY: "auto",   // scroll permanente
    backgroundImage: `url(${background_image})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat"
  },
  container: {
    display: 'flex',    // horizontal
  }
}));

export default App;
