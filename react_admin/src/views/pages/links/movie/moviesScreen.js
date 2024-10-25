import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip, CDataTable } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faDatabase, faTrashRestoreAlt   } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';
import Select from 'react-select';
import { createSelector } from 'reselect';
import { FormCheck, FormLabel } from 'react-bootstrap';

import { types } from '../../../../types/types';
import movieActions from 'src/actions/links/movieActions';
import movieCategoryActions from 'src/actions/links/movieCategoryActions';
import languageActions from 'src/actions/links/languageActions';
import actorActions from 'src/actions/links/actorActions';

function MoviesScreen(props) {    
    
    const { filter, 
            getMovies, getMovieCategories, getLanguages, getActors,              
            movieCategoryOptions, languageOptions, actorOptions, booleanOptions  } = props;

    useEffect(() => {
        getMovies()
        getMovieCategories()
        getLanguages()
        getActors()
    }, [getMovies, getMovieCategories, getLanguages, getActors])

    const headers = ['Actions', 'Link','Ranking','ranking','category_description', 'Old', 'actor_name', 
                     'language_description','Subtitle', 'Converting', 'Pending','Date'];

    const addMovie = () => {
        props.addMovie();
    }

    const allMovies = () => {
        props.getAllMovies();
    }

    const resetFilters = () => {
        props.clearAllFilters('','', null,null,null,null);
    }
    
    return (
        <>
          <CCard>
            <CCardHeader>
                <CRow>                    
                    <div className="col">
                        <h1>Lista de Links</h1>
                        {/* <pre>
                            {JSON.stringify(filter, null, 2)}
                        </pre> */}
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addMovie}>
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={allMovies}>
                                <FontAwesomeIcon icon={faDatabase} /> Todos
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={resetFilters}>
                                <FontAwesomeIcon icon={faTrashRestoreAlt} /> Reseteo Filtros
                            </CButton>
                        </div>
                    </div>
                </CRow>
                <CRow>
                    <CCol md={12}>
                        <hr></hr>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol md={4}>
                        <FormLabel>Descripcion</FormLabel>
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="Busqueda por descripcion"
                            value={filter.description}
                            onChange={e => props.setFilterDescription(e.currentTarget.value)}
                        />
                    </CCol>
                    <CCol md={4}>
                        <FormLabel>Url</FormLabel>
                        <input 
                            className="form-control"
                            type="text"
                            placeholder="Busqueda por Url"
                            value={filter.link}
                            onChange={e => props.setFilterLink(e.currentTarget.value)}
                        />
                    </CCol>
                    <CCol md={4}>
                        <FormLabel>Categorias</FormLabel>
                        <Select options={movieCategoryOptions} value={filter.category} onChange={e => props.setFilterMovieCategory(e)} isClearable />
                    </CCol>
                    <CCol md={4}>
                        <FormLabel>Idioma</FormLabel>
                        <Select options={languageOptions} value={filter.language} onChange={e => props.setFilterLanguage(e)} isClearable />
                    </CCol>
                    <CCol md={4}>
                        <FormLabel>Actor</FormLabel>
                        <Select options={actorOptions} value={filter.actor} onChange={e => props.setFilterActor(e)} isClearable />
                    </CCol>
                    <CCol md={4}>
                        <FormLabel>Converting</FormLabel>
                        <Select options={booleanOptions} value={filter.converting} onChange={e => props.setFilterBoolean(e)} isClearable />
                    </CCol>
                    <CCol md={4}>
                        <FormLabel>Pending</FormLabel>
                        <Select options={booleanOptions} value={filter.pending} onChange={e => props.setFilterPending(e)} isClearable />
                    </CCol>
                </CRow>                
                <CRow>
                    <CCol md={12}>
                        <hr></hr>
                    </CCol>
                </CRow>
            </CCardHeader>
            <CCardBody>                
                <p><em>{'Links encontrados'} ({props.movies.length})</em></p>
                <div className="table-responsive">
                <CDataTable items={props.movies}
                            fields={headers}
                            itemsPerPageSelect
                            itemsPerPage={5}
                            sorter
                            pagination
                            scopedSlots = {{
                                'Date':
                                (row)=>(
                                    <td className="text-nowrap">{row.create_date ? new Date(row.create_date).toISOString().split('T')[0] : ""}</td>
                                ),
                                'Subtitle':
                                (row)=>(
                                    <td className="text-nowrap"><FormCheck readOnly={true} checked={row.subtitle === 1} /></td>
                                ),
                                'Converting':
                                (row)=>(
                                    <td className="text-nowrap"><FormCheck readOnly={true} checked={row.converting === 1} /></td>
                                ),
                                'Pending':
                                (row)=>(
                                    <td className="text-nowrap"><FormCheck readOnly={true} checked={row.pending === 1} /></td>
                                ),
                                'Old':
                                (row)=>(
                                    <td className="text-nowrap"><FormCheck readOnly={true} checked={row.old === 1} /></td>
                                ),
                                'Ranking':
                                (row)=>(
                                    <td className="text-nowrap">
                                        <meter value={row.ranking} min="0" max="5" low="2" high="5" optimum="5"></meter>
                                    </td>
                                ),
                                'Link':
                                    (row)=>(
                                        <td className="text-nowrap"><a href={row.link} target="_blank">{row.description}</a></td>
                                    ),
                                'Actions':
                                    (row)=>(
                                    <td>
                                        <div className="d.flex justify-content-evenly text-nowrap text-center">
                                          <CTooltip content={'Editar'}>
                                            <CButton shape="pill" color="primary" size="sm" onClick={() => props.editMovie(row)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </CButton>
                                          </CTooltip>
                                          <CTooltip content={'Borrar'}>
                                            <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deleteMovie(row)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </CButton>
                                          </CTooltip>
                                        </div>
                                    </td>
                                    )
                            }}
                            />  
                </div>                
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { movie } = state

    //BEGIN DROP DOWNS =================================================================================================
    const booleanSelector = state => state.masterData.booleanQuestion
    const movieCategoriesSelector = state => state.movieCategory.movieCategories
    const languagesSelector = state => state.language.languages
    const actorsSelector = state => state.actor.actors

    const getMovieCategoryOptions = createSelector(
        movieCategoriesSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getLanguageOptions = createSelector(
        languagesSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )

    const getActorOptions = createSelector(
        actorsSelector, rows => rows.map(row => ({ value: row.id, label: row.name }))
    )

    const getBooleanOptions = createSelector(
        booleanSelector, rows => rows.map(row => ({ value: row.id, label: row.description }))
    )
    //=================================================================================================

    return {
        movies: movie.movies,
        filter: movie.filter,
        //DROP DOWNS ====================
        movieCategoryOptions: getMovieCategoryOptions(state),
        languageOptions: getLanguageOptions(state),
        actorOptions: getActorOptions(state),
        booleanOptions: getBooleanOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllMovies() {
            dispatch(movieActions.getMovies());
        },
        getMovies() {
            dispatch(movieActions.applyFilter());
        },
        addMovie() {
            dispatch(movieActions.newMovie());
            dispatch(push('/movie/new'));
        },
        editMovie(movie) {
            //Inicializa el state
            dispatch(movieActions.newMovie());
            //Carga la data
            dispatch(movieActions.editMovie(movie));
            dispatch(push(`/movie/${movie.id}`));
        },        
        async deleteMovie(movie) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ movie.description }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(movieActions.deleteMovie(movie));
        },

        // FILTROS ===============================================================================================================
        setFilterDescription(description) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { description } });
            dispatch(movieActions.applyFilter());
        },
        setFilterLink(link) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { link } });
            dispatch(movieActions.applyFilter());
        },
        setFilterMovieCategory(category) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { category } })
            dispatch(movieActions.applyFilter())
        },
        setFilterLanguage(language) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { language } })
            dispatch(movieActions.applyFilter())
        },
        setFilterActor(actor) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { actor } })
            dispatch(movieActions.applyFilter())
        },
        setFilterBoolean(converting) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { converting } })
            dispatch(movieActions.applyFilter())
        },
        setFilterPending(pending) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { pending } })
            dispatch(movieActions.applyFilter())
        },
        clearAllFilters(description, link, category, language, actor, converting, pending) {
            dispatch({ type: types.MOVIE_SET_FILTER, payload: { description, link, category, language, actor, 
                                                                converting, pending } })
            dispatch(movieActions.applyFilter())
        },

        

        // GET DATA FOR DROP DOWNS =================================================================================================
        getMovieCategories() {
            dispatch(movieCategoryActions.getMovieCategories())
        },
        getLanguages() {
            dispatch(languageActions.getLanguages())
        },
        getActors() {
            dispatch(actorActions.getActors())
        },
        // ===========================================================================================================================
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MoviesScreen)