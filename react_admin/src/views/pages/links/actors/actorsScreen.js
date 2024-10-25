import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import actorActions from 'src/actions/links/actorActions';

function ActorsScreen(props) {    

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Idiomas registrados');
    const { filter, setFilterName, getActors } = props;

    useEffect(() => {
        getActors()
    }, [getActors])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addActor = () => {
        props.addActor();
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Actores encontrados');
        filter.name = '';
        if (!show)
        {
            setSubTitle('Actores registradas');
            filter.name = null;
            getActors();
        }            
    }

    const actorList = (actors) => {
        return actors.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editActor(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deleteActor(row)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </CButton>
                  </CTooltip>
                </div>
            </td>
            <td className="text-nowrap">{row.name}</td>
        </tr>)
    }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>Lista de Actores</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addActor}>
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
                            value={filter.name}
                            onChange={e => setFilterName(e.currentTarget.value)}
                        />
                    </CCol>
                </CRow>}
            </CCardHeader>
            <CCardBody>                
                <p><em>{subTitle} ({props.actors.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Nombre'])}
                                </thead>
                                <tbody>
                                    {actorList(props.actors)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { actor } = state

    return {
        actors: actor.actors,
        filter: actor.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getActors() {
            dispatch(actorActions.getActors());
        },
        addActor() {
            dispatch(actorActions.newActor());
            dispatch(push('/actor/new'));
        },
        editActor(actor) {
            //Inicializa el state
            dispatch(actorActions.newActor());
            //Carga la data
            dispatch(actorActions.editActor(actor));
            dispatch(push(`/actor/${actor.id}`));
        },
        setFilterName(name) {
            //console.log(userName);
            if (name === '')
              name = null;
            //console.log(userName);
            dispatch({ type: types.ACTOR_SET_FILTER, payload: { name } })
            dispatch(actorActions.applyFilter())
        },
        async deleteActor(actor) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ actor.name }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(actorActions.deleteActor(actor));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActorsScreen)