import React from 'react'
import PropTypes from 'prop-types'
import { PieChart, Pie } from 'recharts'

import withToken from './datafetching/Token'

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
  token: PropTypes.string,
}
const defaultProps = {
  width: 360,
  height: 400,
  fill: '#8884d8',
  token: null,
}

class MineVisitStats extends React.Component {
  constructor(props) {
    super(props)

    const data = []

    this.state = {
      data,
    }
  }

  componentDidMount() {
    this.mounted = true
    this.loadData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.token !== prevProps.token) {
      this.loadData()
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  setData(newData) {
    this.setState({ data: newData })
  }

  loadData() {
    const { token } = this.props
    const url = 'https://i1api.nrs.gov.bc.ca/mwsl-reports-api/v1/minevisitsstatistics?dateFrom=2017-01-01T00:00:00&dateTo=2018-01-01T00:00:00'

    if (!token) {
      return
    }

    const options = {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    }

    fetch(url, options)
      .then((resp) => {
        if (!resp.ok) {
          throw Error(resp.statusText)
        }
        return resp.json()
      })
      .then((parsed) => {
        if (this.mounted) {
          const tempData = []
          parsed.mineTypeVisitsStatistics.forEach((minevisitdata) => {
            if (minevisitdata.dangerousOccurrenceCount > 100) {
              tempData.push({
                name: minevisitdata.mineTypeName,
                value: minevisitdata.dangerousOccurrenceCount,
              })
            }
          })
          this.setData(tempData)
        }
      })
  }


  render() {
    const { width, height, fill } = this.props
    const { data } = this.state

    return (
      <PieChart width={width} height={height}>
        <Pie data={data} dataKey="value" fill={fill} label />
      </PieChart>
    )
  }
}

MineVisitStats.propTypes = propTypes
MineVisitStats.defaultProps = defaultProps

export default withToken(MineVisitStats)
