import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import movieCategoryActions from 'src/actions/links/movieCategoryActions';

function MovieCategoriesScreen(props) {    

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Idiomas registrados');
    const { filter, setFilterDescription, getMovieCategories } = props;

    useEffect(() => {
        getMovieCategories()
    }, [getMovieCategories])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addMovieCategory = () => {        
        props.addMovieCategory();
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Categorias encontrados');
        filter.description = '';
        if (!show)
        {
            setSubTitle('Categorias registradas');
            filter.description = null;
            getMovieCategories();
        }            
    }

    const movieCategoryList = (movieCategories) => {
        return movieCategories.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editMovieCategory(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deleteMovieCategory(row)}>
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
                        <h1>Lista de Categorias</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addMovieCategory}>
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
                <p><em>{subTitle} ({props.movieCategories.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Descripcion'])}
                                </thead>
                                <tbody>
                                    {movieCategoryList(props.movieCategories)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { movieCategory } = state

    return {
        movieCategories: movieCategory.movieCategories,
        filter: movieCategory.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getMovieCategories() {
            dispatch(movieCategoryActions.getMovieCategories());
        },
        addMovieCategory() {
            dispatch(movieCategoryActions.newMovieCategory());
            dispatch(push('/movieCategory/new'));
        },
        editMovieCategory(movieCategory) {
            //Inicializa el state
            dispatch(movieCategoryActions.newMovieCategory());
            //Carga la data
            dispatch(movieCategoryActions.editMovieCategory(movieCategory));
            dispatch(push(`/movieCategory/${movieCategory.id}`));
        },
        setFilterDescription(description) {
            //console.log(userName);
            if (description === '')
              description = null;
            //console.log(userName);
            dispatch({ type: types.MOVIE_CATEGORY_SET_FILTER, payload: { description } })
            dispatch(movieCategoryActions.applyFilter())
        },
        async deleteMovieCategory(movieCategory) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ movieCategory.description }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(movieCategoryActions.deleteMovieCategory(movieCategory))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieCategoriesScreen)