import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import userActions from 'src/actions/userActions';
import { types } from '../../../types/types';


function UsersScreen(props) {
    
    const { filter, setFilterUserName, deleteUser, getUsers } = props;
    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Usuarios registrados');

    useEffect(() => {
        getUsers()
    }, [getUsers])

    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const userList = (users) => {
        return users.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editUser(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deleteUser(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>                    
                </div>
            </td>
            <td className="text-nowrap">{row.userName}</td>
            <td className="text-nowrap">{row.email}</td>
            <td className="text-nowrap">{row.firstName}</td>
            <td className="text-nowrap">{row.lastName}</td>
            <td className="text-nowrap">{row.role_name}</td>
        </tr>)
    }

    const addUser = () => {        
        props.addUser()
    }

    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Usuarios encontrados');
        filter.userName = '';
        if (!show)
        {
            setSubTitle('Usuarios registrados');
            filter.userName = null;
            getUsers()
        }            
      }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Usuarios</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addUser}>
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </CButton>
                            <CButton shape="pill" color="info"  onClick={toggleFilter}>
                                <FontAwesomeIcon icon={faBinoculars} /> Buscar
                            </CButton>
                        </div>
                    </div>
                </CRow>
                <CRow>
                    <CCol md={12}>
                        <hr></hr>
                    </CCol>
                </CRow>
                {showFilter && <CRow>
                    <CCol md={4}>
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="Busqueda por nombre"
                            value={filter.userName}
                            onChange={e => setFilterUserName(e.currentTarget.value)}
                        />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.users.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Nombre de Usuario', 'Email', 'Nombre', 'Apellido', 'Rol'])}
                                </thead>
                                <tbody>
                                    {userList(props.users)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>          
        </>
    )
}

const mapStateToProps = state => {    
    const { user } = state

    return {
        users: user.users,
        filter: user.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUsers() {
            dispatch(userActions.getUsers())
        },
        addUser() {
            dispatch(userActions.newUser())
            dispatch(push('/user/new'))
        },
        editUser(user) {
            dispatch(userActions.newUser())
            dispatch(userActions.editUser(user))
            dispatch(push(`/user/${user.id}`))
        },
        setFilterUserName(userName) {
            //console.log(userName);
            if (userName === '')
              userName = null;
            //console.log(userName);
            dispatch({ type: types.USER_SET_FILTER, payload: { userName } })
            dispatch(userActions.applyFilter())
        },
        async deleteUser(user) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ user.userName }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(userActions.deleteUser(user))
          }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersScreen)