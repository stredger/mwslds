import React from 'react'
import PropTypes from 'prop-types'

import './MinesSearch.css'

import Input from './input'
import { selectTransform } from './datatransform'

import { MINES_ROUTE } from './datafetching/Routes'

const propTypes = {
  onFilter: PropTypes.func,
  onSearch: PropTypes.func,
  prefix: PropTypes.string,
}

const defaultProps = {
  onFilter: undefined,
  onSearch: undefined,
  prefix: null,
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props)

    this.onFilter = this.onFilter.bind(this)
    this.onSearch = this.onSearch.bind(this)
    this.onShowAdvancedToggle = this.onShowAdvancedToggle.bind(this)

    this.filterableParams = [
      {
        name: 'permitteeCompanyCode',
        type: 'data-select',
        route: 'companies',
        transform: selectTransform('companies', 'code', 'code'),
        inputGroup: 1,
        width: 20,
      },
      {
        name: 'regionCode',
        type: 'data-select',
        route: 'regions',
        transform: selectTransform('regions', 'code', 'code'),
        inputGroup: 1,
        width: 20,
      },
      {
        name: 'mineTypeCode',
        type: 'data-select',
        route: 'minetypes',
        transform: selectTransform('mineTypes', 'code', 'name'),
        inputGroup: 1,
        width: 20,
      },
      {
        name: 'mineStatusCode',
        type: 'data-select',
        route: 'minestatuses',
        transform: selectTransform('mineStatuses', 'code', 'name'),
        inputGroup: 1,
        width: 20,
      },
      {
        name: 'underInvestigation',
        type: 'checkbox',
        inputGroup: 2,
      },
      {
        name: 'major',
        type: 'checkbox',
        inputGroup: 2,
      },
      {
        name: 'withIssues',
        type: 'checkbox',
        inputGroup: 2,
      },
    ]

    const state = {
      main: '',
      route: MINES_ROUTE,
      showAdvanced: false,
    }

    this.filterableParams.forEach((param) => { state[param.name] = '' })
    this.state = state
  }

  onInputChange(param) {
    return (value) => {
      this.updateState(param, value)

      const params = this.getValidParams()
      // have to set the new value here as updateState happens async.
      // also, inputs of 0 work here as we get the string "0"... cheeky!
      if (!value && value !== false) {
        delete params[param]
      } else {
        params[param] = value
      }

      this.props.onFilter(params)
    }
  }

  onFilter(evt) {
    evt.preventDefault()
    const params = this.getValidParams()
    this.props.onFilter(params)
  }

  onSearch() {
    this.props.onSearch(this.state.main)
  }

  onShowAdvancedToggle() {
    this.setState(prevState => ({
      showAdvanced: !prevState.showAdvanced,
    }))
  }

  getValidParams() {
    const params = {}
    this.filterableParams.forEach((param) => {
      const val = this.state[param.name]
      if (val) {
        params[param.name] = val
      }
    })
    return params
  }

  updateState(param, value) {
    this.setState({
      [param]: value,
    })
  }

  renderMainInput() {
    return (
      <div className="form-group form-main form-line input-group">
        <Input
          name=""
          type="text"
          value={undefined} // dont control this input
          onChange={this.props.onSearch}
          prefix={this.props.prefix}
          width="88%"
        >
          <span className="form-inline">
            <button className="btn btn-default" type="button" onClick={this.onShowAdvancedToggle}>
              {this.state.showAdvanced ? 'Hide' : 'Show'} Advanced
            </button>
          </span>
        </Input>
      </div>
    )
  }

  renderSubInputs() {
    const inputs = []

    this.filterableParams.forEach((param) => {
      const {
        name,
        type,
        inputGroup,
        main,
        route,
        transform,
        width,
      } = param

      if (main) {
        return
      }

      if (!inputs[inputGroup]) {
        inputs[inputGroup] = []
      }

      const input = (
        <Input
          key={name}
          name={name}
          type={type}
          value={this.state[name]}
          onChange={this.onInputChange(name)}
          route={route}
          transform={transform}
          prefix={this.props.prefix}
          width={width && `${width}%`}
        />
      )

      inputs[inputGroup].push(input)
    })

    return inputs.map((inputList, idx) => (
      <div key={idx} className="input-group form-line form-spacing">
        {inputList}
      </div>
    ))
  }

  render() {
    return (
      <form>
        {this.renderMainInput()}
        {this.state.showAdvanced && this.renderSubInputs()}
      </form>
    )
  }
}

SearchBar.propTypes = propTypes
SearchBar.defaultProps = defaultProps

export default SearchBar
