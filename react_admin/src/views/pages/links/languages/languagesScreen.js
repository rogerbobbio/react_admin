import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import languageActions from 'src/actions/links/languageActions';

function LanguagesScreen(props) {    

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Idiomas registrados');
    const { filter, setFilterDescription, deleteLanguage, getLanguages } = props;

    useEffect(() => {
        getLanguages()
    }, [getLanguages])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addLanguage = () => {        
        props.addLanguage()
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Idiomas encontrados');
        filter.description = '';
        if (!show)
        {
            setSubTitle('Idiomas registrados');
            filter.description = null;
            getLanguages();
        }            
    }

    const languageList = (languages) => {
        return languages.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editLanguage(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => deleteLanguage(row)}>
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
                        <h1>Lista de Idiomas</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addLanguage}>
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
                <p><em>{subTitle} ({props.languages.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Descripcion'])}
                                </thead>
                                <tbody>
                                    {languageList(props.languages)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { language } = state

    return {
        languages: language.languages,
        filter: language.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getLanguages() {
            dispatch(languageActions.getLanguages());
        },
        addLanguage() {
            dispatch(languageActions.newLanguage());
            dispatch(push('/language/new'));
        },
        editLanguage(language) {
            //Inicializa el state del language
            dispatch(languageActions.newLanguage());
            //Carga la data
            dispatch(languageActions.editLanguage(language));
            dispatch(push(`/language/${language.id}`));
        },
        setFilterDescription(description) {
            //console.log(userName);
            if (description === '')
              description = null;
            //console.log(userName);
            dispatch({ type: types.LANGUAGE_SET_FILTER, payload: { description } })
            dispatch(languageActions.applyFilter())
        },
        async deleteLanguage(language) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ language.description }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(languageActions.deleteLanguage(language))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LanguagesScreen)