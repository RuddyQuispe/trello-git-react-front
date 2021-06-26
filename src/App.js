import { Button, TextField, makeStyles, Modal, Backdrop, Fade } from '@material-ui/core';
import { Info, Refresh } from '@material-ui/icons';
import TrelloList from './components/TrelloList';
import AddCardorList from './components/AddCardorList';
import mockData from './mockData'
import React, { useState } from 'react';
import ContextAPI from './ContextAPI';
import uuid from 'react-uuid';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import axios from 'axios';

function App() {
  const hostServer = `http://trello-git-rest-api.herokuapp.com`;
  const classes = useStyle();
  const [data, setData] = useState(mockData);
  const [ownerRepository, setOwnerRepository] = useState("");
  const [nameRepository, setNameRepository] = useState("");
  const [logRepo, setLogRepo] = useState([]);
  const updateListTitle = (updatedTitle, listId) => {
    //actualiza el titulo de la lista
    // let list = data.lists[listId];
    // list.title = updatedTitle;
    // setData({
    //   ...data,
    //   lists: {
    //     ...data.lists,
    //     [listId]: list
    //   }
    // });
  };

  const addCard = async (title, listId) => {
    // new uuid this card
    let newCardID = uuid();
    // create new card
    let result = await axios.post(`${hostServer}/api/card/create`, {
      listId,
      id: newCardID,
      title
    });
    if (result.status === 200) {
      let response = await axios.post(`${hostServer}/api/card/rearrange`, {
        user: ownerRepository,
        repository: nameRepository
      });
      setData(response.data);
      alert("success");
    } else {
      alert("error to create card")
    }
  };
  const addList = async (title) => {
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
    let result = await axios.post(`${hostServer}/api/list/create`, {
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
    if (ownerRepository !== "" || nameRepository !== "") {
      let response = await axios.post(`${hostServer}/api/card/rearrange`, {
        user: ownerRepository,
        repository: nameRepository
      });
      setData(response.data);
    } else {
      alert("input owner repository and name repository");
    }
  };

  // modal
  const [open, setOpen] = React.useState(false);

  const handleOpen = async () => {
    if (ownerRepository !== "" || nameRepository !== "") {
      let response = await axios.get(`${hostServer}/api/git/log/${ownerRepository}/${nameRepository}`);
      console.log(response.data);
      setLogRepo(response.data);
      setOpen(true);
    } else {
      alert("input owner repository and name repository");
    }
  };

  const handleClose = () => {
    setOpen(false);
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
        <TextField
          id="standard-basic"
          label="Repository Owner"
          onChange={(e) => {
            console.log(ownerRepository);
            setOwnerRepository(e.target.value);
          }}
        />
        <TextField
          id="standard-basic"
          label="Repository Name"
          onChange={(e) => {
            console.log(nameRepository);
            setNameRepository(e.target.value);
          }}
        />
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
        <Button
          variant="contained"
          color="secondary"
          size="large"
          className={classes.button}
          startIcon={<Info />}
          onClick={handleOpen}
        >
          See Commits
        </Button>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h2 id="spring-modal-title">Git Log</h2>
              {
                logRepo.map(function (object, i) {
                  return <p>
                    {object.commit.message}
                  </p>
                })
              }
            </div>
          </Fade>
        </Modal>
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
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default App;
