import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardFooter, CCardHeader, CRow } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faUndoAlt  } from '@fortawesome/free-solid-svg-icons';
import { goBack } from 'connected-react-router';
import { useParams } from 'react-router';
import { Form, FormControl, FormGroup, FormLabel, Col, FormCheck } from 'react-bootstrap';
import { createSelector } from 'reselect';
import ReactStars from "react-rating-stars-component";

import movieActions from 'src/actions/links/movieActions';
import actorActions from 'src/actions/links/actorActions';
import languageActions from 'src/actions/links/languageActions';
import movieCategoryActions from 'src/actions/links/movieCategoryActions';

function MovieScreen(props) {
    const params = useParams();
    const refForm = useRef(null);
    const [validated, setValidated] = useState(false);

    const { description, link, category_id, actor_id, language_id, subtitle, serie, old, ranking, 
            converting, pending, note,
            getActors, getLanguages, getMovieCategories,
            actorOptions, languageOptions, movieCategoryOptions } = props;

    useEffect(() => {
        getActors()
        getLanguages()
        getMovieCategories()
    }, [getActors, getLanguages, getMovieCategories])

    const isEdit = () => {       
        if (params.id === 'new')
           return false
        return true
     }

     const cancel = () => {
        props.cancel()
    }

    const save = (event) => {
        const form = refForm.current;
        if (form.checkValidity() === true) {
            if (isEdit())
                props.update();
            else
                props.create();
        }
        setValidated(true);
        event.preventDefault();
        event.stopPropagation();
    }

    const onChangeControl = (e) => {
        if(!e.currentTarget) {
            props.setControlValue('ranking', e)
        } else {
            if (e.currentTarget.type === 'checkbox')
              props.setControlValue(e.currentTarget.id, e.currentTarget.checked ? 1 : 0)
            else
              props.setControlValue(e.currentTarget.id, e.currentTarget.value)
        }        
    }

    const title = isEdit() ? 'Editar Link' : 'Nuevo Link';

    return (
        <> 
          <CCard>
              <CCardHeader>
                <CRow>
                    <div className="col">
                        <h1>{title}</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={save}>
                                <FontAwesomeIcon icon={faSave} /> Grabar
                            </CButton>
                            <CButton shape="pill" color="secondary" onClick={cancel}>
                                <FontAwesomeIcon icon={faUndoAlt} /> Cancel
                            </CButton>
                        </div>
                    </div>
                </CRow>
              </CCardHeader>
              <CCardFooter>
                    <Form ref={refForm} validated={validated} id='form'>
                        <FormGroup>
                            <FormLabel>Descripcion</FormLabel>
                            <FormControl id="description" type="text" value={description}
                                placeholder="Ingrese descripcion" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Url</FormLabel>
                            <FormControl id="link" type="text" value={link}
                                placeholder="Ingrese Url" required onChange={onChangeControl}/>
                            <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Ranking</FormLabel>
                            <ReactStars id="ranking" count={5} value={ranking} size={24} activeColor="#ffd700" onChange={onChangeControl}/>
                        </FormGroup>
                        <Form.Row>
                            <FormGroup as={Col}>
                                <FormGroup>
                                    <FormLabel>Categoria</FormLabel>
                                    <FormControl id="category_id" as="select" value={category_id} required onChange={onChangeControl}>
                                        {movieCategoryOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Actor</FormLabel>
                                    <FormControl id="actor_id" as="select" value={actor_id} required onChange={onChangeControl}>
                                        {actorOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Idioma</FormLabel>
                                    <FormControl id="language_id" as="select" value={language_id} required onChange={onChangeControl}>
                                        {languageOptions.map((r, i) => <option key={i} value={r.value}>{r.description}</option>)}
                                    </FormControl>
                                    <Form.Control.Feedback type="invalid">Campo requerido.</Form.Control.Feedback>
                                </FormGroup>                                
                            </FormGroup>
                            <FormGroup as={Col} className="text-center">
                                <FormGroup>
                                    <FormLabel>Subtitulo</FormLabel>
                                    <FormCheck id="subtitle" checked={subtitle === 1} onChange={onChangeControl} />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Serie</FormLabel>
                                    <FormCheck id="serie" checked={serie === 1} onChange={onChangeControl} />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Old</FormLabel>
                                    <FormCheck id="old" checked={old === 1} onChange={onChangeControl} />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Converting</FormLabel>
                                    <FormCheck id="converting" checked={converting === 1} onChange={onChangeControl} />
                                </FormGroup>
                                <FormGroup>
                                    <FormLabel>Pending</FormLabel>
                                    <FormCheck id="pending" checked={pending === 1} onChange={onChangeControl} />
                                </FormGroup>
                            </FormGroup>
                        </Form.Row>
                        <FormGroup>
                           <FormLabel>Notas</FormLabel>
                           <Form.Control id="note" as="textarea" rows={2} value={note} onChange={onChangeControl} />
                        </FormGroup>                        
                    </Form>
              </CCardFooter>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { movie } = state;

    const actorsSelector = state => state.actor.actors
    const languagesSelector = state => state.language.languages
    const movieCategoriesSelector = state => state.movieCategory.movieCategories

    const getActorOptions = createSelector(actorsSelector, row => {
          const values = row.map(x => ({ value: x.id, description: x.name }))
          values.unshift({ value: '', description: '' })
          return values
        }
    )

    const getLanguageOptions = createSelector(languagesSelector, row => {
        const values = row.map(x => ({ value: x.id, description: x.description }))
        values.unshift({ value: '', description: '' })
        return values
      }
    )

    const getMovieCategoryOptions = createSelector(movieCategoriesSelector, row => {
        const values = row.map(x => ({ value: x.id, description: x.description }))
        values.unshift({ value: '', description: '' })
        return values
      }
    )

    return {
        description: movie.movie.description,
        link: movie.movie.link,
        category_id: movie.movie.category_id, 
        actor_id: movie.movie.actor_id,
        language_id: movie.movie.language_id,
        subtitle: movie.movie.subtitle,
        serie: movie.movie.serie,
        old: movie.movie.old,
        converting: movie.movie.converting,
        pending: movie.movie.pending,
        ranking: movie.movie.ranking,
        note: movie.movie.note,

        actorOptions: getActorOptions(state),
        languageOptions: getLanguageOptions(state),
        movieCategoryOptions: getMovieCategoryOptions(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cancel() {
            dispatch(goBack());
        },
        setControlValue(propertyName, propertyValue) {
            dispatch(movieActions.updateMovieProperty(propertyName, propertyValue));
        },
        create() {
            dispatch(movieActions.addMovie());
        },
        update() {
            dispatch(movieActions.updateMovie());
        },


        //GET DATA FOR DROP DOWNS ===============================================================
        getActors() {
            dispatch(actorActions.getActors());
        },
        getLanguages() {
            dispatch(languageActions.getLanguages());
        },
        getMovieCategories() {
            dispatch(movieCategoryActions.getMovieCategories());
        }
        //=======================================================================================
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieScreen)