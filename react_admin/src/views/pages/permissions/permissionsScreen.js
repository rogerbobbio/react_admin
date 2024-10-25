import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';
import { FormCheck } from 'react-bootstrap';
import Select from 'react-select';

import { types } from '../../../types/types';
import permissionActions from 'src/actions/permissionActions';
import roleActions from 'src/actions/roleActions';
import moduleActions from 'src/actions/moduleActions';
import menuOptionActions from 'src/actions/menuOptionActions';


function PermissionsScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Permisos registrados');
    const { deletePermission, getPermissions, getRoles, getModules, getScreens,
            filter, setFilterRole, setFilterModule, setFilterScreen,              
            roleOptions, moduleOptions, screenOptions } = props;

    useEffect(() => {
        getPermissions()
        getRoles()
        getModules()
        getScreens()
    }, [getPermissions, getRoles, getModules, getScreens])

    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const addPermission = () => {
        props.addPermission();        
    }

    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Permisos encontrados');        
        if (!show)
        {
            setSubTitle('Permisos registrados');            
            getPermissions()
        }
    }

    const permissionList = (permissions) => {
        return permissions.map((row, index) => <tr key={index}>
          <td>
            <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editPermission(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deletePermission(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
            </div>
          </td>
          <td className="text-nowrap">{row.role_description}</td>
          <td className="text-nowrap">{row.module_description}</td>
          <td className="text-nowrap">{row.screen_title}</td>
          <td className="text-nowrap"><FormCheck readOnly={true} checked={row.access === 1} /></td>
          <td className="text-nowrap"><FormCheck readOnly={true} checked={row.created === 1} /></td>
          <td className="text-nowrap"><FormCheck readOnly={true} checked={row.edit === 1} /></td>
          <td className="text-nowrap"><FormCheck readOnly={true} checked={row.deleted === 1} /></td>
        </tr>)
      }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Permisos</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addPermission}>
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </CButton>
                            <CButton shape="pill" color="info" onClick={toggleFilter}>
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
                        <Select options={roleOptions} value={filter.role} onChange={e => setFilterRole(e)} isClearable />
                    </CCol>
                    <CCol md={4}>
                        <Select options={moduleOptions} value={filter.module} onChange={e => setFilterModule(e)} isClearable />
                    </CCol>
                    <CCol md={4}>
                        <Select options={screenOptions} value={filter.screen} onChange={e => setFilterScreen(e)} isClearable />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.permissions.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Rol', 'Módulo', 'Opción', 'Acceso', 'Crear', 'Editar', 'Borrar'])}
                                </thead>
                                <tbody>
                                    {permissionList(props.permissions)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {    
    const { permission } = state;

    //BEGIN DROP DOWNS =================================================================================================
    const rolesSelector = state => state.role.userRoles
    const moduleSelector = state => state.module.modules
    const screenSelector = state => state.menuOption.menuOptions
    const selectedModuleId = state => state.permission.filter.module ? state.permission.filter.module.value : 0

    const getRoleOptions = createSelector(
      rolesSelector, rows => rows.map(role => ({ value: role.id, label: role.description }))
    )

    const getModuleOptions = createSelector(
      moduleSelector, rows => rows.map(module => ({ value: module.id, label: module.title }))
    )

    const getScreenOptions = createSelector(
      [screenSelector, selectedModuleId], (rows, id) => rows.filter(module => module.module_id === id).map(screen => ({ value: screen.id, label: screen.title }))
    )
    //=================================================================================================

    return {
      permissions: permission.permissions,
      filter: permission.filter,
      roleOptions: getRoleOptions(state),
      moduleOptions: getModuleOptions(state),
      screenOptions: getScreenOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getPermissions() {
            const payload = {
                role: null,
                module: null,
                screen: null,
              }
            dispatch({ type: types.PERMISSION_SET_FILTER, payload });
            dispatch(permissionActions.applyFilter());
        },
        addPermission() {
            dispatch(permissionActions.newPermission());
            dispatch(push('/permission/new'));
        },
        editPermission(permission) {
            //Inicializa el state del modulo
            dispatch(permissionActions.newPermission())
            //Carga la data
            dispatch(permissionActions.editPermission(permission))
            dispatch(push(`/permission/${permission.id}`))
        },

        // GET DATA FOR DROP DOWNS =================================================================================================
        getRoles() {
            dispatch(roleActions.getRoles())
        },
        getModules() {
            dispatch(moduleActions.getModules())
        },
        getScreens() {
            dispatch(menuOptionActions.getMenuOptions())
        },
        // ===========================================================================================================================

        async deletePermission(permission) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: 'Esta apunto de borrar el registro',
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: 'Borrar',
            });
            if (result.isConfirmed)
              dispatch(permissionActions.deletePermission(permission));
        },



        setFilterRole(role) {
            dispatch({ type: types.PERMISSION_SET_FILTER, payload: { role } })
            dispatch(permissionActions.applyFilter())
          },
        setFilterModule(module) {
            dispatch({ type: types.PERMISSION_SET_FILTER, payload: { module, screen: null } })
            dispatch(permissionActions.applyFilter())
          },
        setFilterScreen(screen) {
            dispatch({ type: types.PERMISSION_SET_FILTER, payload: { screen } })
            dispatch(permissionActions.applyFilter())
          },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsScreen)