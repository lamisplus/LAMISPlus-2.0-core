import axios from "axios";
import { url as baseUrl } from "./../../../api";
import React, { useEffect, useState } from "react";
import MaterialTable from "material-table";
import {Link, useHistory} from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
// import { Menu, MenuList, MenuButton, MenuItem } from "@reach/menu-button";
// import { MdDeleteForever, MdModeEdit } from "react-icons/md";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import MatButton from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";
import { TiArrowBack } from 'react-icons/ti'
import PageTitle from "../../layouts/PageTitle";
import {Card, CardContent} from "@material-ui/core";
import AddBiometricDevice from "./AddBiometric";
import EditBiometric from './EditBiometric';

import "@reach/menu-button/styles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-dual-listbox/lib/react-dual-listbox.css";
import "react-toastify/dist/ReactToastify.css";
import "react-widgets/dist/css/react-widgets.css";
import {  Modal } from "react-bootstrap";
import { Icon, Label} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { forwardRef } from 'react';
import { Button} from "react-bootstrap";
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles((theme) => ({
    card: {
        margin: theme.spacing(20),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
}));



const BiometricList = (props) => {
    let history = useHistory();
    const [collectModal, setcollectModal] = useState([])
    const classes = useStyles();
    const [addNewDeviceModal, setAddNewDeviceModal] = useState(false) //New Device   Modal
    const togglesetAddNewDeviceModal = () => setAddNewDeviceModal(!addNewDeviceModal)
    const [editDeviceModal, setEditDeviceModal] = useState(false) //Edit Module Menu  Modal
    const togglesetEditDeviceModal = () => setEditDeviceModal(!editDeviceModal)
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState(false);

    useEffect(() => {
        //loadModuleMenus()
    }, []); //componentDidMount to get module menus
    //Method to load module menus
    // const loadModuleMenus =()=>{
    //     const onSuccess = () => {
    //         setLoading(false)
    //     }
    //     const onError = () => {}
    //     props.getMenus(onSuccess,onError );
    // }

    const deleteModal = (id, name) => {
        // menuId = id;
        // menuName= name
        setModal(!modal);

    };

    const onDelete = (id) => {
        const onSuccess = () => {
            setModal(false)
            //loadModuleMenus()
        };
        const onError = () => {
            toast.error("Something went wrong");
            //return;
        };
        //props.deleteModuleMenu(id, onSuccess,onError);
    };
    const loadNewDeviceModal = (row) => {
        setAddNewDeviceModal(!addNewDeviceModal)
    }
    const editDevice = (row) => {
        setcollectModal({...collectModal, ...row});
        setEditDeviceModal(!editDeviceModal)
    }


    return (
        <div>
            <ToastContainer autoClose={3000} hideProgressBar />
            <PageTitle activeMenu="Biometric List" motherMenu="Biometric Setup " />

            <Card className={classes.cardBottom}>
                <CardContent>
                        <MatButton
                            variant="contained"
                            color="primary"
                            className=" float-end ms-2"
                            startIcon={<FaPlus size="10"/>}
                            onClick={()=>loadNewDeviceModal()}
                        >
                            <span style={{ textTransform: "capitalize" }}>New </span>
                            &nbsp;&nbsp;
                            <span style={{ textTransform: "lowercase" }}> Device</span>
                        </MatButton>

                    <br />

                    <br />
            <MaterialTable
                icons={tableIcons}
                title="Biometric List"
                columns={[
                    //{ title: "Id", field: "id", filtering: false },
                    { title: "Name", field: "name" },
                    { title: "URL", field: "url", filtering: false },
                    { title: "Type", field: "type", filtering: false },
                    { title: "Status", field: "status", filtering: false },

                    { title: "Actions", field: "actions", filtering: false },
                ]}
                isLoading={loading}
                data={[].map((row) => ({
                    //id: row.id,
                    name: row.name,
                    url: row.url,
                    type: row.type,
                    status: row.subs ? row.subs.length : "none",

                    actions: (
                        <div>
                           
                            <Label as='a' color='blue' className="ms-1" size='mini' onClick={() =>  editDevice(row)}>
                                <Icon name='pencil' /> Edit
                            </Label>

                            <Label as='a' color='red' onClick={() =>  deleteModal(row.id, row.name)}  size='mini'>
                                <Icon name='trash' /> Delete
                            </Label>


                        </div>
                    ),
                }))}
                options={{
                    headerStyle: {

                        color: "#000",
                    },

                    searchFieldStyle: {
                        width: "150%",
                        margingLeft: "150px",
                    },
                    filtering: false,
                    exportButton: false,
                    searchFieldAlignment: "left",
                }}
            />
                </CardContent>
            </Card>
            <Modal show={modal} >

                <Modal.Header>
                    <Modal.Title>Delete Menu</Modal.Title>
                    <Button
                        variant=""
                        className="btn-close"
                        onClick={() => setModal(false)}
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete Device   <b>{""}</b></p>
                    <br/>
                    <MatButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="ms-2"
                        startIcon={<SaveIcon />}

                        onClick={() => onDelete()}
                    >
                        Yes
                    </MatButton>
                    <MatButton
                        variant="contained"
                        className={classes.button }
                        startIcon={<CancelIcon />}
                        onClick={() => setModal(false)}
                    >
                    <span style={{ textTransform: "capitalize" }}>
                      Cancel
                    </span>
                    </MatButton>
                </Modal.Body>

            </Modal>
            <AddBiometricDevice modalstatus={addNewDeviceModal} togglestatus={togglesetAddNewDeviceModal}   />
            <EditBiometric modalstatus={editDeviceModal} togglestatus={togglesetEditDeviceModal} datasample={collectModal}  />
        </div>
    );
};



export default BiometricList;
