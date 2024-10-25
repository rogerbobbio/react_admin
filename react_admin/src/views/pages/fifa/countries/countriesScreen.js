import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CTooltip } from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faBinoculars, faEdit, faTrash  } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { push } from 'connected-react-router';

import { types } from '../../../../types/types';
import countryActions from 'src/actions/fifa/countryActions';

function CountriesScreen(props) {

    const [ showFilter, setShowFilter ] = useState(false);
    const [ subTitle, setSubTitle ] = useState('Paises registrados');
    const { filter, setFilterName, getCountries } = props;

    useEffect(() => {
        getCountries()
    }, [getCountries])

    const headers = (columns) => {
        return <tr>{columns.map((columName, index) => <th key={index} className="text-nowrap text-center">{columName}</th>)}</tr>
    }

    const addCountry = () => {
        props.addCountry();
    }
    
    const toggleFilter = () => {
        const show = !showFilter;        
        setShowFilter(show);
        setSubTitle('Paises encontrados');
        filter.name = '';
        if (!show)
        {
            setSubTitle('Paises registrados');
            filter.name = null;
            getCountries();
        }            
    }

    const countryList = (countries) => {
        return countries.map((row, index) => <tr key={index}>
            <td>
                <div className="d.flex justify-content-evenly text-nowrap text-center">
                  <CTooltip content={'Editar'}>
                    <CButton shape="pill" color="primary" size="sm" onClick={() => props.editCountry(row)}>
                        <FontAwesomeIcon icon={faEdit} />
                    </CButton>
                  </CTooltip>
                  <CTooltip content={'Borrar'}>
                    <CButton shape="pill" color="secondary" size="sm" onClick={() => props.deleteCountry(row)}>
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
                        <h1>Lista de Paises</h1>
                    </div>
                    <div className="col">
                        <div className="text-right">
                            <CButton shape="pill" color="primary" onClick={addCountry}>
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
                <p><em>{subTitle} ({props.countries.length})</em></p>
                <div className="table-responsive">
                        <table className="table table-bordered">
                                <thead className="thead-light">
                                    {headers(['', 'Nombre'])}
                                </thead>
                                <tbody>
                                    {countryList(props.countries)}
                                </tbody>
                        </table>
                </div>
            </CCardBody>
          </CCard>
        </>
    )
}

const mapStateToProps = state => {
    const { country } = state;

    return {
        countries: country.countries,
        filter: country.filter,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getCountries() {
            dispatch(countryActions.getCountries());
        },
        addCountry() {
            dispatch(countryActions.newCountry());
            dispatch(push('/country/new'));
        },
        editCountry(country) {
            //Inicializa el state
            dispatch(countryActions.newCountry());
            //Carga la data
            dispatch(countryActions.editCountry(country));
            dispatch(push(`/country/${country.id}`));
        },
        setFilterName(name) {
            //console.log(userName);
            if (name === '')
              name = null;
            //console.log(userName);
            dispatch({ type: types.COUNTRY_SET_FILTER, payload: { name } });
            dispatch(countryActions.applyFilter());
        },
        async deleteCountry(country) {
            const result = await Swal.fire({
              title: '¿Desea borrar el registro?',
              text: `Esta apunto de borrar el registro ${ country.name }`,
              icon: 'question',
              showCancelButton: true,
              confirmButtonText: `Borrar`,
            })
            if (result.isConfirmed)
              dispatch(countryActions.deleteCountry(country));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CountriesScreen)