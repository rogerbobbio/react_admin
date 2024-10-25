import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';
import Select from 'react-select';

import { types } from '../../../types/types';
import menuOptionActions from 'src/actions/menuOptionActions';
import moduleActions from 'src/actions/moduleActions';


function MenuOptionScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Opciones de menu registradas');
    const { filter, setFilterTitle, setFilterModule,
            deleteMenuOption, getMenuOptions, getModules, moduleOptions } = props;


    useEffect(() => {
        getMenuOptions()
        getModules()
    }, [getMenuOptions])
    
    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const addOption = () => {
        props.addMenuOption();  
    }    

    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Opciones de menu encontradas');
        filter.title = '';
        if (!show)
        {
            setSubTitle('Opciones de menu registrados');
            filter.title = null;
            getMenuOptions()
        }
    }
    
    const menuOptionList = (menuOptions) => {
        return menuOptions.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editMenuOption(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deleteMenuOption(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.module_description}</td>
            <td className="text-nowrap">{row.title}</td>
            <td className="text-nowrap">{row.url}</td>
            <td className="text-nowrap">{row.order_no}</td>
        </tr>)
    }

    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Opciones de Menu</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addOption}>
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
                            placeholder="Busqueda por titulo"
                            value={filter.title}
                            onChange={e => setFilterTitle(e.currentTarget.value)}
                        />
                    </CCol>
                    <CCol md={4}>
                        <Select options={moduleOptions} value={filter.module} onChange={e => setFilterModule(e)} isClearable />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.menuOptions.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Modulo', 'Titulo', 'Url', 'Orden'])}
                                </thead>
                                <tbody>
                                    {menuOptionList(props.menuOptions)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {    
    const { menuOption } = state

    const moduleSelector = state => state.module.modules

    const getModuleOptions = createSelector(
        moduleSelector, rows => rows.map(module => ({ value: module.id, label: module.title }))
      )

    return {
        menuOptions: menuOption.menuOptions,
        filter: menuOption.filter,
        moduleOptions: getModuleOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMenuOptions() {
            dispatch(menuOptionActions.getMenuOptions());
        },
        getModules() {
            dispatch(moduleActions.getModules())
        },
        addMenuOption() {
            dispatch(menuOptionActions.newMenuOption())
            dispatch(push('/menuOption/new'))
        },
        editMenuOption(menuOption) {
            //Inicializa el state del modulo
            dispatch(menuOptionActions.newMenuOption())
            //Carga la data
            dispatch(menuOptionActions.editMenuOption(menuOption))
            dispatch(push(`/menuOption/${menuOption.id}`))
        },        
        async deleteMenuOption(menuOption) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ menuOption.title }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(menuOptionActions.deleteMenuOption(menuOption));
        },

        setFilterModule(module) {
            dispatch({ type: types.MENU_OPT_SET_FILTER, payload: { module } })
            dispatch(menuOptionActions.applyFilter())
        },
        setFilterTitle(title) {            
            if (title === '')
              title = null;
            dispatch({ type: types.MENU_OPT_SET_FILTER, payload: { title } });
            dispatch(menuOptionActions.applyFilter());
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuOptionScreen)