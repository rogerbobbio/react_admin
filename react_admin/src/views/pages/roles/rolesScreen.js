import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import roleActions from 'src/actions/roleActions';
import { types } from '../../../types/types';

function RolesScreen(props) {    

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Roles registrados');
    const { filter, setFilterDescription, deleteRole, getRoles } = props;

    useEffect(() => {
        getRoles()
    }, [getRoles])

    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const addRole = () => {        
        props.addRole()
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Roles encontrados');
        filter.description = '';
        if (!show)
        {
            setSubTitle('Roles registrados');
            filter.description = null;
            getRoles()
        }            
    }

    const roleList = (roles) => {
        return roles.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editRole(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deleteRole(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>                    
                </div>
            </td>
            <td className="text-nowrap">{row.description}</td>
        </tr>)
    }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Roles</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addRole}>
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
                            placeholder="Busqueda por descripcion"
                            value={filter.description}
                            onChange={e => setFilterDescription(e.currentTarget.value)}
                        />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.userRoles.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Descripcion'])}
                                </thead>
                                <tbody>
                                    {roleList(props.userRoles)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { role } = state

    return {
        userRoles: role.userRoles,
        filter: role.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getRoles() {
            dispatch(roleActions.getRoles());
        },
        addRole() {
            dispatch(roleActions.newRole());
            dispatch(push('/role/new'));
        },
        editRole(role) {
            //Inicializa el state del rol
            dispatch(roleActions.newRole())
            //Carga la data
            dispatch(roleActions.editRole(role))
            dispatch(push(`/role/${role.id}`))
        },
        setFilterDescription(description) {
            //console.log(userName);
            if (description === '')
              description = null;
            //console.log(userName);
            dispatch({ type: types.ROLE_SET_FILTER, payload: { description } })
            dispatch(roleActions.applyFilter())
        },
        async deleteRole(role) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ role.description }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(roleActions.deleteRole(role))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RolesScreen)