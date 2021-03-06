import React from 'react'
import PropTypes from 'prop-types'

import { BrowserCache } from '../cache'

import { BASE_URL } from './Routes'

const propTypes = {
  token: PropTypes.string,
  route: PropTypes.string,
  updateDataTransform: PropTypes.func,
}

const defaultProps = {
  token: null,
  route: null,
  updateDataTransform: null,
}

function withData(Wrapped, cache = BrowserCache) {
  const useCache = !!cache

  class WithDataHOC extends React.Component {
    constructor(props) {
      super(props)

      this.updateData = this.updateData.bind(this)

      this.state = {
        data: null,
        error: null,
        loading: false,
      }
    }

    componentDidMount() {
      this.mounted = true
      this.loadData()
    }

    componentDidUpdate(prevProps) {
      if (this.props.token !== prevProps.token ||
          this.props.route !== prevProps.route) {
        this.loadData()
      }
    }

    componentWillUnmount() {
      this.mounted = false
    }

    getUrl() {
      return `${BASE_URL}/${this.props.route}`
    }

    loadData() {
      const { token, route } = this.props

      if (!token || !route) {
        return Promise.resolve(null)
      }

      this.setState(() => ({
        loading: true,
        error: null,
        data: null,
      }))

      const options = {
        headers: new Headers({
          Authorization: `Bearer ${token}`,
        }),
      }

      const url = this.getUrl()

      if (useCache) {
        const cached = cache.get(url)
        if (cached) {
          if (this.mounted) {
            this.setState({
              data: cached,
              loading: false,
            })
          }
          return Promise.resolve(cached)
        }
      }

      return fetch(url, options)
        .then((resp) => {
          if (!resp.ok) {
            throw Error(resp.statusText)
          }
          return resp.json()
        })
        .then((parsed) => {
          if (useCache) {
            cache.put(url, parsed)
          }
          if (this.mounted) {
            this.setState({
              data: parsed,
              loading: false,
            })
            return parsed
          }
          return null
        })
        .catch((error) => {
          if (this.mounted) {
            this.setState({
              error,
              loading: false,
            })
          }
          return error
        })
    }

    updateData(data) {
      // we want to merge the old and new data here
      this.setState((prevState) => {
        let newData
        if (this.props.updateDataTransform) {
          newData = this.props.updateDataTransform(prevState.data, data)
        } else {
          newData = Object.assign(prevState.data || {}, data)
        }
        if (useCache) {
          cache.invalidate(this.getUrl().split('?')[0])
          cache.put(this.getUrl(), newData)
        }
        return {
          data: newData,
        }
      })
    }

    render() {
      return <Wrapped {...this.props} {...this.state} updateData={this.updateData} />
    }
  }

  WithDataHOC.propTypes = propTypes
  WithDataHOC.defaultProps = defaultProps

  return WithDataHOC
}

export default withData
