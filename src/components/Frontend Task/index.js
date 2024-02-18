import React, {useState, useEffect} from 'react'
import TransactionsTable from './TransactionsTable'
import TransactionsStatistics from './TransactionsStatistics'
import TransactionsBarChart from './TransactionsBarChart'
import {fetchTransactions, fetchStatistics, fetchBarChartData} from './api'

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [statistics, setStatistics] = useState({})
  const [barChartData, setBarChartData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('March')
  const [searchText, setSearchText] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const transactionsData = await fetchTransactions(selectedMonth)
        setTransactions(transactionsData)

        const statisticsData = await fetchStatistics(selectedMonth)
        setStatistics(statisticsData)

        const barChartData = await fetchBarChartData(selectedMonth)
        setBarChartData(barChartData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [selectedMonth])

  const handleSearch = async searchText => {
    setSearchText(searchText)
    try {
      const filteredTransactions = await fetchTransactions(
        selectedMonth,
        searchText,
      )
      setTransactions(filteredTransactions)
    } catch (error) {
      console.error('Error fetching filtered transactions:', error)
    }
  }

  const handleNextPage = async () => {
    setCurrentPage(currentPage + 1)
    try {
      const nextPageTransactions = await fetchTransactions(
        selectedMonth,
        searchText,
        currentPage + 1,
      )
      setTransactions(nextPageTransactions)
    } catch (error) {
      console.error('Error fetching next page transactions:', error)
    }
  }

  const handlePreviousPage = async () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      try {
        const prevPageTransactions = await fetchTransactions(
          selectedMonth,
          searchText,
          currentPage - 1,
        )
        setTransactions(prevPageTransactions)
      } catch (error) {
        console.error('Error fetching previous page transactions:', error)
      }
    }
  }

  return (
    <div>
      <select
        value={selectedMonth}
        onChange={e => setSelectedMonth(e.target.value)}
      ></select>
      <TransactionsStatistics statistics={statistics} />
      <TransactionsTable
        transactions={transactions}
        searchText={searchText}
        currentPage={currentPage}
        onNext={handleNextPage}
        onPrevious={handlePreviousPage}
        onSearch={handleSearch}
      />
      <TransactionsBarChart data={barChartData} />
    </div>
  )
}

export default Dashboard
