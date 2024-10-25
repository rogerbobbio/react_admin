import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../types/types';
import moduleActions from 'src/actions/moduleActions';
import CIcon from '@coreui/icons-react';

function ModulesScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Modulos registrados');
    const { filter, setFilterTitle, deleteModule, getModules } = props;

    useEffect(() => {
        getModules()
    }, [getModules])

    const headers = (columns) => {
        return <tr>{columns.map((name, index) => <th key={index} className="text-nowrap text-center">{name}</th>)}</tr>
    }

    const addModule = () => {
        props.addModule();        
    }    

    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Modulos encontrados');
        filter.title = '';
        if (!show)
        {
            setSubTitle('Modulos registrados');
            filter.title = null;
            getModules()
        }
    }

    const moduleList = (modules) => {
        return modules.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editModule(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deleteModule(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.title}</td>
            <td className="text-nowrap">
                <CIcon name={row.icon} />
            </td>
            <td className="text-nowrap">{row.order_no}</td>
        </tr>)
    }

    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Modulos</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addModule}>
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
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.modules.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Titulo', 'Icono', 'Orden'])}
                                </thead>
                                <tbody>
                                    {moduleList(props.modules)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {    
    const { module } = state

    return {
        modules: module.modules,
        filter: module.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getModules() {
            dispatch(moduleActions.getModules());
        },
        addModule() {
            dispatch(moduleActions.newModule())
            dispatch(push('/module/new'))
        },
        editModule(module) {
            //Inicializa el state del modulo
            dispatch(moduleActions.newModule())
            //Carga la data
            dispatch(moduleActions.editModule(module))
            dispatch(push(`/module/${module.id}`))
        },
        setFilterTitle(title) {
            //console.log(userName);
            if (title === '')
              title = null;
            //console.log(userName);
            dispatch({ type: types.MODULE_SET_FILTER, payload: { title } });
            dispatch(moduleActions.applyFilter());
        },
        async deleteModule(module) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ module.title }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(moduleActions.deleteModule(module));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModulesScreen)